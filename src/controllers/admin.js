import pool from "../config/db.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
export const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
        const result = await pool.query("SELECT * FROM admins WHERE username = $1 AND password = $2", [username, hashedPassword]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Invalid username or password." });
        }
        const admin = result.rows[0];

        const token = jwt.sign(
            { id: admin.id, username: admin.username },
            process.env.JWT_SECRET || "default_secret",
            { expiresIn: "2h" }
        );

        res.cookie("adminToken", token, { httpOnly: true, secure: true, sameSite: 'Strict' }).status(200).json({
            success: true,
            message: "Login successful",
        })
        ;
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
        b.status,
        b.start_time,
        b.end_time,
        k.id AS kit_id,
        k.name AS kit_name,
        k.type AS kit_type,
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
                    status: row.status,
                    startTime: row.start_time,
                    endTime: row.end_time,
                    kits: [],
                };
            }

            if (row.kit_id) {
                bookingsMap[row.booking_id].kits.push({
                    id: `KIT-${row.kit_id}`,
                    name: row.kit_name,
                    type: row.kit_type,
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


// Delete booking and user
export const deleteBooking = async (req,res)=>{
  const client = await pool.connect();
  try {
    const { bookingId } = req.body;

    await client.query("BEGIN");

    // 1. Delete kits linked to booking
    await client.query("DELETE FROM booking_kits WHERE booking_id = $1", [bookingId]);

    // 2. Get booking so we know which user to delete
    const bookingRes = await client.query(
      "SELECT user_id FROM bookings WHERE id = $1",
      [bookingId]
    );
    if (bookingRes.rows.length === 0) {
      throw new Error("Booking not found");
    }
    const userId = bookingRes.rows[0].user_id;

    // 3. Delete booking
    await client.query("DELETE FROM bookings WHERE id = $1", [bookingId]);

    // 4. Delete user
    await client.query("DELETE FROM users WHERE id = $1", [userId]);

    await client.query("COMMIT");

    res.json({ success: true, message: "Booking and user deleted." });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Delete booking error:", err);
    res.status(500).json({ error: "Server error" });
  } finally {
    client.release();
  }
}