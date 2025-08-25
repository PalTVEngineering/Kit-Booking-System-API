import pool from "../config/db.js";

// CREATE new Booking
export const createBookings = async (req, res) => {
    try {
        const { user_id, start_time, end_time } = req.body;
        const result = await pool.query(
            "INSERT INTO bookings (user_id, start_time, end_time) VALUES ($1, $2, $3) RETURNING *",
            [user_id, start_time, end_time]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// GET all Bookings
export const getBookings = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM bookings ORDER BY id DESC");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};