import hrmdb from "../config/hrmdb.js";

const CompanyModel = {};

// Create or update company
CompanyModel.upsertCompany = async (body) => {
    const connection = await hrmdb.getConnection();
    const updateSql = `
        UPDATE company 
        SET company_name = ?, location = ?, role_id = ?, device_id = ?, industry_type = ? 
        WHERE company_id = ?
    `;
    const insertSql = `
        INSERT INTO company (company_name, location, role_id, device_id, industry_type) 
        VALUES (?, ?, ?, ?, ?)
    `;

    try {
        if (body.company_id) {
            const [result] = await connection.query(updateSql, [
                body.company_name,
                body.location,
                body.role_id,
                body.device_id,
                body.industry_type,
                body.company_id
            ]);
            return result;
        } else {
            const [insertResult] = await connection.query(insertSql, [
                body.company_name,
                body.location,
                body.role_id,
                body.device_id,
                body.industry_type
            ]);
            return { insertId: insertResult.insertId };
        }
    } finally {
        connection.release();
    }
};

// Fetch paginated list
CompanyModel.getCompany = async (reqData) => {
    const connection = await hrmdb.getConnection();
    const pageSize = parseInt(reqData.per_page);
    const index = (parseInt(reqData.page) - 1) * pageSize;

    try {
        const countSql = `SELECT COUNT(*) as total FROM company`;
        const listSql = `
            SELECT company_id, company_name, location, role_id, device_id, industry_type 
            FROM company 
            ORDER BY company_id DESC 
            LIMIT ?, ?
        `;

        const [rows] = await connection.query(listSql, [index, pageSize]);
        const [[count]] = await connection.query(countSql);

        return { rows, ...count };
    } finally {
        connection.release();
    }
};

// Delete by ID
CompanyModel.deleteCompany = async (id) => {
    const connection = await hrmdb.getConnection();
    try {
        const sql = `DELETE FROM company WHERE company_id = ?`;
        const [result] = await connection.query(sql, [id]);
        return result;
    } finally {
        connection.release();
    }
};

export default CompanyModel;
