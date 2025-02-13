// import jwt from "jsonwebtoken";
// import User from "../models/user.js";

// // Register or login a user
// export const registerUser = async (req, res) => {
//   const { uid, email, displayName, photoURL } = req.body;
//   console.log(uid, email, displayName, photoURL);

//   if (!uid || !email) {
//     return res.status(400).json({ error: "Login Error" });
//   }

//   try {
//     let user = await User.findOne({ uid });

//     if (!user) {
//       // Create a new user if not found
//       user = await User.create({ uid, email, displayName, photoURL });
//     }

//     // Generate JWT token
//     const token = jwt.sign({ uid: user.uid }, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });

//     // Return both user data and token in the response
//     res.json({
//       token,
//       user,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error, please try again." });
//   }
// };

// Protected route example (you'd need authentication middleware to protect this

import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  const { uid, email, displayName, password, photoURL } = req.body;
  console.log(uid, email, displayName, password, photoURL);

  if (!email || !displayName || !photoURL) {
    return res
      .status(400)
      .json({ error: "Email, Name, and Photo URL are required!" });
  }

  try {
    // Check if user already exists by email (for email/password users)
    let user = await User.findOne({ email });

    if (user) {
      // If user already exists, we return an error
      return res.status(400).json({ error: "Email already registered!" });
    }
    console.log("pass", password);

    // If user is new and registering with email/password, we hash the password
    if (password) {
      user = new User({
        uid,
        email,
        displayName,
        photoURL,
        password, // Store hashed password
      });

      console.log();
    } else {
      // If it's a Google login (without password), we save it without a password
      user = new User({
        uid,
        email,
        displayName,
        photoURL,
      });
    }

    // Save the user to the database
    await user.save();

    // Generate JWT Token
    const token = jwt.sign({ uid: user.uid }, process.env.JWT_SECRET);

    // Send the response with the user data and token, and a success message
    res.status(201).json({
      message: "User registered successfully!",
      token,
      user,
    });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ error: "Server error, please try again." });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required!" });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "User not found!" });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password!" });
    }

    // Generate JWT token
    const token = jwt.sign({ uid: user.uid }, process.env.JWT_SECRET);

    return res.json({
      token,
      user,
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: "Server error, please try again." });
  }
};

export const googleLogin = async (req, res) => {
  const { email, uid, displayName, photoURL } = req.body;

  if (!email || !uid) {
    return res
      .status(400)
      .json({ error: "Email and UID are required for Google login!" });
  }

  try {
    // Check if the user already exists in the database
    let user = await User.findOne({ email });

    if (!user) {
      // If user doesn't exist, create a new user from the Google login
      user = new User({
        uid,
        email,
        photoURL,
        displayName,
      });

      // Save the new user to the database
      await user.save();
    }

    // Generate JWT token for the user (whether new or existing)
    const token = jwt.sign({ uid: user.uid }, process.env.JWT_SECRET);

    return res.json({
      token,
      user,
    });
  } catch (err) {
    console.error("Error during Google login:", err);
    res.status(500).json({ error: "Server error, please try again." });
  }
};
