import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import formRoutes from './routes/FormRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

// Routes
app.use('/api', formRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
