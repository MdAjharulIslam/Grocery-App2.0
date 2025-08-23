import express from 'express';  
import { upload } from '../configs/multer.js';
import authSeller from '../middlewares/authSeller.js';
import { addProduct, changeStock, productById, productList } from '../controllers/productController.js';

const ProductRouter = express.Router();

ProductRouter.post('/add', upload.array('image'), authSeller, addProduct); // important: 'image' matches frontend
ProductRouter.get('/list', productList);
ProductRouter.get('/id', productById);
ProductRouter.post('/stock', authSeller, changeStock);

export default ProductRouter;
