import db from "../config/db.js";
import filterService from "../service/filter.service.js";

const productModel = {};
const conditionEnum = filterService.condition;

// productModel.upsertProduct = async (body) => {
//     const connection = await db.getConnection();

//     const updateSql = `update product set name = ?, description = ?, qty = ?, price = ?, unit = ?, status = ? where id = ?`;
//     const insertSql = `insert into product (name, description, qty, price, unit, status, created_on) values (?,?,?,?,?,?,?,now())`;
//     try {
//         if (body.id) {
//             const [result] = await connection.query(updateSql, [body.name, body.description, body.qty, body.price, body.unit, body.status, body.id]);
//             return result;
//         }
//         const [{ insertId: productId }] = await connection.query(insertSql, [body.name, body.description, body.qty, body.price, body.unit, body.status]);
//         await connection.query(`update product set p_code = ? where id = ?`, [productId + body.name, productId])
//         return result;
//     } finally {
//         connection.release();
//     }
// };

productModel.upsertProduct = async (body) => {
    const connection = await db.getConnection();

    const updateSql = `UPDATE product SET name = ?, description = ?, qty = ?, price = ?, unit = ?, status = ? WHERE id = ?`;
    const insertSql = `INSERT INTO product (name, description, qty, price, unit, status, created_on) VALUES (?, ?, ?, ?, ?, ?, NOW())`;
    const updatePCodeSql = `UPDATE product SET p_code = ? WHERE id = ?`;

    try {
        if (body.id) {
            const [result] = await connection.query(updateSql, [
                body.name,
                body.description,
                body.qty,
                body.price,
                body.unit,
                body.status,
                body.id,
            ]);
            return result;
        } else {
            const [insertResult] = await connection.query(insertSql, [
                body.name,
                body.description,
                body.qty,
                body.price,
                body.unit,
                body.status,
            ]);

            const productId = insertResult.insertId;
            const pCode = `${productId}${body.name}`;
            await connection.query(updatePCodeSql, [pCode, productId]);

            return { insertId: productId, pCode };
        }
    } finally {
        connection.release();
    }
};

const supplier_config = [
    { inputKey: "name", column: 'name', condition: conditionEnum.CONTAIN },
]

productModel.getProducts = async (reqData) => {
    const connection = await db.getConnection();
    const filter = filterService.generateFilterSQL(reqData, supplier_config);
    const whereCondition = filter.trim().length > 0 ? ' WHERE ' : '';

    let pageSize = reqData.per_page;
    let index = (reqData.page - 1) * pageSize;
    try {
        const countSql = `select count(*) as total from product ${whereCondition} ${filter}`
        const listSql = `select id, name, p_code pCode, description, qty, price, unit, status from product ${whereCondition} ${filter} ORDER BY id DESC limit ${index},${pageSize}`

        const [rows] = await connection.query(listSql)
        const [[count]] = await connection.query(countSql)
        const response = { rows, ...count }
        return response;

    } finally {
        connection.release();
    }
};

productModel.deleteProduct = async (id) => {
    const connection = await db.getConnection();
    try {
        const sql = `delete from product where id = ?`
        const [result] = await connection.query(sql, [id]);
        return result;
    } finally {
        connection.release();
    }
};


export default productModel;