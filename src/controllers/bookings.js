import nodemailer from "nodemailer";
import pool from "../config/db.js";


export const createBookings = async (req, res) => {
  try {
    const { user_id, project_title, start_time, end_time, email, kitQuantities: kits } = req.body;

    // 2. Insert booking into DB (this part is unchanged)
    const result = await pool.query(
      "INSERT INTO bookings (user_id, project_title, start_time, end_time) VALUES ($1, $2, $3, $4) RETURNING *",
      [user_id, project_title, start_time, end_time]
    );

        const booking = result.rows[0];

    // 3. Insert kits with quantity into booking_kits table
    if (kits && kits.length > 0) {
      // Use the 'kits' array (which is kitQuantities) as the source of truth
      await Promise.all(
        kits.map((k) =>
          // Update the SQL query to include the 'quantity' column
          pool.query(
            "INSERT INTO booking_kits (booking_id, kit_id, quantity) VALUES ($1, $2, $3)",
            // Provide the quantity as the third parameter
            [booking.id, k.id, k.quantity]
          )
        )
      );
    }


    // 2. Setup Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Build HTML kit list using kitQuantities for email
    // Build HTML kit list for email (name + quantity only)
    const kitList = kits?.length
      ? `<ul>${kits
          .map(
            (k) => `<li>${k.name}${k.quantity > 1 ? ` (x${k.quantity})` : ""}</li>`
          )
          .join("")}</ul>`
      : "<p><i>No kits selected</i></p>";


    // Format date/time
    const datePart = start_time.split(" ")[0]; // Extracts "YYYY-MM-DD"
    const [year, month, day] = datePart.split("-");
    const bookingDate = `${day}/${month}/${year}`; // Creates "DD/MM/YYYY"

    const bookingStart = start_time.split(" ")[1].substring(0, 5); // Extracts "HH:mm"
    const bookingEnd = end_time.split(" ")[1].substring(0, 5);     // Extracts "HH:mm"
    
    // Get name of user from user id
    const name_query = await pool.query(
      "SELECT first_name, last_name FROM users WHERE id = $1",
      [user_id]
    );
    const name_rows = await name_query.rows;
    const first_name = name_rows[0].first_name;
    const last_name = name_rows[0].last_name;
    const full_name = first_name + " " + last_name;

    // 3. Email options
    const mailOptions = {
      from: `"PalTV Kit Bookings" <${process.env.EMAIL_USER}>`,
      to: email,
      cc: "cinematography@palatinate.org.uk",
      subject: "✅ PalTV Booking Confirmation",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <h2 style="color: #1976d2;">Your Booking is Confirmed</h2>
          <p>Hi ${full_name},</p>
          <p>Your kit booking has been confirmed.</p>

          <h3>📅 Booking Details:</h3>
          <p><strong>Date:</strong> ${bookingDate}</p>
          <p><strong>Time:</strong> ${bookingStart} → ${bookingEnd}</p>

          <h3>🎥 Selected Kits:</h3>
          ${kitList}

          <hr/>
          <p>Make sure you scan the QR code in the kit room when you return the kit.</p>
          <p style="font-size: 0.9em; color: #777;">If you no longer need this booking, let the Head of Engineering know via Slack.</p>
        </div>
      `,
    };

    // 4. Send email 
    // comment this out when testing 
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