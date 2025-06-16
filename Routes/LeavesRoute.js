
import express from 'express';
import LeavesController from '../Controllers/LeavesController';
const LeavesRouter = express.Router();
LeavesRouter.get('/leaves-list', LeavesController.getLeaves);
LeavesRouter.post('/leaves', LeavesController.upsertLeaves);
LeavesRouter.post('/leaves/:id', LeavesController.upsertLeaves);
LeavesRouter.delete('/leaves/:id', LeavesController.deleteLeaves);


export default LeavesRouter

