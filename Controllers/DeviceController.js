import DeviceModel from "../Models/DeviceModel.js";
import validationService from "../service/validation.service.js";
import { getErrorObject, getSuccessObject } from "../utils/responseUtil.js";

const DeviceController = {};

DeviceController.upsertDevice = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.body, [
            "device_name", "device_ip", "device_port", "model_name", "model_id"
        ]);
        if (error) return res.send(getErrorObject(400, "Bad Request", error));

        const reqObj = {
            id: req.params.id || null,
            ...req.body
        };

        const result = await DeviceModel.upsertDevice(reqObj);
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.error(err);
        return res.send(getErrorObject(500, "Internal Server Error upsertDevice", err));
    }
};

DeviceController.getDevices = async (req, res) => {
    try {
        const result = await DeviceModel.getDevices(req.query);
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.error(err);
        return res.send(getErrorObject(500, "Internal Server Error getDevices", err));
    }
};

DeviceController.deleteDevice = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.params, ['id']);
        if (error) return res.send(getErrorObject(400, "Bad Request", error));

        const result = await DeviceModel.deleteDevice(req.params.id);
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.error(err);
        return res.send(getErrorObject(500, "Internal Server Error deleteDevice", err));
    }
};

export default DeviceController;
