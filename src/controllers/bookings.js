import nodemailer from "nodemailer";
import pool from "../config/db.js";

export const createBookings = async (req, res) => {
  try {
    const { user_id, start_time, end_time, email, kits } = req.body;

    // 1. Insert booking into DB
    const result = await pool.query(
      "INSERT INTO bookings (user_id, start_time, end_time) VALUES ($1, $2, $3) RETURNING *",
      [user_id, start_time, end_time]
    );

    const booking = result.rows[0];

    // 2. Setup Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Build HTML kit list
    const kitList = kits?.length
      ? `<ul>${kits.map((k) => `<li>${k.name} (${k.type})</li>`).join("")}</ul>`
      : "<p><i>No kits selected</i></p>";

    // Format date/time
    const bookingDate = start_time.split(" ")[0];
    const bookingStart = start_time.split(" ")[1];
    const bookingEnd = end_time.split(" ")[1];

    // 3. Email options with HTML
    const mailOptions = {
      from: `"PalTV Kit Bookings" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "✅ PalTV Booking Confirmation",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <h2 style="color: #1976d2;">Your Booking is Confirmed 🎉</h2>
          <p>Hi,</p>
          <p>Your kit booking has been confirmed.</p>

          <h3>📅 Booking Details:</h3>
          <p><strong>Date:</strong> ${bookingDate}</p>
          <p><strong>Time:</strong> ${bookingStart} → ${bookingEnd}</p>

          <h3>🎥 Selected Kits:</h3>
          ${kitList}

          <hr/>
          <p>Make sure you scan the QR code in the kit room when you return the kit.</p>
          <p style="font-size: 0.9em; color: #777;">If you no longer need this booking or want to change the booking, let the Head of Engineering know you no longer need this one.</p>
        </div>
      `,
    };

    // 4. Send email
    await transporter.sendMail(mailOptions);

    // 5. Respond with booking
    res.status(201).json({ success: true, booking });

  } catch (err) {
    console.error("Booking creation error:", err);
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