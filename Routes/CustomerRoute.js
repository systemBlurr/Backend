
import express from 'express';
import customerController from '../Controllers/CustomerController.js';
const customerRouter = express.Router();

customerRouter.get('/customers', customerController.getCustomers);
customerRouter.post('/customer', customerController.upsertCustomer);
customerRouter.post('/customer/:id', customerController.upsertCustomer);
customerRouter.delete('/customer/:id', customerController.deleteCustomer);
export default customerRouter



