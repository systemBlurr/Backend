import db from "../config/db.js";
import filterService from "../service/filter.service.js";

const purchaseModel = {};
const conditionEnum = filterService.condition;

purchaseModel.upsertPurchase = async (body) => {
    const connection = await db.getConnection();

    const updateSql = `UPDATE purchase SET s_id = ?, p_id = ?, description = ?, qty = ?, price = ?, unit = ?, status = ?, p_date = ? WHERE id = ?`;
    const insertSql = `INSERT INTO purchase (s_id, p_id, description, qty, price, unit, status, p_date, created_on) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`;

    try {
        if (body.id) {
            const [result] = await connection.query(updateSql, [
                body.supplier,
                body.product,
                body.description,
                body.qty,
                body.price,
                body.unit,
                body.status,
                body.purchaseDate,
                body.id,
            ]);
            return result;
        } else {
            const [insertResult] = await connection.query(insertSql, [
                body.supplier,
                body.product,
                body.description,
                body.qty,
                body.price,
                body.unit,
                body.status,
                body.purchaseDate,
            ]);

            const purchaseId = insertResult.insertId;
            return { insertId: purchaseId };
        }
    } finally {
        connection.release();
    }
};

const sales_config = [
    { inputKey: "sName", column: 's.name', condition: conditionEnum.CONTAIN },
    { inputKey: "pName", column: 'pd.name', condition: conditionEnum.CONTAIN },
];

purchaseModel.getPurchaseList = async (reqData) => {
    const connection = await db.getConnection();
    const filter = filterService.generateFilterSQL(reqData, sales_config);
    const whereCondition = filter.trim().length > 0 ? ' WHERE ' : '';

    let pageSize = reqData.per_page;
    let index = (reqData.page - 1) * pageSize;
    try {
        const countSql = `SELECT COUNT(*) as total FROM purchase p
                            LEFT JOIN supplier s ON p.s_id = s.id
                            LEFT JOIN product pd ON p.p_id = pd.id ${whereCondition} ${filter}`;
        const listSql = `SELECT p.id, JSON_OBJECT('id', s.id, 'name', s.name) AS supplier, 
                            JSON_OBJECT('id', pd.id, 'name', pd.name, 'pCode', pd.p_code) AS product, 
                            p.description, p_order purchaseOrder,  p.qty, p.price, p.unit, p.status, p.p_date AS purchaseDate
                        FROM purchase p
                        LEFT JOIN  supplier s ON p.s_id = s.id
                        LEFT JOIN  product pd ON p.p_id = pd.id
        ${whereCondition} ${filter} ORDER BY p.id DESC LIMIT ${index}, ${pageSize}`;

        const [rows] = await connection.query(listSql);
        const [[count]] = await connection.query(countSql);
        const response = { rows, ...count };
        return response;
    } finally {
        connection.release();
    }
};

purchaseModel.getSuppliers = async () => {
    const connection = await db.getConnection();
    try {
        const listSql = `select id, name from supplier where status = 1 ORDER BY id DESC`;
        const [rows] = await connection.query(listSql);
        return rows;
    } finally {
        connection.release();
    }
};
purchaseModel.getProducts = async () => {
    const connection = await db.getConnection();
    try {
        const listSql = `select id, name, p_code pCode from product where status = 1 ORDER BY id DESC`;
        const [rows] = await connection.query(listSql);
        return rows;
    } finally {
        connection.release();
    }
};

purchaseModel.deletePurchaseDetails = async (id) => {
    const connection = await db.getConnection();
    try {
        const sql = `DELETE FROM purchase WHERE id = ?`;
        const [result] = await connection.query(sql, [id]);
        return result;
    } finally {
        connection.release();
    }
};

export default purchaseModel;
