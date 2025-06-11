import db from "../config/db.js";
import filterService from "../service/filter.service.js";

const supplierModel = {};
const conditionEnum = filterService.condition;

supplierModel.upsertSupplier = async (body) => {
    const connection = await db.getConnection();

    const updateSql = `update supplier set name = ?, vendor_code = ?, address = ?, location = ?, contact = ?, gstin = ?, status = ? where id = ?`;
    const insertSql = `insert into supplier (name, vendor_code, address, location, contact, gstin, status, created_on) values (?,?,?,?,?,?,?,now())`;
    try {
        if (body.id) {
            const [result] = await connection.query(updateSql, [body.name, body.vendorCode, body.address, body.location, body.contact, body.gstin, body.status, body.id]);
            return result;
        }
        const [result] = await connection.query(insertSql, [body.name, body.vendorCode, body.address, body.location, body.contact, body.gstin, body.status]);
        return result;
    } finally {
        connection.release();
    }
};

const supplier_config = [
    { inputKey: "name", column: 'name', condition: conditionEnum.EQ },
    { inputKey: "vendorCode", column: 'vendor_code', condition: conditionEnum.EQ },
    { inputKey: "location", column: 'location', condition: conditionEnum.CONTAIN },
    { inputKey: "gstin", column: 'gstin', condition: conditionEnum.CONTAIN },
]

supplierModel.getSuppliers = async (reqData) => {
    const connection = await db.getConnection();
    const filter = filterService.generateFilterSQL(reqData, supplier_config);
    const whereCondition = filter.trim().length > 0 ? ' WHERE ' : '';

    let pageSize = reqData.per_page;
    let index = (reqData.page - 1) * pageSize;

    try {
        const countSql = `select count(*) as total from supplier ${whereCondition} ${filter}`
        const listSql = `select id, name, vendor_code vendorCode, address, location, contact, gstin, status from supplier ${whereCondition} ${filter} ORDER BY id DESC limit ${index},${pageSize}`

        const [rows] = await connection.query(listSql)
        const [[count]] = await connection.query(countSql)
        const response = { rows, ...count }
        return response;

    } finally {
        connection.release();
    }
};

supplierModel.deleteSupplier = async (id) => {
    const connection = await db.getConnection();
    try {
        const sql = `delete from supplier where id = ?`
        const [result] = await connection.query(sql, [id]);
        return result;
    } finally {
        connection.release();
    }
};


export default supplierModel;