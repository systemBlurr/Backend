// Controllers/EmployeeController.js
import EmployeeModel from "../Models/EmployeeModel.js";
import { singleFileUploader } from "../service/singleUploader.js";
import validationService from "../service/validation.service.js";
import { getSuccessObject, getErrorObject } from "../utils/responseUtil.js";
import bcrypt from "bcrypt";
const EmployeeController = {};

EmployeeController.upsert = async (req, res) => {
    try {
        // Configure file upload
        const upload = singleFileUploader(
            process.env.EMPLOYEES_IMAGE,
            `employee`,
            "profile",
            1024 * 1024 * 10 // Max file size: 10MB
        );

        // Handle file upload and process the form data
         upload(req, res, async (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'File upload failed', error: err });
            }

            // Validate required fields
            // const { body } = req;
            // console.log("req.body--",req.body);
            
            const { name, role_id, phone, email, password, status ,work_type,company_id} = req.body;
            const error = validationService.validateRequired({ name, role_id, phone, email, password,status ,work_type,company_id}, ['name', 'role_id', 'phone', 'email', 'password','status',"work_type","company_id"]);
            if (error) {
                return res.send(getErrorObject(400, 'Bad request', error));
            }
            if (!req.params.id && !password) {
                console.log("password not found")
                const error = validationService.validateRequired({ password }, ['password']);
                if (error) {
                    return res.send(getErrorObject(400, 'Bad request', error));
                }
            }

            //unique user register
            // if (!req.params.id) {
            //     const isExitUser = await adminModel.getUserByEmail(email);
            //     if (isExitUser) {
            //         return res.send(getErrorObject(409, 'User already exists'));
            //     }
            // }

            // Prepare the request body for database insertion
            let fileName;
            if (req.params.id && typeof req.body.profile === 'string') {
                // Update existing category without uploading a new image
                fileName = req.body.profile;
            } else {
                // Upload new image
                fileName = "/" + process.env.EMPLOYEES_IMAGE.split('/').pop() + '/' + req.file?.filename
            }

            const reqBody = {
                ...req.body, profile: fileName || '',
                password: password ? await bcrypt.hash(password, 10) : null,
                employee_id: req.params.id ? req.params.id : null
            };
            // console.log("reqBody----",reqBody)
            const result =  await EmployeeModel.createOrUpdate(reqBody);
            return res.send(getSuccessObject(result));
        });


        // const data = { ...req.body, employee_id: req.params.id || null };
        // const result = await EmployeeModel.createOrUpdate(data);
        // res.send(getSuccessObject(result));
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
