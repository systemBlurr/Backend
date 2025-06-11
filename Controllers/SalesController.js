import salesModel from "../Models/SalesModel.js";
import validationService from "../service/validation.service.js";
import { getErrorObject, getSuccessObject } from "../utils/responseUtil.js";

const salesController = {};

salesController.upsertSales = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.body, [
            "customer",
            "product",
            "pDesc",
            "salesDate",
            "qty",
            "salesPrice",
            "unit",
            "status"
        ]);
        if (error) return res.send(getErrorObject(400, 'Bad request', error));
        const reqObj = {
            customer: req.body.customer,
            product: req.body.product,
            pDesc: req.body.pDesc,
            salesDate: req.body.salesDate,
            qty: req.body.qty,
            salesPrice: req.body.salesPrice,
            unit: req.body.unit,
            status: req.body.status,
            id: req.params.id ? req.params.id : null
        }
        const results = await salesModel.upsertSales(reqObj);
        return res.send(getSuccessObject(results));
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error", err));
    }
};

salesController.getSales = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.query, ['page', 'per_page']);
        if (error) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }
        const result = await salesModel.getSales(req.query);
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error", err));
    }
};
salesController.getCustomers = async (req, res) => {
    try {
        const result = await salesModel.getCustomers();
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error", err));
    }
};
salesController.getProducts = async (req, res) => {
    try {
        const result = await salesModel.getProducts();
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error", err));
    }
};

salesController.deleteSales = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.params, ['id']);
        if (error) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }
        await salesModel.deleteSales(req.params.id);
        return res.send(getSuccessObject());
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error", err));
    }
};


export default salesController;