import db from "../config/db.js";
import filterService from "../service/filter.service.js";

const productionModel = {};
const conditionEnum = filterService.condition;


productionModel.upsertProduction = async (body) => {
    const connection = await db.getConnection();
    const updateSql = `UPDATE production SET c_id = ?, p_id = ?, p_desc = ?, qty= ?, unit = ?, operatorName= ? , comment= ?, status = ?, m_date = ? WHERE id = ?`;
    const insertSql = `INSERT INTO production (c_id, p_id, p_desc, qty, unit, operatorName, comment, status, m_date, created_on) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`;

    try {
        if (body.id) {
            const [result] = await connection.query(updateSql, [
                body.customer,
                body.product,
                body.pDesc,
                body.qty,
                body.unit,
                body.operatorName,
                body.comment,
                body.status,
                body.manufacturingDate,
                body.id,
            ]);
            return result;
        } else {
            const [insertResult] = await connection.query(insertSql, [
                body.customer,
                body.product,
                body.pDesc,
                body.qty,
                body.unit,
                body.operatorName,
                body.comment,
                body.status,
                body.manufacturingDate,
            ]);

            const productionId = insertResult.insertId;
            return { insertId: productionId };
        }
    } finally {
        connection.release();
    }
};

const production_config = [
    { inputKey: "cName", column: 'c.name', condition: conditionEnum.CONTAIN },
    { inputKey: "pName", column: 'pd.name', condition: conditionEnum.CONTAIN },
];

productionModel.getProductions = async (reqData) => {
    const connection = await db.getConnection();
    const filter = filterService.generateFilterSQL(reqData, production_config);
    const whereCondition = filter.trim().length > 0 ? ' WHERE ' : '';

    let pageSize = reqData.per_page;
    let index = (reqData.page - 1) * pageSize;
    try {
        const countSql = `SELECT COUNT(*) as total FROM production p
                            LEFT JOIN customer c ON p.c_id = c.id
                            LEFT JOIN product pd ON p.p_id = pd.id  ${whereCondition} ${filter}`;
        const listSql = `SELECT pr.id, JSON_OBJECT('id', c.id, 'name', c.name) AS customer,
                            JSON_OBJECT('id', pd.id, 'name', pd.name, 'pCode', pd.p_code) AS product,
                             pr.p_desc AS pDesc, pr.qty, pr.unit, pr.operatorName, pr.comment, pr.status , pr.m_date AS manufacturingDate
                            FROM production pr 
                            LEFT JOIN customer c ON pr.c_id = c.id
                            LEFT JOIN product pd ON pr.p_id = pd.id
        ${whereCondition} ${filter} ORDER BY pr.id DESC LIMIT ${index}, ${pageSize}`;

        const [rows] = await connection.query(listSql);
        const [[count]] = await connection.query(countSql);
        const response = { rows, ...count };
        return response;
    } finally {
        connection.release();
    }
};

productionModel.deleteProduction = async (id) => {
    const connection = await db.getConnection();
    try {
        const sql = `DELETE FROM production WHERE id = ?`;
        const [result] = await connection.query(sql, [id]);
        return result;
    } finally {
        connection.release();
    }
};

export default productionModel;
