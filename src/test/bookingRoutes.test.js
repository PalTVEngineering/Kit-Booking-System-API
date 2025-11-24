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

import request from "supertest";
import app from "../app.js";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("DELETE /bookings", () => {
  it("should delete booking, kits, and user", async () => {
    const bookingId = 67;

    //Mock SQL responses in the order they are called
    mockClient.query
      .mockResolvedValueOnce({})                                   // BEGIN
      .mockResolvedValueOnce({})                                   // DELETE FROM booking_kits
      .mockResolvedValueOnce({ rows: [{ user_id: 69 }] })          // SELECT user_id - 69 is the mock user id 
      .mockResolvedValueOnce({})                                   // DELETE booking
      .mockResolvedValueOnce({})                                   // DELETE user
      .mockResolvedValueOnce({});                                  // COMMIT

    //check response
    const response = await request(app)
      .delete("/api/bookings/delete")
      .send({ bookingId })
      .expect(200);

    expect(response.body).toEqual({
      success: true,
      message: "Booking and user deleted.",
    });

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


