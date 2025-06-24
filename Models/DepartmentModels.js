// Models/DepartmentModel.js
import hrmdb from "../config/hrmdb.js";

const DepartmentModel = {};

// Create or Update Department
DepartmentModel.upsertDepartment = async (body) => {
    const connection = await hrmdb.getConnection();
    const updateSql = `
        UPDATE departments 
        SET department_name = ?, description = ?, status = ?
        WHERE department_id = ?
    `;
    const insertSql = `
        INSERT INTO departments (department_name, description, status)
        VALUES (?, ?, ?)
    `;

    try {
        if (body.department_id) {
            const [result] = await connection.query(updateSql, [
                body.department_name,
                body.description,
                body.status,
                body.department_id
            ]);
            return result;
        } else {
            const [insertResult] = await connection.query(insertSql, [
                body.department_name,
                body.description,
                body.status
            ]);
            return { insertId: insertResult.insertId };
        }
    } finally {
        connection.release();
    }
};

// Get Departments
DepartmentModel.getDepartments = async (reqData) => {
    const connection = await hrmdb.getConnection();
    const page = parseInt(reqData.page) || 1;
    const pageSize = parseInt(reqData.per_page) || 10;
    const index = (page - 1) * pageSize;

    try {
        const countSql = `SELECT COUNT(*) as total FROM departments`;
        const listSql = `
            SELECT department_id, department_name, description, status 
            FROM departments
            ORDER BY department_id DESC
            LIMIT ?, ?
        `;

        const [rows] = await connection.query(listSql, [index, pageSize]);
        const [[count]] = await connection.query(countSql);

        return { rows, ...count };
    } finally {
        connection.release();
    }
};

// Delete Department
DepartmentModel.deleteDepartment = async (id) => {
    const connection = await hrmdb.getConnection();
    try {
        const sql = `DELETE FROM departments WHERE department_id = ?`;
        const [result] = await connection.query(sql, [id]);
        return result;
    } finally {
        connection.release();
    }
};

export default DepartmentModel;
