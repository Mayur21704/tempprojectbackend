// import mongoose from "mongoose";

// const seatAssignmentSchema = new mongoose.Schema({
//   seatNumber: {
//     type: String,
//     required: true,
//   },
//   travelerId: {
//     type: String,
//     required: true,
//   },
// });

// const flightDetailsSchema = new mongoose.Schema({
//   flightOfferId: {
//     type: String,
//     required: true,
//   },
//   airlineName: {
//     type: String,
//     required: true,
//   },
//   airlineLogo: {
//     type: String,
//     required: true,
//   },
//   itineraries: [
//     {
//       duration: {
//         type: String,
//         required: true,
//       },
//       segments: [
//         {
//           departure: {
//             iataCode: {
//               type: String,
//               required: true,
//             },
//           },
//           arrival: {
//             iataCode: {
//               type: String,
//               required: true,
//             },
//           },
//           flightNumber: {
//             type: String,
//             required: true,
//           },
//           aircraft: {
//             code: {
//               type: String,
//               required: true,
//             },
//           },
//           duration: {
//             type: String,
//             required: true,
//           },
//         },
//       ],
//     },
//   ],
//   price: {
//     currency: {
//       type: String,
//       required: true,
//     },
//     total: {
//       type: Number,
//       required: true,
//     },
//     base: {
//       type: Number,
//       required: true,
//     },
//     grandTotal: {
//       type: Number,
//       required: true,
//     },
//   },
//   travelerPricings: [
//     {
//       travelerId: {
//         type: String,
//         required: true,
//       },
//       price: {
//         currency: {
//           type: String,
//           required: true,
//         },
//         total: {
//           type: Number,
//           required: true,
//         },
//       },
//     },
//   ],
// });

// // Main Booking Schema
// const bookingSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User', // Reference to User model
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//   },
//   selectedFlights: {
//     outbound: flightDetailsSchema,
//     return: flightDetailsSchema, // This will be optional
//   },
//   passengers: {
//     adults: [
//       {
//         travelerId: {
//           type: String,
//           required: true,
//         },
//         firstName: {
//           type: String,
//           required: true,
//         },
//         lastName: {
//           type: String,
//           required: true,
//         },
//         dateOfBirth: {
//           type: Date,
//           required: true,
//         },
//         seatAssignments: [seatAssignmentSchema],
//       },
//     ],
//     children: [
//       {
//         travelerId: {
//           type: String,
//           required: true,
//         },
//         firstName: {
//           type: String,
//           required: true,
//         },
//         lastName: {
//           type: String,
//           required: true,
//         },
//         dateOfBirth: {
//           type: Date,
//           required: true,
//         },
//         seatAssignments: [seatAssignmentSchema],
//       },
//     ],
//   },
//   bookingStatus: {
//     type: String,
//     enum: ['pending', 'confirmed', 'cancelled'],
//     default: 'pending',
//   },
//   bookingDate: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const Booking = mongoose.model('Booking', bookingSchema);

// export default Booking;

// import mongoose from "mongoose";

// const seatAssignmentSchema = new mongoose.Schema({
//   seatNumber: {
//     type: String,
//     required: true,
//   },
//   travelerId: {
//     type: String,
//     required: true,
//   },
// });

// const flightDetailsSchema = new mongoose.Schema({
//   flightOfferId: {
//     type: String,
//     required: true,
//   },
//   airlineName: {
//     type: String,
//     required: true,
//   },
//   airlineLogo: {
//     type: String,
//     required: true,
//   },
//   itineraries: [
//     {
//       duration: {
//         type: String,
//         required: true,
//       },
//       segments: [
//         {
//           departure: {
//             iataCode: {
//               type: String,
//               required: true,
//             },
//             terminal: {
//               type: String,
//               required: true,
//             },
//             at: {
//               type: String,
//               required: true,
//             },
//           },
//           arrival: {
//             iataCode: {
//               type: String,
//               required: true,
//             },
//             terminal: {
//               type: String,
//               required: true,
//             },
//             at: {
//               type: String,
//               required: true,
//             },
//           },
//           flightNumber: {
//             type: String,
//             required: true,
//           },
//           aircraft: {
//             code: {
//               type: String,
//               required: true,
//             },
//           },
//           duration: {
//             type: String,
//             required: true,
//           },
//         },
//       ],
//     },
//   ],
//   price: {
//     currency: {
//       type: String,
//       required: true,
//     },
//     total: {
//       type: Number,
//       required: true,
//     },
//     base: {
//       type: Number,
//       required: true,
//     },
//     grandTotal: {
//       type: Number,
//       required: true,
//     },
//   },
//   travelerPricings: [
//     {
//       travelerId: {
//         type: String,
//         required: true,
//       },
//       travelerType: {
//         type: String,
//         required: true,
//       },
//       fareDetailsBySegment: [
//         {
//           cabin: { type: String, required: true },
//           amenities: [
//             {
//               description: {
//                 type: String,
//               },
//               isChargeable: {
//                 type: String,
//               },
//             },
//           ],
//         },
//       ],

//       price: {
//         currency: {
//           type: String,
//           required: true,
//         },
//         total: {
//           type: Number,
//           required: true,
//         },
//       },
//     },
//   ],
// });

// // Main Booking Schema
// const bookingSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User', // Reference to User model
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//   },
//   selectedFlights: {
//     outbound: flightDetailsSchema,
//     return: flightDetailsSchema, // This will be optional
//   },
//   passengers: {
//     adults: [
//       {
//         travelerId: {
//           type: String,
//           required: true,
//         },
//         firstName: {
//           type: String,
//           required: true,
//         },
//         lastName: {
//           type: String,
//           required: true,
//         },
//         dateOfBirth: {
//           type: Date,
//           required: true,
//         },
//         seatAssignments: [seatAssignmentSchema],
//       },
//     ],
//     children: [
//       {
//         travelerId: {
//           type: String,
//           required: true,
//         },
//         firstName: {
//           type: String,
//           required: true,
//         },
//         lastName: {
//           type: String,
//           required: true,
//         },
//         dateOfBirth: {
//           type: Date,
//           required: true,
//         },
//         seatAssignments: [seatAssignmentSchema],
//       },
//     ],
//   },
//   bookingStatus: {
//     type: String,
//     enum: ['pending', 'confirmed', 'cancelled'],
//     default: 'pending',
//   },
//   bookingDate: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const Booking = mongoose.model('Booking', bookingSchema);

// export default Booking;

// import mongoose from "mongoose";

// const seatAssignmentSchema = new mongoose.Schema({
//   seatNumber: {
//     type: String,
//     required: true,
//   },
//   travelerId: {
//     type: String,
//     required: true,
//   },
// });

// const flightDetailsSchema = new mongoose.Schema({
//   flightOfferId: {
//     type: String,
//     required: true,
//   },
//   airlineName: {
//     type: String,
//     required: true,
//   },
//   airlineLogo: {
//     type: String,
//     required: true,
//   },
//   itineraries: [
//     {
//       duration: {
//         type: String,
//         required: true,
//       },
//       segments: [
//         {
//           departure: {
//             iataCode: {
//               type: String,
//               required: true,
//             },
//           },
//           arrival: {
//             iataCode: {
//               type: String,
//               required: true,
//             },
//           },
//           flightNumber: {
//             type: String,
//             required: true,
//           },
//           aircraft: {
//             code: {
//               type: String,
//               required: true,
//             },
//           },
//           duration: {
//             type: String,
//             required: true,
//           },
//         },
//       ],
//     },
//   ],
//   price: {
//     currency: {
//       type: String,
//       required: true,
//     },
//     total: {
//       type: Number,
//       required: true,
//     },
//     base: {
//       type: Number,
//       required: true,
//     },
//     grandTotal: {
//       type: Number,
//       required: true,
//     },
//   },
//   travelerPricings: [
//     {
//       travelerId: {
//         type: String,
//         required: true,
//       },
//       price: {
//         currency: {
//           type: String,
//           required: true,
//         },
//         total: {
//           type: Number,
//           required: true,
//         },
//       },
//     },
//   ],
// });

// // Main Booking Schema
// const bookingSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User', // Reference to User model
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//   },
//   selectedFlights: {
//     outbound: flightDetailsSchema,
//     return: flightDetailsSchema, // This will be optional
//   },
//   passengers: {
//     adults: [
//       {
//         travelerId: {
//           type: String,
//           required: true,
//         },
//         firstName: {
//           type: String,
//           required: true,
//         },
//         lastName: {
//           type: String,
//           required: true,
//         },
//         dateOfBirth: {
//           type: Date,
//           required: true,
//         },
//         seatAssignments: [seatAssignmentSchema],
//       },
//     ],
//     children: [
//       {
//         travelerId: {
//           type: String,
//           required: true,
//         },
//         firstName: {
//           type: String,
//           required: true,
//         },
//         lastName: {
//           type: String,
//           required: true,
//         },
//         dateOfBirth: {
//           type: Date,
//           required: true,
//         },
//         seatAssignments: [seatAssignmentSchema],
//       },
//     ],
//   },
//   bookingStatus: {
//     type: String,
//     enum: ['pending', 'confirmed', 'cancelled'],
//     default: 'pending',
//   },
//   bookingDate: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const Booking = mongoose.model('Booking', bookingSchema);

// export default Booking;

// unstrucchred models
// models/booking.js

import mongoose from "mongoose";
const Schema = mongoose.Schema;

const bookingSchema = new Schema(
  {
    userId: {
      type: String,
      ref: "User",
      required: true, // Make it optional
    },
    email: {
      type: String,
      required: true, // Make it optional
    },
    selectedFlights: {
      type: Object,
      required: true,
    },
    passengers: {
      type: Object,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
    },
    ticketUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
