// Controllers/RoleController.js
import RoleModel from "../Models/RolesModels.js";
import validationService from "../service/validation.service.js";
import { getErrorObject, getSuccessObject } from "../utils/responseUtil.js";

const RoleController = {};

RoleController.upsertRole = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.body, [
            "role_name", "department_id"
        ]);
        if (error) return res.send(getErrorObject(400, "Bad Request", error));

        const roleData = {
            role_id: req.params.id || null,
            role_name: req.body.role_name,
            department_id: req.body.department_id,
            description: req.body.description || '',
            status: req.body.status || 'active'
        };

        const result = await RoleModel.upsertRole(roleData);
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.error(err);
        return res.send(getErrorObject(500, "Internal Server Error upsertRole", err));
    }
};

RoleController.getRoles = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.query, ['page', 'perPage']);
        if (error) return res.send(getErrorObject(400, "Bad Request", error));

        const result = await RoleModel.getRoles(req.query);
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.error(err);
        return res.send(getErrorObject(500, "Internal Server Error getRoles", err));
    }
};

RoleController.deleteRole = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.params, ['id']);
        if (error) return res.send(getErrorObject(400, "Bad Request", error));

        const result = await RoleModel.deleteRole(req.params.id);
        return res.send(getSuccessObject(result));
    } catch (err) {
        console.error(err);
        return res.send(getErrorObject(500, "Internal Server Error deleteRole", err));
    }
};

export default RoleController;
