import express from 'express';
import DeviceController from '../Controllers/DeviceController.js';

const DeviceRouter = express.Router();

DeviceRouter.get('/device-list', DeviceController.getDevices);
DeviceRouter.post('/add', DeviceController.upsertDevice);
DeviceRouter.post('/update/:id', DeviceController.upsertDevice);
DeviceRouter.delete('/:id', DeviceController.deleteDevice);

export default DeviceRouter;
