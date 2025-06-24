// Models/RoleModel.js

import hrmdb from "../config/hrmdb.js";

const RoleModel = {};

RoleModel.upsertRole = async (body) => {
    const connection = await hrmdb.getConnection();
    const updateSql = `
        UPDATE roles
        SET role_name = ?, department_id = ?, description = ?, status = ?
        WHERE role_id = ?
    `;
    const insertSql = `
        INSERT INTO roles (role_name, department_id, description, status)
        VALUES (?, ?, ?, ?)
    `;
    try {
        if (body.role_id) {
            const [result] = await connection.query(updateSql, [
                body.role_name,
                body.department_id,
                body.description,
                body.status,
                body.role_id
            ]);
            return result;
        } else {
            const [insertResult] = await connection.query(insertSql, [
                body.role_name,
                body.department_id,
                body.description,
                body.status || 'active'
            ]);
            return { insertId: insertResult.insertId };
        }
    } finally {
        connection.release();
    }
};

RoleModel.getRoles = async (reqData) => {
    const connection = await hrmdb.getConnection();
    const pageSize = parseInt(reqData.perPage);
    const index = (parseInt(reqData.page) - 1) * pageSize;
    try {
        const countSql = `SELECT COUNT(*) as total FROM roles`;
        const listSql = `
            SELECT role_id, role_name, department_id, description, status
            FROM roles
            ORDER BY role_id DESC
            LIMIT ?, ?
        `;
        console.log("countSql---",countSql)
        const [rows] = await connection.query(listSql, [index, pageSize]);
        const [[count]] = await connection.query(countSql);

        return { rows, ...count };
    } finally {
        connection.release();
    }
};

RoleModel.deleteRole = async (id) => {
    const connection = await hrmdb.getConnection();
    try {
        const sql = `DELETE FROM roles WHERE role_id = ?`;
        const [result] = await connection.query(sql, [id]);
        return result;
    } finally {
        connection.release();
    }
};

export default RoleModel;
