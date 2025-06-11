import CompanyModel from "../Models/CompanyModel.js";
import validationService from "../service/validation.service.js";
import { getErrorObject, getSuccessObject } from "../utils/responseUtil.js";

const CompanyController = {};

CompanyController.upsertCompany = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.body, [
            "company_name", "location", "role_id", "device_id", "industry_type"
        ]);
        if (error) return res.send(getErrorObject(400, "Bad Request", error));

        const companyData = {
            company_id: req.params.id || null,
            company_name: req.body.company_name,
            location: req.body.location,
            role_id: req.body.role_id,
            device_id: req.body.device_id,
            industry_type: req.body.industry_type
        };

        const result = await CompanyModel.upsertCompany(companyData);
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.error(err);
        return res.send(getErrorObject(500, "Internal Server Error upsertCompany", err));
    }
};

CompanyController.getCompany = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.query, ['page', 'per_page']);
        if (error) return res.send(getErrorObject(400, "Bad Request", error));

        const result = await CompanyModel.getCompany(req.query);
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.error(err);
        return res.send(getErrorObject(500, "Internal Server Error getCompany", err));
    }
};

CompanyController.deleteCompany = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.params, ['id']);
        if (error) return res.send(getErrorObject(400, "Bad Request", error));

        const result = await CompanyModel.deleteCompany(req.params.id);
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.error(err);
        return res.send(getErrorObject(500, "Internal Server Error deleteCompany", err));
    }
};

export default CompanyController;
