Awesome! Let's build the backend from scratch step by step. We'll use Express, MongoDB, and Mongoose for data modeling and routes. Here's the plan for the backend structure:

1. Backend Folder Structure:
bash
Copy
/backend
  /controllers
    flightController.js
    passengerController.js
    seatBookingController.js
    bookingSummaryController.js
  /models
    Flight.js
    Passenger.js
    SeatBooking.js
    BookingSummary.js
  /routes
    flightRoutes.js
    passengerRoutes.js
    seatBookingRoutes.js
    bookingSummaryRoutes.js
  /middleware
    authMiddleware.js
  /config
    db.js
  server.js

  
2. Step-by-Step Backend Setup
Step 1: Setup Express & MongoDB Connection
Initialize a Node.js Project: Start by initializing a new project and installing the necessary packages:

bash
Copy
mkdir backend
cd backend
npm init -y
npm install express mongoose dotenv
npm install --save-dev nodemon
Create server.js: This file will handle the basic Express server setup and database connection.

js
Copy
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import flightRoutes from './routes/flightRoutes.js';
import passengerRoutes from './routes/passengerRoutes.js';
import seatBookingRoutes from './routes/seatBookingRoutes.js';
import bookingSummaryRoutes from './routes/bookingSummaryRoutes.js';

dotenv.config();

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Routes
app.use('/api/flights', flightRoutes);
app.use('/api/passengers', passengerRoutes);
app.use('/api/seatBookings', seatBookingRoutes);
app.use('/api/bookingSummary', bookingSummaryRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
Create .env File: Create a .env file at the root of your backend project to store sensitive data such as the MongoDB URI.

env
Copy
MONGO_URI=mongodb://localhost:27017/flightBooking
Step 2: Create Models
Flight Model (models/Flight.js):

js
Copy
import mongoose from 'mongoose';

const flightSchema = new mongoose.Schema({
  airlineName: { type: String, required: true },
  flightNumber: { type: String, required: true },
  itineraries: [
    {
      segments: [
        {
          departure: {
            iataCode: { type: String, required: true },
            dateTime: { type: Date, required: true },
          },
          arrival: {
            iataCode: { type: String, required: true },
            dateTime: { type: Date, required: true },
          },
          aircraft: {
            code: { type: String, required: true },
          },
        },
      ],
    },
  ],
  travelerPricings: [
    {
      travelerType: { type: String, enum: ['ADULT', 'CHILD'], required: true },
      fareDetailsBySegment: [
        {
          cabin: { type: String, enum: ['ECONOMY', 'BUSINESS'], required: true },
        },
      ],
    },
  ],
});

const Flight = mongoose.model('Flight', flightSchema);
export default Flight;
Passenger Model (models/Passenger.js):

js
Copy
import mongoose from 'mongoose';

const passengerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  email: { type: String, required: true },
});

const Passenger = mongoose.model('Passenger', passengerSchema);
export default Passenger;
SeatBooking Model (models/SeatBooking.js):

js
Copy
import mongoose from 'mongoose';

const seatBookingSchema = new mongoose.Schema({
  passengerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Passenger', required: true },
  flightId: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight', required: true },
  seatNumber: { type: String, required: true },
  segment: { type: String, enum: ['outbound', 'return'], required: true },
  status: { type: String, default: 'booked' },
}, {
  timestamps: true,
});

const SeatBooking = mongoose.model('SeatBooking', seatBookingSchema);
export default SeatBooking;
BookingSummary Model (models/BookingSummary.js):

js
Copy
import mongoose from 'mongoose';

const bookingSummarySchema = new mongoose.Schema({
  passengerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Passenger', required: true },
  flightId: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight', required: true },
  selectedSeats: [{ type: String }],
  totalPrice: { type: Number, required: true },
  status: { type: String, default: 'pending' },
});

const BookingSummary = mongoose.model('BookingSummary', bookingSummarySchema);
export default BookingSummary;
Step 3: Create Controllers
Flight Controller (controllers/flightController.js):

js
Copy
import Flight from '../models/Flight.js';

// Get all flights
export const getAllFlights = async (req, res) => {
  try {
    const flights = await Flight.find();
    res.json(flights);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
Passenger Controller (controllers/passengerController.js):

js
Copy
import Passenger from '../models/Passenger.js';

// Create a new passenger
export const createPassenger = async (req, res) => {
  try {
    const { firstName, lastName, dateOfBirth, email } = req.body;
    const newPassenger = new Passenger({ firstName, lastName, dateOfBirth, email });
    await newPassenger.save();
    res.json(newPassenger);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
SeatBooking Controller (controllers/seatBookingController.js):

js
Copy
import SeatBooking from '../models/SeatBooking.js';

// Book a seat
export const bookSeat = async (req, res) => {
  try {
    const { passengerId, flightId, seatNumber, segment } = req.body;

    const existingBooking = await SeatBooking.findOne({ seatNumber, flightId, segment });

    if (existingBooking) {
      return res.status(400).json({ message: 'Seat already booked!' });
    }

    const seatBooking = new SeatBooking({ passengerId, flightId, seatNumber, segment });
    await seatBooking.save();
    res.json(seatBooking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
BookingSummary Controller (controllers/bookingSummaryController.js):

js
Copy
import BookingSummary from '../models/BookingSummary.js';

// Create booking summary
export const createBookingSummary = async (req, res) => {
  try {
    const { passengerId, flightId, selectedSeats, totalPrice } = req.body;
    const bookingSummary = new BookingSummary({ passengerId, flightId, selectedSeats, totalPrice });
    await bookingSummary.save();
    res.json(bookingSummary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


Step 4: Create Routes
Flight Routes (routes/flightRoutes.js):

js
Copy
import express from 'express';
import { getAllFlights } from '../controllers/flightController.js';

const router = express.Router();

router.get('/', getAllFlights);

export default router;
Passenger Routes (routes/passengerRoutes.js):

js
Copy
import express from 'express';
import { createPassenger } from '../controllers/passengerController.js';

const router = express.Router();

router.post('/', createPassenger);

export default router;
SeatBooking Routes (routes/seatBookingRoutes.js):

js
Copy
import express from 'express';
import { bookSeat } from '../controllers/seatBookingController.js';

const router = express.Router();

router.post('/book', bookSeat);

export default router;
BookingSummary Routes (routes/bookingSummaryRoutes.js):

js
Copy
import express from 'express';
import { createBookingSummary } from '../controllers/bookingSummaryController.js';

const router = express.Router();

router.post('/', createBookingSummary);

export default router;
Step 5: Test the Backend
Run the backend server using:

bash
Copy
nodemon server.js
You can use Postman or any API testing tool to test the endpoints:

POST /api/flights/: Get all flights.
POST /api/passengers/: Create a passenger.
POST /api/seatBookings/book: Book a seat for a passenger.
POST /api/bookingSummary/: Create a booking summary.
This should give you a full working backend for flight bookings, seat selections, and booking summaries.



You said:
ok wait i have already something ok backend wait i will provdide you everthing from that
ChatGPT said:
ChatGPT
Got it! Just let me know when you're ready and provide the details you have. I'll be here to help you with whatever you need to modify or extend your current backend.


You said:

import express from "express";
import dotenv from "dotenv";
import Amadeus from "amadeus";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET,
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

connectDB();

// Use authentication routes
app.use("/api/v1/", authRoutes);

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
    maxPrice,
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
    max: 25,
    children,
  };

  if (returnDate) searchParams.returnDate = returnDate;
  if (maxPrice) searchParams.maxPrice = maxPrice;

  try {
    const response = await amadeus.shopping.flightOffersSearch.get(
      searchParams
    );
    res.json(response.result);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(Server is running on http://localhost:${PORT});
});  wait i have more till analye
ChatGPT said:
ChatGPT
Sure! Go ahead and provide the rest of the code, and we'll take a look at everything to analyze and figure out what changes or improvements we can make to your backend. I'm ready to help!


You said:
 import express from "express";
import { registerUser, protectedRoute } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public route for registration/login
router.post("/register", registerUser);

// Protected route
router.get("/protected", protect, protectedRoute);

export default router;  wait
ChatGPT said:
ChatGPT
Got it! You've provided your authRoutes and part of the backend setup. Now, let's take a step back and review the overall structure you're building here:

What We Have So Far:
Backend Setup (server.js or index.js):

Basic setup with express, dotenv, cors, morgan for logging, and connecting to the database.
You're integrating the Amadeus API for flight searches and city searches.
A couple of routes are set up: /api/v1/searchCity and /api/v1/flightOffers.
Authentication Routes (authRoutes.js):

Routes for user registration and a protected route (which seems to require some form of user authentication).
Auth Controller (authController.js):

You seem to have registerUser and protectedRoute functions here. The protectedRoute is probably used for authenticated access.
Middlewares (authMiddleware.js):

Looks like a protect middleware to enforce authentication on protected routes.
Now, we can work on expanding the backend based on the components you’ve already shared. The next steps might include:
Models:

You might need models to manage your flight bookings, passenger data, seats, etc., since you're working with flight bookings, passengers, and seat selection.
You’ll need a User Model (for authentication and registration) and possibly a Booking Model (to store flight details, passengers, seat selections, etc.).
Controllers:

You’ll need controllers to handle your flight search, booking, seat booking, and passenger management (perhaps from Redux).
We can integrate flight data, passenger management, and seat availability into these controllers.
Routes:

A dedicated set of routes for handling booking operations: such as booking a flight, adding passengers, selecting seats, and processing payment (if applicable).
Database:

We'll need to define the schema for the Booking model (with passengers, seats, and selected flights).
Would you like to start with model definitions and database integration next? You can give me more context on the models you need (Booking, Passenger, etc.), and I can help design them for you!

Let me know how you'd like to proceed!


You said:
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  displayName: { type: String, required: true },
  photoURL: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

export default User;  wait
ChatGPT said:
ChatGPT
Great! You're defining the User model with uid, email, displayName, and photoURL. This seems to be a model for user authentication, likely integrating with Firebase or a similar service for managing users.

Here's a quick overview of what you've done so far with the User model:
Schema: You defined fields like uid, email, displayName, and photoURL — which makes sense for user profiles.
Model: You then created the User model, which is exported for use in controllers.
Next steps could include defining other models for the flight booking system, such as Bookings, Passengers, and Seats.

We can now move forward with some other models that might be needed based on the seat booking and flight details system:
1. Booking Model
This would represent a user's booking details (including the selected flight, passengers, and seats).

javascript
Copy
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User who made the booking
  flightDetails: {
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    departureDate: { type: Date, required: true },
    returnDate: { type: Date },
    travelClass: { type: String, enum: ["ECONOMY", "BUSINESS"], required: true },
    airline: { type: String, required: true },
    flightNumber: { type: String, required: true },
  },
  passengers: [
    {
      passengerType: { type: String, enum: ["ADULT", "CHILD", "INFANT"], required: true },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      seatNumber: { type: String, required: true }, // Seat assigned to this passenger
    },
  ],
  totalPrice: { type: Number, required: true }, // Booking cost
  status: { type: String, enum: ["BOOKED", "PENDING", "CANCELLED"], default: "PENDING" },
  createdAt: { type: Date, default: Date.now },
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
2. Seat Model
For managing the seat availability, booked seats, and mapping each seat to a flight.

javascript
Copy
import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
  flightId: { type: mongoose.Schema.Types.ObjectId, ref: "Flight", required: true }, // The flight this seat belongs to
  seatNumber: { type: String, required: true }, // Seat code (e.g., 5A)
  seatClass: { type: String, enum: ["ECONOMY", "BUSINESS"], required: true }, // The class of seat
  status: { type: String, enum: ["AVAILABLE", "BOOKED", "UNAVAILABLE"], default: "AVAILABLE" }, // Current status
});

const Seat = mongoose.model("Seat", seatSchema);

export default Seat;
3. Passenger Model
To store the details of passengers associated with a booking.

javascript
Copy
import mongoose from "mongoose";

const passengerSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true }, // Booking ID
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  seatNumber: { type: String }, // Seat number assigned to the passenger
  passengerType: { type: String, enum: ["ADULT", "CHILD", "INFANT"], required: true },
  passportNumber: { type: String }, // Optional
});

const Passenger = mongoose.model("Passenger", passengerSchema);

export default Passenger;
What's Next:
Booking Controller: Handle the logic for creating bookings, retrieving bookings for a user, and updating booking status (e.g., confirm, cancel).

Seat Selection Logic: You can create controller methods that handle seat availability, booking a seat for a passenger, etc.

Integrating Flight Data: After a flight is selected, you can integrate the seat selection logic with flight data from Amadeus.

Would you like to proceed with creating the controllers for these models (Booking, Passenger, Seat)? Let me know how you'd like to proceed!


You said:
import jwt from "jsonwebtoken";
import User from "../models/user.js";

// Register or login a user
export const registerUser = async (req, res) => {
  const { uid, email, displayName, photoURL } = req.body;
  console.log(uid, email, displayName, photoURL);

  if (!uid || !email) {
    return res.status(400).json({ error: "Login Error" });
  }

  try {
    let user = await User.findOne({ uid });

    if (!user) {
      // Create a new user if not found
      user = await User.create({ uid, email, displayName, photoURL });
    }

    // Generate JWT token
    const token = jwt.sign({ uid: user.uid }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Return both user data and token in the response
    res.json({
      token,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error, please try again." });
  }
};

// Protected route example (you'd need authentication middleware to protect this)
export const protectedRoute = (req, res) => {
  res.json({ uid: req.user.uid, email: req.user.email });
};  wait
ChatGPT said:
ChatGPT
Great! You're handling user registration/login logic here. This includes checking for an existing user, creating a new user if needed, and generating a JWT token for authentication.

Let's break down what's happening:

Register or Login (JWT Token Generation)
User Registration/Checking:

If the uid exists, it checks if the user is already in the database. If not, it creates a new user with the provided information.
JWT Generation:

After successfully finding or creating the user, it generates a JWT token containing the uid of the user, which can be used for authenticating future requests. The token expires in 1 hour.
Response:

Sends back the JWT token along with the user details (such as uid, email, etc.) for the frontend to store and use for authentication.
Next Step: Protected Route
You also have a protected route (/protected), which requires authentication. The route returns some user data (uid and email) once the JWT token has been verified by middleware (the protect middleware).

What's Next:
protect Middleware: This middleware will be used to verify the JWT token on routes where you want to enforce authentication (like in your protected routes).

Booking Controller: Now that user registration is in place, we can implement controllers for booking flights, selecting seats, and other related actions.

Would you like to go ahead with protect middleware, or do you want to move to the controllers for booking, passengers, and seats? Let me know how you'd like to proceed!


You said:
import jwt from "jsonwebtoken";

// Middleware to protect routes
export const protect = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied, no token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request object
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    res.status(403).json({ error: "Invalid token." });
  }
};  now i have this backend from app.js i started so now give me full backend from scratch lets start to book flight yeshhhhhhhhhhhhhhhh
ChatGPT said:
ChatGPT
Awesome! Now we're getting to the exciting part: flight booking, seat selection, and integrating all those features into your backend.

Let's go step-by-step and build everything you need for the backend to handle the entire flight booking process. Here's how we can approach it:

1. Flight Booking Process Overview
You want to allow users to:

Search flights based on various criteria (e.g., origin, destination, date, passengers).
Book flights after selecting a flight.
Select seats for passengers once a flight is booked.
Handle user authentication using JWT for secure routes.
2. Database Models and Schema Design
We'll need a few models to handle this functionality:

Flight: To store flight details (such as price, origin, destination, date).
Booking: To track the bookings made by users.
Seat: To track available and booked seats on flights.
Passenger: To track passenger details and seat selections.
3. Flight Booking Flow
We'll go through the following steps:

Search Flights: Query flights from the Amadeus API (already implemented).
Book Flight: Create a booking in the database once a user confirms a flight.
Select Seats: Let the user choose seats for each passenger.
Save Booking: Save the booking and seat information.
Let's start building from scratch, beginning with the backend structure.

1. Models
We'll create models for Booking, Flight, Seat, and Passenger. I'll outline each schema.

Flight Model (Flight.js)
javascript
Copy
import mongoose from 'mongoose';

const flightSchema = new mongoose.Schema({
  flightNumber: { type: String, required: true },
  airline: { type: String, required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  departureDate: { type: Date, required: true },
  returnDate: { type: Date, default: null },
  availableSeats: { type: Number, required: true },
  price: { type: Number, required: true },
  class: { type: String, enum: ['ECONOMY', 'BUSINESS'], required: true },
});

const Flight = mongoose.model('Flight', flightSchema);
export default Flight;
Booking Model (Booking.js)
javascript
Copy
import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  flight: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight', required: true },
  passengers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Passenger' }],
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['PENDING', 'CONFIRMED'], default: 'PENDING' },
  createdAt: { type: Date, default: Date.now },
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
Passenger Model (Passenger.js)
javascript
Copy
import mongoose from 'mongoose';

const passengerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  seat: { type: String, default: null },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
});

const Passenger = mongoose.model('Passenger', passengerSchema);
export default Passenger;
Seat Model (Seat.js)
javascript
Copy
import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
  flight: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight', required: true },
  seatNumber: { type: String, required: true },
  isBooked: { type: Boolean, default: false },
  passenger: { type: mongoose.Schema.Types.ObjectId, ref: 'Passenger', default: null },
});

const Seat = mongoose.model('Seat', seatSchema);
export default Seat;
2. Controllers
We need controllers to handle the core logic, like booking a flight, selecting seats, etc.

Flight Controller (flightController.js)
javascript
Copy
import Flight from '../models/Flight.js';
import Booking from '../models/Booking.js';
import Seat from '../models/Seat.js';
import Passenger from '../models/Passenger.js';

// Search available flights
export const searchFlights = async (req, res) => {
  const { origin, destination, departureDate, returnDate, travelClass } = req.query;
  
  try {
    const flights = await Flight.find({
      origin,
      destination,
      departureDate: { $gte: new Date(departureDate) },
      ...(returnDate && { returnDate: { $gte: new Date(returnDate) } }),
      class: travelClass,
    });
    res.json(flights);
  } catch (error) {
    res.status(500).json({ error: "Error fetching flights" });
  }
};

// Book flight
export const bookFlight = async (req, res) => {
  const { flightId, passengers, totalPrice } = req.body;

  try {
    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({ error: "Flight not found" });
    }

    // Create booking
    const booking = await Booking.create({
      user: req.user.uid,
      flight: flightId,
      passengers: [],
      totalPrice,
    });

    // Create passengers and assign seats
    const passengerDocuments = [];
    for (const passengerData of passengers) {
      const passenger = await Passenger.create({
        ...passengerData,
        booking: booking._id,
      });

      // Select seat
      const availableSeat = await Seat.findOne({ flight: flightId, isBooked: false }).sort('seatNumber');
      if (!availableSeat) {
        return res.status(400).json({ error: "No available seats" });
      }

      availableSeat.isBooked = true;
      availableSeat.passenger = passenger._id;
      await availableSeat.save();

      passenger.seat = availableSeat.seatNumber;
      await passenger.save();

      passengerDocuments.push(passenger);
    }

    // Update booking with passengers
    booking.passengers = passengerDocuments.map(p => p._id);
    await booking.save();

    res.json({ booking, passengers: passengerDocuments });
  } catch (error) {
    res.status(500).json({ error: "Error booking flight" });
  }
};
3. Routes
Now we can define routes to handle flight searches and bookings.

Flight Routes (flightRoutes.js)
javascript
Copy
import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { searchFlights, bookFlight } from '../controllers/flightController.js';

const router = express.Router();

// Route for searching flights
router.get('/search', searchFlights);

// Route for booking a flight
router.post('/book', protect, bookFlight);

export default router;
4. Integrating the Routes
In your app.js, you should now integrate the routes to handle flight searching and booking.

javascript
Copy
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import flightRoutes from './routes/flightRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

connectDB();

// Use authentication routes
app.use('/api/v1/', authRoutes);
app.use('/api/v1/flights', flightRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
5. Summary
We’ve created the following components:

Models: Flight, Booking, Passenger, and Seat.
Controllers: For flight search and flight booking with seat selection.
Routes: Exposed endpoints to search flights and book them.
Middleware: To protect routes with JWT authentication.
What’s Next?
Test the flight booking process end-to-end.
Handle edge cases like overbooking, seat unavailability, etc.
Add error handling to improve the user experience.
Let me know how you'd like to proceed with testing or enhancing any specific part!






Reason

