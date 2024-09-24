
import mongoose from 'mongoose';

const CheckInSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  date: { type: String, required: true }, 
});

export default mongoose.models.CheckIn || mongoose.model('CheckIn', CheckInSchema);
