import db from "../config/db.js";
import filterService from "../service/filter.service.js";

const salesModel = {};
const conditionEnum = filterService.condition;

salesModel.upsertSales = async (body) => {
    const connection = await db.getConnection();
    const updateSql = `UPDATE sales SET c_id = ?, p_id = ?, p_desc = ?, qty = ?, s_price = ?, unit = ?, status = ?, s_date = ? WHERE id = ?`;
    const insertSql = `INSERT INTO sales (c_id, p_id, p_desc, qty, s_price, unit, status, s_date, created_on) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`;

    try {
        if (body.id) {
            const [result] = await connection.query(updateSql, [
                body.customer,
                body.product,
                body.pDesc,
                body.qty,
                body.salesPrice,
                body.unit,
                body.status,
                body.salesDate,
                body.id,
            ]);
            return result;
        } else {
            const [insertResult] = await connection.query(insertSql, [
                body.customer,
                body.product,
                body.pDesc,
                body.qty,
                body.salesPrice,
                body.unit,
                body.status,
                body.salesDate,
            ]);

            const salesId = insertResult.insertId;
            return { insertId: salesId };
        }
    } finally {
        connection.release();
    }
};

const sales_config = [
    { inputKey: "cName", column: 'c.name', condition: conditionEnum.CONTAIN },
    { inputKey: "pName", column: 'p.name', condition: conditionEnum.CONTAIN },
];

salesModel.getSales = async (reqData) => {
    const connection = await db.getConnection();
    const filter = filterService.generateFilterSQL(reqData, sales_config);
    const whereCondition = filter.trim().length > 0 ? ' WHERE ' : '';

    let pageSize = reqData.per_page;
    let index = (reqData.page - 1) * pageSize;
    try {
        const countSql = `SELECT COUNT(*) as total FROM sales s
                            LEFT JOIN customer c ON c.id = s.c_id
                            LEFT JOIN product p ON p.id = s.p_id ${whereCondition} ${filter}`;
        const listSql = `SELECT s.id, JSON_OBJECT('id', c.id, 'name', c.name) AS customer,
                            JSON_OBJECT('id', p.id, 'name', p.name, 'pCode', p.p_code) AS product,
                             s.p_desc AS pDesc, s.qty, s.s_price AS salesPrice, s.unit, s.status,
                              s.s_date AS salesDate
                            FROM sales s
                            LEFT JOIN customer c ON c.id = s.c_id
                            LEFT JOIN product p ON p.id = s.p_id
        ${whereCondition} ${filter} ORDER BY s.id DESC LIMIT ${index}, ${pageSize}`;

        const [rows] = await connection.query(listSql);
        const [[count]] = await connection.query(countSql);
        const response = { rows, ...count };
        return response;
    } finally {
        connection.release();
    }
};
salesModel.getCustomers = async () => {
    const connection = await db.getConnection();
    try {
        const listSql = `select id, name, c_code cCode from customer where status = 1 ORDER BY id DESC`;
        const [rows] = await connection.query(listSql);
        return rows;
    } finally {
        connection.release();
    }
};
salesModel.getProducts = async () => {
    const connection = await db.getConnection();
    try {
        const listSql = `select id, name, p_code pCode from product where status = 1 ORDER BY id DESC`;
        const [rows] = await connection.query(listSql);
        return rows;
    } finally {
        connection.release();
    }
};

salesModel.deleteSales = async (id) => {
    const connection = await db.getConnection();
    try {
        const sql = `DELETE FROM sales WHERE id = ?`;
        const [result] = await connection.query(sql, [id]);
        return result;
    } finally {
        connection.release();
    }
};

export default salesModel;
