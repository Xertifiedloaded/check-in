import databaseConnection from '@/lib/database';
import User from '@/model/User';

export default async function handler(req, res) {
  await databaseConnection();

  if (req.method === 'POST') {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({ message: 'OTP is required' });
    }

    try {
      // Fetch user by OTP
      const user = await User.findOne({ otp });

      if (!user) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }

      // Check if OTP has expired
      if (Date.now() > user.otpExpiry) {
        return res.status(400).json({ message: 'OTP expired' });
      }

      // Verify OTP
      user.isVerified = true;
      user.otp = undefined; // Remove OTP
      user.otpExpiry = undefined; // Remove OTP expiry
      await user.save();

      res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}