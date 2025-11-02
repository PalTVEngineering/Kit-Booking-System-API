import pool from "../config/db.js";
import jwt from "jsonwebtoken";
export const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        const result = await pool.query("SELECT * FROM admins WHERE username = $1", [username]);
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

export const getAllBookingsWithKits = async (req, res) => {
    try {
        const query = `
      SELECT
        b.id AS booking_id,
        u.first_name,
        u.last_name,
        b.project_title,
        b.start_time,
        b.end_time,
        k.id AS kit_id,
        k.name AS kit_name,
        bk.quantity
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      LEFT JOIN booking_kits bk ON b.id = bk.booking_id
      LEFT JOIN kit k ON bk.kit_id = k.id
      ORDER BY b.start_time DESC;
    `;

        const { rows } = await pool.query(query);

        // Transform flat rows into nested array
        const bookingsMap = {};

        rows.forEach((row) => {
            if (!bookingsMap[row.booking_id]) {
                bookingsMap[row.booking_id] = {
                    id: `BKG-${row.booking_id.toString().padStart(4, "0")}`,
                    name: `${row.first_name} ${row.last_name || ""}`.trim(),
                    projectName: row.project_title,
                    startTime: row.start_time,
                    endTime: row.end_time,
                    kits: [],
                };
            }

            if (row.kit_id) {
                bookingsMap[row.booking_id].kits.push({
                    id: `KIT-${row.kit_id}`,
                    name: row.kit_name,
                    qty: row.quantity || 1,
                });
            }
        });

        const bookings = Object.values(bookingsMap);

        res.json(bookings);
    } catch (err) {
        console.error("Admin fetch bookings error:", err);
        res.status(500).json({ error: "Server error" });
    }
};
