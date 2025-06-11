
import express from 'express';
import adminController from '../Controllers/AdminController.js';
const adminRouter = express.Router();


adminRouter.post('/create-user',  adminController.upsertUser)
adminRouter.post('/:id/user',  adminController.upsertUser)
adminRouter.get('/users', adminController.getUsers);
adminRouter.get('/roles', adminController.getRoles);
adminRouter.get('/departments', adminController.getDepartments);
adminRouter.delete('/:id/user', adminController.deleteUser);
export default adminRouter



