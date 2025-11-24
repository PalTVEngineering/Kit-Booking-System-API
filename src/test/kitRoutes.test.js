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

describe('GET /api/kit/', () => {
  it('should return a list of kits', async () => {
    pool.query.mockResolvedValueOnce({
      //mock data - we pretend that this is what the database returned rather than executing the SQL call
        rows:[{"id": 1,"name": "Sony FX30","type": "Camera"}] 
    });
    const response = await request(app).get('/api/kit/');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});
