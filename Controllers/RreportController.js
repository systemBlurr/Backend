import reportModel from "../Models/ReportModel.js";
import { getErrorObject, getSuccessObject } from "../utils/responseUtil.js";


const reportController = {};


reportController.getSalseOverview = async (req, res) => {
    try {
        const result = await reportModel.getSalseOverview(req.query);
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error getSalseOverview", err));
    }
};

reportController.getPurchaseReprts = async (req, res) => {
    try {
        const result = await reportModel.getPurchaseReprts(req.query);
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error getPurchaseReprts", err));
    }
};


export default reportController;