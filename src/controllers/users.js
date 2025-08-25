import pool from "../config/db.js";

// GET all Users
export const getUsers = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users ORDER BY id DESC");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// CREATE new User
export const createUser = async (req, res) => {
    try {
        const { first_name, last_name, email } = req.body;
        const result = await pool.query(
            "INSERT INTO users (first_name, last_name, email) VALUES ($1, $2, $3) RETURNING *",
            [first_name, last_name, email]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};
