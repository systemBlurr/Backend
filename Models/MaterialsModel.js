import db from "../config/db.js";
import filterService from "../service/filter.service.js";

const materialsModel = {};
const conditionEnum = filterService.condition;


materialsModel.upsertMaterial = async (body) => {
    const materialsStr = JSON.stringify(body.materials); 
    const connection = await db.getConnection();
    const updateSql = `UPDATE materials SET  materials = ?, mqty =?, mPrice =? , rqty =?, rPrice =?, lqty =?, lPrice =? , status = ? WHERE id = ?`;
    const insertSql = `INSERT INTO materials (materials, mqty, mPrice, rqty, rPrice, lqty, lPrice, status, created_on) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`;

    try {
        if (body.id) {
            const [result] = await connection.query(updateSql, [
                materialsStr,
                body.mqty,
                body.mPrice,
                body.rqty,
                body.rPrice,
                body.lqty,
                body.lPrice,
                body.status,
                body.id,
            ]);
            return result;
        } else {
            const [insertResult] = await connection.query(insertSql, [
                materialsStr,
                body.mqty,
                body.mPrice,
                body.rqty,
                body.rPrice,
                body.lqty,
                body.lPrice,
                body.status,
            ]);

            const productionId = insertResult.insertId;
            return { insertId: productionId };
        }
    } finally {
        connection.release();
    }
};

// const production_config = [
//     { inputKey: "cName", column: 'c.name', condition: conditionEnum.CONTAIN },
//     { inputKey: "pName", column: 'pd.name', condition: conditionEnum.CONTAIN },
// ];

materialsModel.getMaterials = async (reqData) => {
    const connection = await db.getConnection();
    // const filter = filterService.generateFilterSQL(reqData, production_config);
    // const whereCondition = filter.trim().length > 0 ? ' WHERE ' : '';

    let pageSize = reqData.per_page;
    let index = (reqData.page - 1) * pageSize;
    try {
        const countSql = `SELECT COUNT(*) as total FROM materials`;
        const listSql = `SELECT id, materials, mqty, mPrice, rqty, rPrice, lqty, lPrice, status, created_on FROM materials ORDER BY id DESC LIMIT ${index}, ${pageSize}`;

        const [rows] = await connection.query(listSql);
        const [[count]] = await connection.query(countSql);
        const response = { rows, ...count };
        return response;
    } finally {
        connection.release();
    }
};

materialsModel.deleteMaterial = async (id) => {
    const connection = await db.getConnection();
    try {
        const sql = `DELETE FROM materials WHERE id = ?`;
        const [result] = await connection.query(sql, [id]);
        return result;
    } finally {
        connection.release();
    }
};

export default materialsModel;
