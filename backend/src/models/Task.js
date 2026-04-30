import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: String,
  status: {
    type: String,
    default: 'pending'
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }

}, { timestamps: true });

export default mongoose.model('Task', taskSchema);