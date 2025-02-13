// models/PdfTicket.js
import mongoose from "mongoose";

const pdfTicketSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    pdfFileId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true, // This will be the reference to the GridFS file ID
    },
    downloadUrl: {
      type: String, // Optional: If you decide to store the URL (if using external storage)
    },
  },
  { timestamps: true }
);

const PdfTicket = mongoose.model("PdfTicket", pdfTicketSchema);

export default PdfTicket;
