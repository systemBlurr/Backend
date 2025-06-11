
import express from 'express';
import productController from '../Controllers/ProductController.js';
const productRouter = express.Router();

productRouter.get('/products', productController.getProducts);
productRouter.post('/product', productController.upsertProduct);
productRouter.post('/product/:id', productController.upsertProduct);
productRouter.delete('/product/:id', productController.deleteProduct);


export default productRouter

