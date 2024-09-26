import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: function () {
      return !this.isGoogleAuth
    },
  },
  profilePicture: { type: String },
  otp: { type: String },
  otpExpiry: { type: Date },
  isGoogleAuth: { type: Boolean, default: false },
  permissions: [{ type: String }],
  verificationToken: { type: String },
  verificationTokenExpiry: { type: Date },
  googleId: String,
  isVerified: { type: Boolean, default: false },
})

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12)
  }
  next()
})

export default mongoose.models.User || mongoose.model("User", userSchema)
