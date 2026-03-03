const mockClient = {
  query: jest.fn(),
  release: jest.fn(),
};

//mock database
jest.mock("../config/db.js", () => ({
  __esModule: true,
  default: {
    connect: jest.fn(() => mockClient),   
    query: jest.fn(),                     
  },
}));

import pool from "../config/db.js"; 
import request from "supertest";
import app from "../app.js";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("DELETE /booking/delete", () => {
  it("should delete booking, kits, and user", async () => {
    const bookingId = 67;
    // mock login to pass the authentication
    pool.query
      .mockResolvedValueOnce({
        rows: [{ id: 1, username: "admin", password: "hashed" }]
      })
    // send login request to get cookie
    const loginRes = await request(app)
      .post("/api/admin/login")
      .send({
        username: "admin",
        password: "password123"
      });
    
    const cookies = loginRes.headers["set-cookie"];
    expect(cookies).toBeDefined();

    //Mock SQL responses in the order they are called
    mockClient.query
      .mockResolvedValueOnce({})                                   // BEGIN
      .mockResolvedValueOnce({})                                   // DELETE FROM booking_kits
      .mockResolvedValueOnce({ rows: [{ user_id: 69 }] })          // SELECT user_id - 69 is the mock user id 
      .mockResolvedValueOnce({})                                   // DELETE booking
      .mockResolvedValueOnce({})                                   // DELETE user
      .mockResolvedValueOnce({});                                  // COMMIT

      const response = await request(app)
      .delete("/api/admin/booking/delete")
      .set("Cookie", cookies) // send cookie for authentication
      .send({ bookingId })
      
    //check response status
    expect(response.status).toBe(200);

    //check correct DELETE SQL queries were run
    expect(mockClient.query).toHaveBeenCalledWith(
      "DELETE FROM bookings WHERE id = $1",
      [bookingId]
    );

    expect(mockClient.query).toHaveBeenCalledWith(
      "DELETE FROM users WHERE id = $1",
      [69]//mock user ID from earlier
    );

    //check client was released
    expect(mockClient.release).toHaveBeenCalled();
  });
});

describe("POST /admin/login", () => {

  it("logs in admin and sets HttpOnly cookie", async () => {
    const fakeAdmin = {
      id: 1,
      username: "admin",
      password: "hashed_pw"
    };

    pool.query.mockResolvedValueOnce({
      rows: [fakeAdmin]
    });

    const res = await request(app)
      .post("/api/admin/login")
      .send({
        username: "admin",
        password: "password123"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    // Cookie checks
    const cookies = res.headers["set-cookie"];
    expect(cookies).toBeDefined();
    expect(cookies[0]).toMatch(/adminToken=/);
    expect(cookies[0]).toMatch(/HttpOnly/);
  });

  it("returns 401 for invalid credentials", async () => {
  pool.query.mockResolvedValueOnce({ rows: [] });

  const res = await request(app)
    .post("/api/admin/login")
    .send({
      username: "wrong",
      password: "wrong"
    });

  expect(res.statusCode).toBe(401);
  expect(res.body.error).toBe("Invalid username or password.");
});
});


describe("GET /admin/bookings", () => {
  it("allows access with valid JWT cookie", async () => {
    // 1️⃣ Mock login DB query
    pool.query
      .mockResolvedValueOnce({
        rows: [{ id: 1, username: "admin", password: "hashed" }]
      })
      // 2️⃣ Mock bookings query
      .mockResolvedValueOnce({
        rows: [
          {
            booking_id: 1,
            first_name: "Jamie",
            last_name: "Smith",
            project_title: "Project A",
            status: "active",
            start_time: "2024-01-01T10:00:00Z",
            end_time: "2024-01-01T18:00:00Z",
            kit_id: 1,
            kit_name: "Sony FX30",
            kit_type: "Camera",
            quantity: 2
          },
          {
            booking_id: 1,
            first_name: "Jamie",
            last_name: "Smith",
            project_title: "Project A",
            status: "active",
            start_time: "2024-01-01T10:00:00Z",
            end_time: "2024-01-01T18:00:00Z",
            kit_id: 20,
            kit_name: "Camera Tripod",
            kit_type: "Camera Equipment (4)",
            quantity: 1
          },
          {
            booking_id: 2,
            first_name: "Jonathan",
            last_name: "Jones",
            project_title: "Project B",
            status: "active",
            start_time: "2024-02-01T09:00:00Z",
            end_time: "2024-02-01T12:00:00Z",
            kit_id: 1,
            kit_name: "Sony FX30",
            kit_type: "Camera",
            quantity: 2
          }
        ]
      });

    // 3️⃣ Login
    const loginRes = await request(app)
      .post("/api/admin/login")
      .send({
        username: "admin",
        password: "password123"
      });

    const cookies = loginRes.headers["set-cookie"];
    expect(cookies).toBeDefined();

    // 4️⃣ Access protected route with cookie
    const res = await request(app)
      .get("/api/admin/bookings")
      .set("Cookie", cookies);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBe(2); // 2 unique bookings
  });
});