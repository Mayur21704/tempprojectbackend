// // app.js

import express from "express";
import dotenv from "dotenv";
import Amadeus from "amadeus";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

import bookingRoutes from "./routes/booking.js";
import PaymentRoutes from "./routes/payment.js";
import forgetRoutes from "./routes/forget.js";
import resetRoutes from "./routes/reset.js";
import cloudinary from "cloudinary";

dotenv.config();



const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));


const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET,
});

// Configure Cloudinary with the environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


connectDB();

// Use authentication routes
app.use("/api/v1", authRoutes);
app.use("/api/v1", forgetRoutes);
app.use("/api/v1", resetRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/payment", PaymentRoutes);

app.get("/api/v1/searchCity", async (req, res) => {
  const { keyword } = req.query;

  if (!keyword) {
    return res.status(400).json({ error: "Missing required keyword" });
  }

  try {
    const response = await amadeus.referenceData.locations.get({
      keyword,
      subType: "AIRPORT",
    });

    const filteredResults = response.result.data.map((item) => ({
      name: item.name,
      iataCode: item.iataCode,
      cityName: item.address.cityName,
      countryName: item.address.countryName,
    }));

    res.json(filteredResults);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/v1/flightOffers", async (req, res) => {
  const {
    originLocationCode,
    destinationLocationCode,
    departureDate,
    returnDate,
    adults,
    currencyCode = "INR",
    nonStop = true,
    travelClass,
    children,
  } = req.query;

  if (
    !originLocationCode ||
    !destinationLocationCode ||
    !departureDate ||
    !adults
  ) {
    return res.status(400).json({
      error: "Missing required query parameters",
    });
  }

  const searchParams = {
    originLocationCode,
    destinationLocationCode,
    departureDate,
    adults,
    currencyCode,
    nonStop,
    travelClass,
    max: Math.floor(Math.random() * (50 - 15 + 1)) + 15,
    children,
  };
  console.log(searchParams.max);

  if (returnDate) searchParams.returnDate = returnDate;

  try {
    const response = await amadeus.shopping.flightOffersSearch.get(
      searchParams
    );
    res.json(response.result);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/v1/gethotels", async (req, res) => {
  const { city } = req.params;

  const response = await amadeus.referenceData.locations.hotels.byCity.get({
    cityCode: city,
  });

  console.log(response);
});

// app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
