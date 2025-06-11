import productModel from "../Models/ProductModel.js";
import validationService from "../service/validation.service.js";
import { getErrorObject, getSuccessObject } from "../utils/responseUtil.js";

const productController = {};

productController.upsertProduct = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.body, ["name", "description", "qty", "price", "unit", "status"]);
        if (error) return res.send(getErrorObject(400, 'Bad request', error));
        const reqObj = {
            name: req.body.name,
            description: req.body.description,
            qty: req.body.qty,
            price: req.body.price,
            unit: req.body.unit,
            status: req.body.status,
            id: req.params.id
        }
        const results = await productModel.upsertProduct(reqObj);
        return res.send(getSuccessObject(results));
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error", err));
    }
};

productController.getProducts = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.query, ['page', 'per_page']);
        if (error) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }
        const result = await productModel.getProducts(req.query);
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error", err));
    }
};

productController.deleteProduct = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.params, ['id']);
        if (error) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }
        await productModel.deleteProduct(req.params.id);
        return res.send(getSuccessObject());
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error", err));
    }
};


export default productController;