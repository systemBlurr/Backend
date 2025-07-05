import express from 'express';
import CompanyController from "../Controllers/CompanyController.js";

const CompanyRouter = express.Router();

CompanyRouter.get('/list', CompanyController.getCompany);
CompanyRouter.post('/add', CompanyController.upsertCompany);
CompanyRouter.post('/:id', CompanyController.upsertCompany);
CompanyRouter.delete('/:id', CompanyController.deleteCompany);

export default CompanyRouter;
