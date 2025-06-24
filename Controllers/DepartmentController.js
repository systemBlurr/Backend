// Controllers/DepartmentController.js
import DepartmentModel from "../Models/DepartmentModels.js";
import validationService from "../service/validation.service.js";
import { getErrorObject, getSuccessObject } from "../utils/responseUtil.js";

const DepartmentController = {};

DepartmentController.upsertDepartment = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.body, ['department_name']);
        if (error) return res.send(getErrorObject(400, "Bad Request", error));

        const data = {
            department_id: req.params.id || null,
            department_name: req.body.department_name,
            description: req.body.description || '',
            status: req.body.status || 'active'
        };

        const result = await DepartmentModel.upsertDepartment(data);
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.error(err);
        return res.send(getErrorObject(500, "Internal Server Error upsertDepartment", err));
    }
};

DepartmentController.getDepartments = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.query, ['page', 'per_page']);
        if (error) return res.send(getErrorObject(400, "Bad Request", error));

        const result = await DepartmentModel.getDepartments(req.query);
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.error(err);
        return res.send(getErrorObject(500, "Internal Server Error getDepartments", err));
    }
};

DepartmentController.deleteDepartment = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.params, ['id']);
        if (error) return res.send(getErrorObject(400, "Bad Request", error));

        const result = await DepartmentModel.deleteDepartment(req.params.id);
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.error(err);
        return res.send(getErrorObject(500, "Internal Server Error deleteDepartment", err));
    }
};

export default DepartmentController;
