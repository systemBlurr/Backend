// routes/department.route.js
import express from "express";
import DepartmentController from "../Controllers/DepartmentController.js";

const DepartmentRouter = express.Router();

// Create or update department
DepartmentRouter.post("/add", DepartmentController.upsertDepartment); // For create
DepartmentRouter.put("/:id", DepartmentController.upsertDepartment); // For update

// Get paginated list of departments
DepartmentRouter.get("/list", DepartmentController.getDepartments);

// Delete a department by ID
DepartmentRouter.delete("/:id", DepartmentController.deleteDepartment);

export default DepartmentRouter;
