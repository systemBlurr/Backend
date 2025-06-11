
import express from 'express';
import salesController from '../Controllers/SalesController.js';
const salesRouter = express.Router();

salesRouter.get('/sales-list', salesController.getSales);
salesRouter.post('/sales', salesController.upsertSales);
salesRouter.post('/sales/:id', salesController.upsertSales);
salesRouter.delete('/sales/:id', salesController.deleteSales);

salesRouter.get('/customers', salesController.getCustomers);
salesRouter.get('/products', salesController.getProducts);



export default salesRouter

