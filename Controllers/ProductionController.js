import validationService from "../service/validation.service.js";
import { getErrorObject, getSuccessObject } from "../utils/responseUtil.js";
import productionModel from "../Models/ProductionModel.js";


const productionController = {};

productionController.upsertProduction = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.body, [
            "customer",
            "product",
            "pDesc",
            "qty",
            "unit",
            "manufacturingDate",
            "operatorName",
            "comment",
            "status"
        ]);
        if (error) return res.send(getErrorObject(400, 'Bad request', error));

        const reqObj = {
            customer: req.body.customer,
            product: req.body.product,
            pDesc: req.body.pDesc,
            qty: req.body.qty,
            unit: req.body.unit,
            manufacturingDate: req.body.manufacturingDate,
            operatorName: req.body.operatorName,
            comment: req.body.comment,
            status: req.body.status,
            id: req.params.id ? req.params.id : null
        }
        const results = await productionModel.upsertProduction(reqObj);
        return res.send(getSuccessObject(results));
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error upsertProduction", err));
    }
};

productionController.getProductions = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.query, ['page', 'per_page']);
        if (error) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }
        const result = await productionModel.getProductions(req.query);
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error getProductions", err));
    }
};

productionController.deleteProduction = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.params, ['id']);
        if (error) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }
        await productionModel.deleteProduction(req.params.id);
        return res.send(getSuccessObject());
    } catch (err) {
        console.error(err);
        res.send(getErrorObject(500, "Internal Server Error deleteProduction", err));
    }
};


export default productionController;