import customerModel from "../Models/CustomerModel.js";
import validationService from "../service/validation.service.js";
import { getErrorObject, getSuccessObject } from "../utils/responseUtil.js";

const customerController = {};

customerController.upsertCustomer = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.body, ["name", "address", "location", "contact", "gstin", "status"]);
        if (error) return res.send(getErrorObject(400, 'Bad request', error));
        const reqObj = {
            name: req.body.name,
            address: req.body.address,
            location: req.body.location,
            contact: req.body.contact,
            gstin: req.body.gstin,
            status: req.body.status,
            id: req.params.id
        }
        const results = await customerModel.upsertCustomer(reqObj);
        return res.send(getSuccessObject(results));
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error", err));
    }
};


customerController.getCustomers = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.query, ['page', 'per_page']);
        if (error) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }
        const result = await customerModel.getCustomers(req.query);
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error", err));
    }
};

customerController.deleteCustomer = async (req, res) => {
    try {
        const error = validationService.validateRequired({ id: req.params.id }, ['id']);
        if (error) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }
        await customerModel.deleteCustomer(req.params.id);
        return res.send(getSuccessObject());
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error", err));
    }
};


export default customerController;