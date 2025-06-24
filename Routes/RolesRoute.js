// Routes/role.route.js
import express from "express";
import RoleController from "../Controllers/RolesController.js";

const roleRouter = express.Router();

// Create or update a role
roleRouter.post("/:id?", RoleController.upsertRole);

// Get paginated list of roles
roleRouter.get("/list", RoleController.getRoles);

// Delete a role by ID
roleRouter.delete("/:id", RoleController.deleteRole);

export default roleRouter;
