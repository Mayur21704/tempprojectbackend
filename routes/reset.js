// routes/authRoutes.js
import User from "../models/user.js"; // Import your user model
import bcrypt from "bcryptjs"; // For hashing the new password

import experss from "express";
const router = experss();

router.post("/resetPassword/:token", async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    // Find user by reset token and check if it's not expired
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() }, // Check if the token hasn't expired
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }
    console.log("old", user.password);

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update only the password field, resetToken and resetTokenExpiration fields
    const result = await User.updateOne(
      { _id: user._id },
      {
        password: hashedPassword,
        resetToken: undefined,
        resetTokenExpiration: undefined,
      }
    );

    return res.status(200).json({ message: "Password reset successfully!" });
  } catch (error) {
    console.error("Error during password reset:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
