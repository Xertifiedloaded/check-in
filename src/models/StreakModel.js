
import mongoose from 'mongoose';

const StreakSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  streak: { type: Number, default: 1 },
  lastCheckInDate: { type: String, required: true }, 
});

export default mongoose.models.Streak || mongoose.model('Streak', StreakSchema);
