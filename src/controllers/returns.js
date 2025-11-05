import pool from "../config/db.js";

// 1. Find bookings for a given user
export const findUserBookings = async (req, res) => {
  try {
    const { first_name, last_name } = req.body;

    // 1. Find the user

    //since every new booking creates a new user record, we need to handle multiple user IDs for the same person
    const userResult = await pool.query(
      "SELECT id FROM users WHERE first_name = $1 AND last_name = $2",
      [first_name, last_name]
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    //build array of user IDs corresponding to the user
    let user_arr = [];
    for (let user of userResult.rows){
      user_arr.push(user.id);
    }

    // 2. Get all bookings for that user

    //get all bookings with user_id in user_arr
    const bookingRes = await pool.query(
      "SELECT * FROM bookings WHERE user_id = ANY($1) AND status = $2 ORDER BY start_time DESC",
      [user_arr, "active"]
    );
    if (bookingRes.rows.length === 0) {
      return res.status(404).json({ error: "No bookings found for this user" });
    }
    else{
      return res.status(200).json(bookingRes.rows);
    }

  } catch (err) {
    console.error("Find user bookings error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

//2. get booking and kit details for selected booking
export const getBookingAndKits = async (req, res) => {
  try {
    //booking ID passed in query params
    const bookingId  = req.query.bookingId;
    //get booking
    const bookingRes = await pool.query(
      "SELECT * FROM bookings WHERE id=$1 ORDER BY start_time DESC LIMIT 1",
      [bookingId]
    );
    const booking = bookingRes.rows[0]
    //get kit for booking
    const kitsRes = await pool.query(
      `SELECT k.id, k.name, k.type, bk.quantity
       FROM booking_kits bk
       JOIN kit k ON bk.kit_id = k.id -- CORRECTED: kits -> kit
       WHERE bk.booking_id = $1`,
      [bookingId]
    );
    booking.kits = kitsRes.rows;
    res.json({booking});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


// 3. Confirm return of kits (NO CHANGES NEEDED HERE)
export const confirmReturn = async (req, res) => {
  try {
    const { bookingId } = req.body;

    // Set status to closed(good)
    //TODO: Set status to closed(missing) if a comment is submitted once comment form is complete.
    await pool.query("UPDATE bookings SET status = $1 WHERE id = $2", ["closed(good)",bookingId]);


    res.json({ success: true, message: "Return confirmed" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};