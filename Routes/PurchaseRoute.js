
import express from 'express';
import purchaseController from '../Controllers/PurchaseController.js';
const purchaseRouter = express.Router();

purchaseRouter.get('/purchase-list', purchaseController.getPurchaseList);
purchaseRouter.post('/purchase', purchaseController.upsertPurchase);
purchaseRouter.post('/purchase/:id', purchaseController.upsertPurchase);
purchaseRouter.delete('/purchase/:id', purchaseController.deletePurchaseDetails);

purchaseRouter.get('/suppliers', purchaseController.getSuppliers);
purchaseRouter.get('/products', purchaseController.getProducts);



export default purchaseRouter

