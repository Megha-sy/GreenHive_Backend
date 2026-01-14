const User = require("../../models/usermodels/User");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../../utils/token");
const sendEmail = require("../../utils/sendEmail");
const crypto = require("crypto");

/* =========================
   REGISTER
========================= */
exports.registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      address,
      shopName,
      phone,
    } = req.body;

    // ❌ Block admin self-registration
    if (role === "admin") {
      return res.status(403).json({
        message: "Admin registration not allowed",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    // ❗ Validate seller shop name
    if (role === "seller" && !shopName) {
      return res.status(400).json({
        message: "Shop name is required for seller registration",
      });
    }

    await User.create({
      name,
      email,
      password,
      role: role || "user",
      address,
      phone,

      // ⭐ Seller specific fields
      shopName: role === "seller" ? shopName : undefined,
      sellerStatus: role === "seller" ? "pending" : undefined,
    });

    res.status(201).json({
      message:
        role === "seller"
          ? "Seller application submitted. Await admin approval."
          : "Registration successful. Please login.",
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   LOGIN
========================= */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Validate
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // 2️⃣ Find user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3️⃣ Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // 🚫 Block disabled users
    if (!user.isActive) {
      return res
        .status(403)
        .json({ message: "Account disabled by admin" });
    }

    // 🚫 Block sellers until approved
    if (
      user.role === "seller" &&
      user.sellerStatus !== "approved"
    ) {
      return res.status(403).json({
        message: "Seller account pending admin approval",
      });
    }

    // 4️⃣ Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
         shopName: user.shopName || null, 
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
}
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res
        .status(401)
        .json({ message: "Refresh token required" });
    }

    const decoded = verifyRefreshToken(refreshToken);
    const newAccessToken = generateAccessToken(decoded.id);

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({
      message: "Invalid or expired refresh token",
    });
  }
};
exports.changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("+password");

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields required" });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password incorrect" });
    }

    // 🔥 IMPORTANT: assign and save
    user.password = newPassword;
    await user.save(); // pre-save hook hashes password

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Change Password Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not registered" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "Reset Password",
      html: `<p>Click <a href="${resetLink}">here</a> to reset password</p>`,
    });

    res.json({ message: "Reset link sent to registered email" });

  } catch (err) {
    console.error("FORGOT PASSWORD ERROR 👇", err); // 🔥 IMPORTANT
    res.status(500).json({ message: "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const resetToken = req.params.token;

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    }).select("+password");

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ message: "Password reset failed" });
  }
};
