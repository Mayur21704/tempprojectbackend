// // models/Flight.js
// import mongoose from "mongoose";

// const segmentSchema = new mongoose.Schema({
//   departure: {
//     iataCode: {
//       type: String,
//       required: true,
//     },
//     terminal: String,
//     at: {
//       type: Date,
//       required: true,
//     },
//   },
//   arrival: {
//     iataCode: {
//       type: String,
//       required: true,
//     },
//     terminal: String,
//     at: {
//       type: Date,
//       required: true,
//     },
//   },

//   flightNumber: {
//     type: String,
//     required: true,
//   },
//   aircraft: {
//     code: {
//       type: String,
//       required: true,
//     },
//   },

//   duration: {
//     type: String,
//     required: true,
//   },
// });

// const travelerPricingSchema = new mongoose.Schema({
//   travelerId: {
//     type: String,
//     required: true,
//   },
//   fareOption: {
//     type: String,
//     required: true,
//   },
//   travelerType: {
//     type: String,
//     enum: ["ADULT", "CHILD"],
//     required: true,
//   },
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
//   },
//   fareDetailsBySegment: [
//     {
//       segmentId: {
//         type: String,
//         required: true,
//       },
//       cabin: {
//         type: String,
//         required: true,
//       },
//       includedCheckedBags: {
//         weight: {
//           type: Number,
//           required: true,
//         },
//         weightUnit: {
//           type: String,
//           required: true,
//         },
//       },
//       amenities: [
//         {
//           description: String,
//           isChargeable: Boolean,
//           amenityType: String,
//           amenityProvider: {
//             name: String,
//           },
//         },
//       ],
//     },
//   ],
// });

// const pricingSchema = new mongoose.Schema({
//   currency: {
//     type: String,
//     required: true,
//   },
//   total: {
//     type: Number,
//     required: true,
//   },
//   base: {
//     type: Number,
//     required: true,
//   },
//   fees: [
//     {
//       amount: {
//         type: Number,
//         required: true,
//       },
//       type: {
//         type: String,
//         required: true,
//       },
//     },
//   ],
//   grandTotal: {
//     type: Number,
//     required: true,
//   },
// });

// const flightSchema = new mongoose.Schema({
//   flightOfferId: {
//     type: String,
//     required: true,
//     unique: true,
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
//       segments: [segmentSchema],
//     },
//   ],
//   price: pricingSchema,
//   travelerPricings: [travelerPricingSchema],
// });

// const Flight = mongoose.model("Flight", flightSchema);

// export default Flight;



//updated booking schema for flights


// models/Booking.js

import mongoose from "mongoose";

const seatAssignmentSchema = new mongoose.Schema({
  seatNumber: {
    type: String,
    required: true,
  },
  travelerId: {
    type: String,
    required: true,
  },
});

const flightDetailsSchema = new mongoose.Schema({
  flightOfferId: {
    type: String,
    required: true,
  },
  airlineName: {
    type: String,
    required: true,
  },
  airlineLogo: {
    type: String,
    required: true,
  },
  itineraries: [
    {
      duration: {
        type: String,
        required: true,
      },
      segments: [
        {
          departure: {
            iataCode: {
              type: String,
              required: true,
            },
          },
          arrival: {
            iataCode: {
              type: String,
              required: true,
            },
          },
          flightNumber: {
            type: String,
            required: true,
          },
          aircraft: {
            code: {
              type: String,
              required: true,
            },
          },
          duration: {
            type: String,
            required: true,
          },
        },
      ],
    },
  ],
  price: {
    currency: {
      type: String,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    base: {
      type: Number,
      required: true,
    },
    grandTotal: {
      type: Number,
      required: true,
    },
  },
  travelerPricings: [
    {
      travelerId: {
        type: String,
        required: true,
      },
      price: {
        currency: {
          type: String,
          required: true,
        },
        total: {
          type: Number,
          required: true,
        },
      },
    },
  ],
});

// Main Booking Schema
const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to User model
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  selectedFlights: {
    outbound: flightDetailsSchema,
    return: flightDetailsSchema, // This will be optional
  },
  passengers: {
    adults: [
      {
        travelerId: {
          type: String,
          required: true,
        },
        firstName: {
          type: String,
          required: true,
        },
        lastName: {
          type: String,
          required: true,
        },
        dateOfBirth: {
          type: Date,
          required: true,
        },
        seatAssignments: [seatAssignmentSchema],
      },
    ],
    children: [
      {
        travelerId: {
          type: String,
          required: true,
        },
        firstName: {
          type: String,
          required: true,
        },
        lastName: {
          type: String,
          required: true,
        },
        dateOfBirth: {
          type: Date,
          required: true,
        },
        seatAssignments: [seatAssignmentSchema],
      },
    ],
  },
  bookingStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending',
  },
  bookingDate: {
    type: Date,
    default: Date.now,
  },
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
