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

//before each test is run, reset mock function data to forget anything from previous tests.
beforeEach(() => {
  jest.clearAllMocks();
});

describe("POST /api/confirm-return", () => {
  it("should confirm return of booking", async () => {
    let bookingId = 1;
    pool.query.mockResolvedValueOnce({});
    const response = await request(app).post('/api/returns/confirm-return')
    .send({ bookingId: bookingId });
    expect(response.status).toBe(200);
    //check correct UPDATE SQL query was run
    expect(pool.query).toHaveBeenCalledWith(
      "UPDATE bookings SET status = $1 WHERE id = $2", ["closed(good)",bookingId]
    );
  });
});
    