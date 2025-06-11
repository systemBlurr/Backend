import express from "express";
import AttendanceController from "../Controllers/AttendanceController.js";

const AttendanceRouter = express.Router();

AttendanceRouter.get("/list", AttendanceController.getList);
AttendanceRouter.post("/add", AttendanceController.upsert);
AttendanceRouter.post("/update/:id", AttendanceController.upsert);
AttendanceRouter.delete("/:id", AttendanceController.delete);

export default AttendanceRouter;
    