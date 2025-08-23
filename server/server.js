import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import 'dotenv/config'
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import ProductRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
const app = express();

const PORT = process.env.PORT || 4000;

await connectDB()
await connectCloudinary()

//alowed origins for CORS
const allowedOrigins = ['http://localhost:5173','https://green-cart-jet.vercel.app']; 

// middleware config
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 // This parses JSON bodies for requests

app.use(cookieParser());
app.use(cors({
  origin: allowedOrigins, 
  credentials: true,
}));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/user',userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', ProductRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);
 

    

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});