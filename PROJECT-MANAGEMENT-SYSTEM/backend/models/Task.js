import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, default: '', trim: true, maxlength: 1000 },
  assignee: { type: String, default: '', trim: true, maxlength: 80 },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
  dueDate: { type: Date, default: null }
}, { timestamps: true });

export default mongoose.model('Task', taskSchema);
