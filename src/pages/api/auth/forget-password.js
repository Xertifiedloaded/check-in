import databaseConnection from "@/lib/database";
import { generateResetPasswordEmail } from "@/lib/generateOtpAndResetPasswordNotification";
import transporter from "@/lib/nodemailer";
import User from "@/model/User";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  await databaseConnection(); // Ensure DB is connected

  if (req.method === "POST") {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const resetToken = uuidv4();
      const resetTokenExpiry = new Date();
      resetTokenExpiry.setMinutes(resetTokenExpiry.getMinutes() + 10); // Token valid for 10 minutes

      user.verificationToken = resetToken;
      user.verificationTokenExpiry = resetTokenExpiry;
      await user.save();

      // send token with the frontend route link
      const resetLink = `https://www.abg-funaab.com.ng/auth/reset-password/${resetToken}`;
      const mailOptions = {
        to: email,
        subject: "Password Reset Request",
        html: generateResetPasswordEmail(email,resetLink),
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: "Reset link sent successfully" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Error sending reset link", error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
