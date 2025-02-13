// import Booking from "../models/booking.js";
// import User from "../models/user.js";

// export const createBooking = async (req, res) => {
//   try {
//     const { selectedFlights, passengers, userId: uid, email } = req.body;

//     // Ensure that userId and email are passed in the request
//     if (!uid || !email) {
//       return res.status(400).json({ error: "userId and email are required." });
//     }

//     const user = await User.findOne({ uid: uid });
//     if (!user) {
//       return res.status(400).json({ error: "User not found" });
//     }

//     const newBooking = new Booking({
//       userId: uid, // Reference user by _id, do not use _id for the booking
//       email, // Save the email from the request body
//       selectedFlights,
//       passengers,
//       status: "confirmed",
//       createdAt: Date.now(),
//     });

//     await newBooking.save();

//     res.status(201).json({
//       message: "Booking created successfully!",
//       bookingData: newBooking,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error, try again later." });
//   }
// };

// export const getUserBookings = async (req, res) => {
//   try {
//     console.log(req.params);

//     const { userId } = req.params; // Assuming the userId is passed as a route parameter
//     console.log(userId);

//     // Fetch all bookings where the userId matches the user's ObjectId
//     const bookings = await Booking.find({ userId }).exec(); // No need to query the User model directly, just the Booking model

//     if (!bookings || bookings.length === 0) {
//       return res.status(404).json({ error: "No bookings found for this user" });
//     }

//     res.status(200).json({ bookings });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error, try again later." });
//   }
// };

//adding cloudniary

import cloudinary from "cloudinary";
import PDFDocument from "pdfkit"; // For generating the PDF ticket
import streamifier from "streamifier"; // To convert buffer to a stream
import User from "../models/user.js";
import Booking from "../models/booking.js";
// Helper function to generate a ticket PDF in memory
const generateTicket = (selectedFlights, passengers, userId, email) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers)); // Push the generated chunks to buffers
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(buffers); // Merge all the chunks into a single buffer

      // Resolve with the buffer, which can be uploaded directly
      resolve(pdfBuffer);
    });

    doc.on("error", (err) => {
      reject(err);
    });

    // Add details to the ticket PDF
    doc.fontSize(20).text(`Booking for User: ${userId}`, 100, 100);
    doc.text(`Email: ${email}`, 100, 130);
    doc.text(`Flight: ${selectedFlights.flightNumber}`, 100, 160);
    doc.text(
      `Passengers: ${passengers.adults} adults, ${passengers.children} children`,
      100,
      190
    );

    doc.end();
  });
};

// Controller to create a booking and upload ticket to Cloudinary
export const createBooking = async (req, res) => {
  try {
    const { selectedFlights, passengers, userId: uid, email } = req.body;

    // Ensure that userId and email are passed in the request
    if (!uid || !email) {
      return res.status(400).json({ error: "userId and email are required." });
    }

    const user = await User.findOne({ uid: uid });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Step 1: Generate the ticket (PDF in this case) in memory
    const pdfBuffer = await generateTicket(
      selectedFlights,
      passengers,
      uid,
      email
    );

    // Step 2: Upload the in-memory ticket to Cloudinary
    const uploadResponse = await cloudinary.v2.uploader.upload_stream(
      {
        folder: "flight-tickets", // Folder in Cloudinary where tickets will be stored
        public_id: `ticket-${uid}-${Date.now()}`, // Unique name for the ticket
        resource_type: "auto", // Automatically detect the resource type (image, PDF, etc.)
      },
      (error, result) => {
        if (error) {
          return res
            .status(500)
            .json({ error: "Error uploading to Cloudinary", details: error });
        }

        // Step 3: Save the booking with the Cloudinary URL
        const newBooking = new Booking({
          userId: uid,
          email: email,
          selectedFlights,
          passengers,
          status: "confirmed",
          ticketUrl: result.secure_url, // Cloudinary URL of the uploaded ticket
          createdAt: Date.now(),
        });

        newBooking
          .save()
          .then(() => {
            res.status(201).json({
              message: "Booking created successfully!",
              bookingData: newBooking,
            });
          })
          .catch((err) => {
            res.status(500).json({
              error: "Error saving booking to database",
              details: err,
            });
          });
      }
    );

    // Stream the buffer directly to Cloudinary
    streamifier.createReadStream(pdfBuffer).pipe(uploadResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error, try again later." });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    console.log(req.params);

    const { userId } = req.params; // Assuming the userId is passed as a route parameter
    console.log(userId);

    // Fetch all bookings where the userId matches the user's ObjectId
    const bookings = await Booking.find({ userId }).exec(); // No need to query the User model directly, just the Booking model

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ error: "No bookings found for this user" });
    }

    res.status(200).json({ bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error, try again later." });
  }
};
