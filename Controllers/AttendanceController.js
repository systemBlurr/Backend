import AttendanceModel from "../Models/AttendanceModel.js";
import { getSuccessObject, getErrorObject } from "../utils/responseUtil.js";

const AttendanceController = {};

AttendanceController.upsert = async (req, res) => {
  try {
    const data = {
      ...req.body,
      attendance_id: req.params.id || null
    };
    const result = await AttendanceModel.upsert(data);
    res.send(getSuccessObject(result));
  } catch (e) {
    console.error(e);
    res.send(getErrorObject(500, "Failed to create/update attendance", e));
  }
};

AttendanceController.getList = async (req, res) => {
  try {
    const result = await AttendanceModel.getList(req.query);
    res.send(getSuccessObject(result));
  } catch (e) {
    console.error(e);
    res.send(getErrorObject(500, "Failed to list attendance", e));
  }
};

AttendanceController.delete = async (req, res) => {
  try {
    const result = await AttendanceModel.delete(req.params.id);
    res.send(getSuccessObject(result));
  } catch (e) {
    console.error(e);
    res.send(getErrorObject(500, "Failed to delete attendance", e));
  }
};

export default AttendanceController;
