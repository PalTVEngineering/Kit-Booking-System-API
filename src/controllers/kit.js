import pool from "../config/db.js";

// GET all Kit items
export const getKit = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM kit ORDER BY id ASC");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};
