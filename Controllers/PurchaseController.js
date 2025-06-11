import purchaseModel from "../Models/PurchaseModel.js";
import validationService from "../service/validation.service.js";
import { getErrorObject, getSuccessObject } from "../utils/responseUtil.js";

const purchaseController = {};

purchaseController.upsertPurchase = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.body, [
            "supplier",
            "product",
            "description",
            "qty",
            "price",
            "unit",
            "status",
            "purchaseDate",
        ]);
        if (error) return res.send(getErrorObject(400, 'Bad request', error));
        const reqObj = {
            supplier: req.body.supplier,
            product: req.body.product,
            description: req.body.description,
            qty: req.body.qty,
            price: req.body.price,
            unit: req.body.unit,
            status: req.body.status,
            purchaseDate: req.body.purchaseDate,
            id: req.params.id ? req.params.id : null
        }
        const results = await purchaseModel.upsertPurchase(reqObj);
        return res.send(getSuccessObject(results));
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error", err));
    }
};

purchaseController.getPurchaseList = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.query, ['page', 'per_page']);
        if (error) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }
        const result = await purchaseModel.getPurchaseList(req.query);
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error", err));
    }
};
purchaseController.getSuppliers = async (req, res) => {
    try {
        const result = await purchaseModel.getSuppliers();
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error", err));
    }
};
purchaseController.getProducts = async (req, res) => {
    try {
        const result = await purchaseModel.getProducts();
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error", err));
    }
};

purchaseController.deletePurchaseDetails = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.params, ['id']);
        if (error) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }
        await purchaseModel.deletePurchaseDetails(req.params.id);
        return res.send(getSuccessObject());
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error", err));
    }
};


export default purchaseController;