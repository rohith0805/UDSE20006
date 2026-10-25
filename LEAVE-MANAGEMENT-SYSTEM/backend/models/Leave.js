import mongoose from 'mongoose';

const leaveSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  leaveType: { type: String, enum: ['casual', 'medical'], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  days: { type: Number, required: true, min: 1 },
  reason: { type: String, required: true, trim: true, maxlength: 500 },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  reviewedAt: { type: Date, default: null },
  adminComment: { type: String, default: '', maxlength: 500 }
}, { timestamps: true });

export default mongoose.model('Leave', leaveSchema);
