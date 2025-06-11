
import express from 'express';
import productionController from '../Controllers/ProductionController.js';

const productionRouter = express.Router();

productionRouter.get('/production-list', productionController.getProductions);
productionRouter.post('/production', productionController.upsertProduction);
productionRouter.post('/production/:id', productionController.upsertProduction);
productionRouter.delete('/production/:id', productionController.deleteProduction);

export default productionRouter

