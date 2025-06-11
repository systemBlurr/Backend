import publicModel from "../Models/PublicModel.js";
import { getErrorObject, getSuccessObject } from "../utils/responseUtil.js";

const publicController = {};
publicController.getSuppliers = async (req, res) => {
    try {
        const result = await publicModel.getSuppliers();
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error in getSuppliers", err));
    }
};

publicController.getCustomers = async (req, res) => {
    try {
        const result = await publicModel.getCustomers();
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error in getCustomers", err));
    }
};
publicController.getProducts = async (req, res) => {
    try {
        const result = await publicModel.getProducts();
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error in getProducts", err));
    }
};

export default publicController;

