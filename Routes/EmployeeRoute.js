// Routes/employee.routes.js
import express from "express";
import EmployeeController from "../Controllers/EmployeeController.js";

const employeeRoutes = express.Router();

employeeRoutes.get("/list", EmployeeController.getAll);
employeeRoutes.post("/add", EmployeeController.upsert);
employeeRoutes.post("/update/:id", EmployeeController.upsert);
employeeRoutes.delete("/:id", EmployeeController.delete);

export default employeeRoutes;
    