import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        const result = await pool.query("SELECT * FROM users WHERE first_name = $1", [username]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Invalid username or password." });
        }

        const admin = result.rows[0];

        if (admin.password !== password) {
            return res.status(401).json({ error: "Invalid username or password." });
        }

        const token = jwt.sign(
            { id: admin.id, username: admin.username },
            process.env.JWT_SECRET || "default_secret",
            { expiresIn: "2h" }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
        });
    } catch (err) {
        console.error("Admin login error:", err);
        res.status(500).json({ error: "Server error" });
    }
};
