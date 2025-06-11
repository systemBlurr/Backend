
import express from 'express';
import supplierController from '../Controllers/SupplierController.js';
const supplierRouter = express.Router();

supplierRouter.get('/suppliers', supplierController.getSuppliers);
supplierRouter.post('/supplier', supplierController.upsertSupplier);
supplierRouter.post('/supplier/:id', supplierController.upsertSupplier);
supplierRouter.delete('/supplier/:id', supplierController.deleteSupplier);
export default supplierRouter



