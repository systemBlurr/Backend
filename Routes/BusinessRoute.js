
import express from 'express';
const businessRouter = express.Router();
import BusinessController from '../Controllers/BusinessController.js'
import consoleLogMiddleware from '../Middlewares/consoleLogMiddleware.js';
businessRouter.get('/business-list' ,consoleLogMiddleware,BusinessController.getBusinesses);
businessRouter.post('/business-add', BusinessController.upsertBusinesses);
businessRouter.post('/:id', BusinessController.upsertBusinesses);
businessRouter.delete('/:id', BusinessController.deleteBusiness);

export default businessRouter


