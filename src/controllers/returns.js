import pool from "../config/db.js";

// 1. Find bookings for a given user
export const findUserBookings = async (req, res) => {
  try {
    const { first_name, last_name } = req.body;

    // 1. Find the user
    const userResult = await pool.query(
      "SELECT * FROM users WHERE first_name = $1 AND last_name = $2",
      [first_name, last_name]
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const user = userResult.rows[0];

    // 2. Get the latest booking
    const bookingRes = await pool.query(
      "SELECT * FROM bookings WHERE user_id = $1 ORDER BY start_time DESC LIMIT 1",
      [user.id]
    );
    if (bookingRes.rows.length === 0) {
      return res.status(404).json({ error: "No bookings found for this user" });
    }
    const booking = bookingRes.rows[0];

    // 3. Get kits for that booking
    const kitsRes = await pool.query(
      `SELECT k.id, k.name, k.type, bk.quantity
       FROM booking_kits bk
       JOIN kit k ON bk.kit_id = k.id -- CORRECTED: kits -> kit
       WHERE bk.booking_id = $1`,
      [booking.id]
    );

    booking.kits = kitsRes.rows;

    res.json({ booking, user });
  } catch (err) {
    console.error("Find user bookings error:", err);
    res.status(500).json({ error: "Server error" });
  }
};


// 2. Get kits for a booking
export const getBookingKits = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const result = await pool.query(
      `SELECT k.id, k.name, k.type, bk.quantity
       FROM booking_kits bk
       JOIN kit k ON bk.kit_id = k.id -- CORRECTED: kits -> kit
       WHERE bk.booking_id = $1`,
      [bookingId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// 3. Confirm return of kits (NO CHANGES NEEDED HERE)
export const confirmReturn = async (req, res) => {
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

    res.json({ success: true, message: "Return confirmed, booking and user deleted." });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Confirm return error:", err);
    res.status(500).json({ error: "Server error" });
  } finally {
    client.release();
  }
};