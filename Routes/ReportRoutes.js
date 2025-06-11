
import express from 'express';
import reportController from '../Controllers/RreportController.js';

const reportRouter = express.Router();

reportRouter.get('/salse-overview', reportController.getSalseOverview);
reportRouter.get('/purchase', reportController.getPurchaseReprts);


export default reportRouter

