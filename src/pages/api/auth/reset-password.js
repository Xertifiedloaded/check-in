import databaseConnection from '@/lib/database';
import User from '@/model/User';

export default async function handler(req, res) {
  await databaseConnection(); 

  if (req.method === 'POST') {
    // Extract reset token and new password from request
    const { resetToken, newPassword } = req.body; 

    if (!resetToken || !newPassword) {
      return res.status(400).json({ message: 'Invalid request. Token and new password are required.' });
    }

    try {
      // Find user with the reset token and ensure token is not expired
      const user = await User.findOne({
        verificationToken: resetToken,
        verificationTokenExpiry: { $gt: new Date() }, // Token should still be valid
      });

      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired reset token' });
      }

      // Update the user's password directly; Mongoose pre-save middleware will hash it
      user.password = newPassword;

      // Clear reset token fields
      user.verificationToken = undefined;
      user.verificationTokenExpiry = undefined;

      await user.save(); 
      // Password will be hashed by pre-save middleware

      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error resetting password', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
