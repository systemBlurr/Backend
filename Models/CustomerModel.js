import db from "../config/db.js";
import filterService from "../service/filter.service.js";

const customerModel = {};
const conditionEnum = filterService.condition;

customerModel.upsertCustomer = async (body) => {
    const connection = await db.getConnection();

    const updateSql = `update customer set name = ?, address = ?, location = ?, contact = ?, gstin = ?, status = ? where id = ?`;
    const insertSql = `insert into customer (name,  address, location, contact, gstin, status, created_on) values (?,?,?,?,?,?,now())`;
    const updatePCodeSql = `UPDATE customer SET c_code = ? WHERE id = ?`;

    try {
        if (body.id) {
            const [result] = await connection.query(updateSql, [body.name, body.address, body.location, body.contact, body.gstin, body.status, body.id]);
            return result;
        }
        const  [insertResult] = await connection.query(insertSql, [body.name, body.address, body.location, body.contact, body.gstin, body.status]);
        const customerId = insertResult.insertId;
        const pCode = `${customerId}${body.name}`;
        await connection.query(updatePCodeSql, [pCode, customerId]);

        return { insertId: customerId, pCode };
    } finally {
        connection.release();
    }
};

const customer_config = [
    { inputKey: "name", column: 'name', condition: conditionEnum.EQ },
    { inputKey: "cCode", column: 'c_code', condition: conditionEnum.EQ },
    { inputKey: "location", column: 'location', condition: conditionEnum.CONTAIN },
    { inputKey: "gstin", column: 'gstin', condition: conditionEnum.CONTAIN },
]

customerModel.getCustomers = async (reqData) => {
    const connection = await db.getConnection();
    const filter = filterService.generateFilterSQL(reqData, customer_config);
    const whereCondition = filter.trim().length > 0 ? ' WHERE ' : '';

    let pageSize = reqData.per_page;
    let index = (reqData.page - 1) * pageSize;

    try {
        const countSql = `select count(*) as total from customer ${whereCondition} ${filter}`
        const listSql = `select id, name, c_code cCode, address, location, contact, gstin, status from customer ${whereCondition} ${filter} ORDER BY id DESC limit ${index},${pageSize}`

        const [rows] = await connection.query(listSql)
        const [[count]] = await connection.query(countSql)
        const response = { rows, ...count }
        return response;

    } finally {
        connection.release();
    }
};

customerModel.deleteCustomer = async (id) => {
    const connection = await db.getConnection();
    try {
        const sql = `delete from customer where id = ?`
        const [result] = await connection.query(sql, [id]);
        return result;
    } finally {
        connection.release();
    }
};


export default customerModel;