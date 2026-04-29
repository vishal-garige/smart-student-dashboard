import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import taskRoutes from './routes/taskRoutes.js';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());


app.use(express.json());


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected ✅'))
  .catch(err => console.log(err));

app.use('/api/tasks', taskRoutes);


app.get('/', (req, res) => {
  res.send('Server running 🚀');
});


app.listen(5000, () => {
  console.log('Server started on port 5000');
});