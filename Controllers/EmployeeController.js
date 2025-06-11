// Controllers/EmployeeController.js
import EmployeeModel from "../Models/EmployeeModel.js";
import { getSuccessObject, getErrorObject } from "../utils/responseUtil.js";

const EmployeeController = {};

EmployeeController.upsert = async (req, res) => {
    try {
        const data = { ...req.body, employee_id: req.params.id || null };
        const result = await EmployeeModel.createOrUpdate(data);
        res.send(getSuccessObject(result));
    } catch (error) {
        console.error(error);
        res.send(getErrorObject(500, "Failed to create/update employee", error));
    }
};


EmployeeController.getAll = async (req, res) => {
    try {
        const { page = 1, per_page = 10 } = req.query;
        const result = await EmployeeModel.getAll(parseInt(page), parseInt(per_page));
        res.send(getSuccessObject(result));
    } catch (error) {
        console.error(error);
        res.send(getErrorObject(500, "Failed to get employees", error));
    }
};

EmployeeController.delete = async (req, res) => {
    try {
        const { id } = req.params;
        await EmployeeModel.delete(id);
        res.send(getSuccessObject({ message: "Employee deleted successfully" }));
    } catch (error) {
        console.error(error);
        res.send(getErrorObject(500, "Failed to delete employee", error));
    }
};

export default EmployeeController;
