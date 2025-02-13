import PDFDocument from "pdfkit";
import fs from "fs";

export const generateTicket = (selectedFlights, passengers, userId, email) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const ticketPath = `./tickets/ticket-${userId}-${Date.now()}.pdf`;

    doc.pipe(fs.createWriteStream(ticketPath));

    doc.fontSize(20).text(`Booking for User: ${userId}`, 100, 100);
    doc.text(`Email: ${email}`, 100, 130);
    doc.text(`Flight: ${selectedFlights.flightNumber}`, 100, 160);
    doc.text(
      `Passengers: ${passengers.adults} adults, ${passengers.children} children`,
      100,
      190
    );

    doc.end();

    // Resolve the path to the ticket file for upload
    doc.on("finish", () => {
      resolve(ticketPath);
    });

    doc.on("error", (err) => {
      reject(err);
    });
  });
};
