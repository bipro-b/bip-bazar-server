const  express = require('express');
import { type Application, type Request, type Response } from 'express';
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan =require('morgan');

const app: Application = express();

// Middlewares
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));

// Test Route
app.get('/', (req: Request, res: Response) => {
  res.send('BIP BAZAR Multi-Tenant API is Running 🚀');
});

const productRoutes = require("./routes/productRoute");
const userRoutes = require("./routes/userRoute");

// ... other middlewares
app.use("/api/products", productRoutes);
app.use("/api/users",userRoutes);

module.exports=app;
