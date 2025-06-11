// Models/EmployeeModel.js
import hrmdb from "../config/hrmdb.js";

const EmployeeModel = {};

EmployeeModel.createOrUpdate = async (body) => {
    const connection = await hrmdb.getConnection();
    try {
        if (body.employee_id) {
            const updateSql = `
                UPDATE employee SET name=?, address=?, phone=?, join_date=?, status=?, 
                role_id=?, company_id=?, work_type=?, device_id=?, bio_metric_id=?, shift_id=?
                WHERE employee_id=?
            `;
            const values = [
                body.name, body.address, body.phone, body.join_date, body.status,
                body.role_id, body.company_id, body.work_type, body.device_id, body.bio_metric_id,
                body.shift_id, body.employee_id
            ];
            const [result] = await connection.query(updateSql, values);
            return result;
        } else {
            const insertSql = `
                INSERT INTO employee (name, address, phone, join_date, status,
                role_id, company_id, work_type, device_id, bio_metric_id, shift_id)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const values = [
                body.name, body.address, body.phone, body.join_date, body.status,
                body.role_id, body.company_id, body.work_type, body.device_id, body.bio_metric_id,
                body.shift_id
            ];
            const [result] = await connection.query(insertSql, values);
            return { insertId: result.insertId };
        }
    } finally {
        connection.release();
    }
};

EmployeeModel.getAll = async (page, perPage) => {
    const connection = await hrmdb.getConnection();
    const offset = (page - 1) * perPage;
    try {
        const [rows] = await connection.query(
            `SELECT * FROM employee ORDER BY employee_id DESC LIMIT ?, ?`, [offset, perPage]
        );
        const [[{ total }]] = await connection.query(`SELECT COUNT(*) as total FROM employee`);
        return { rows, total };
    } finally {
        connection.release();
    }
};

EmployeeModel.delete = async (id) => {
    const connection = await hrmdb.getConnection();
    try {
        const [result] = await connection.query(`DELETE FROM employee WHERE employee_id = ?`, [id]);
        return result;
    } finally {
        connection.release();
    }
};

export default EmployeeModel;
