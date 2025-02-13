import { PDFDocument } from "pdf-lib";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url"; // Import to get __dirname for ESM
import Booking from "../models/booking.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateTicket = async (req, res) => {
  try {
    const { bookingId } = req.params; // Get bookingId from the request params
    console.log(bookingId);

    // Step 1: Fetch the booking from the database using bookingId
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Step 2: Extract booking details (flight info, passengers, etc.)
    const { selectedFlights, passengers } = booking;

    // Step 3: Generate the PDF using PDFKit
    const doc = new PDFDocument();
    let buffers = []; // This will store chunks of the PDF file as they are created

    doc.on("data", buffers.push.bind(buffers)); // Collect chunks of PDF data
    doc.on("end", async () => {
      // When the PDF is done generating, combine all buffers
      const pdfData = Buffer.concat(buffers);

      // Step 4: Store the generated PDF into MongoDB using GridFS
      const bucket = new GridFSBucket(mongoose.connection.db, {
        bucketName: "pdfs",
      });
      const uploadStream = bucket.openUploadStream(`ticket-${booking._id}.pdf`);
      uploadStream.write(pdfData);
      uploadStream.end();

      uploadStream.on("finish", () => {
        console.log(`PDF stored with filename: ticket-${booking._id}.pdf`);
        // Respond to client with success
        res.status(200).json({
          message: "PDF generated and stored successfully",
          ticketId: `ticket-${booking._id}.pdf`,
        });
      });
    });

    // Add content to the PDF (you can modify it to fit your needs)
    doc.fontSize(18).text(`Flight Ticket for Booking ID: ${booking._id}`);
    doc.fontSize(12).text(`Email: ${booking.email}`);
    doc.text("Selected Flights:");
    doc.text(JSON.stringify(selectedFlights));
    doc.text("Passengers:");
    doc.text(JSON.stringify(passengers));

    // Finalize the PDF document
    doc.end();
  } catch (error) {
    console.error("Error generating PDF ticket:", error);
    res.status(500).json({ error: "Error generating PDF ticket" });
  }
};

// controllers/pdfController.js (continued)
export const getPdfTicket = async (req, res) => {
  const { bookingId } = req.params;

  try {
    const pdfTicket = await PdfTicket.findOne({ bookingId });
    if (!pdfTicket) {
      return res.status(404).json({ error: "PDF not found" });
    }

    const db = connectDB();
    const bucket = new GridFSBucket(db, { bucketName: "pdfs" });

    const downloadStream = bucket.openDownloadStream(pdfTicket.pdfFileId);
    res.set("Content-Type", "application/pdf");
    downloadStream.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to download PDF" });
  }
};
