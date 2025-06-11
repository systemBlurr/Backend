import db from "../config/db.js";

const publicModel = {};


publicModel.getSuppliers = async () => {
    const connection = await db.getConnection();
    try {
        const listSql = `select id, name, vendor_code vendorCode from supplier ORDER BY id DESC`
        const [rows] = await connection.query(listSql)
        return rows

    } finally {
        connection.release();
    }
};

publicModel.getCustomers = async () => {
    const connection = await db.getConnection();
    try {
        const listSql = `select id, name, c_code cCode from customer ORDER BY id DESC`;
        const [rows] = await connection.query(listSql);
        return rows;
    } finally {
        connection.release();
    }
};
publicModel.getProducts = async () => {
    const connection = await db.getConnection();
    try {
        const listSql = `select id, name, p_code pCode from product ORDER BY id DESC`;
        const [rows] = await connection.query(listSql);
        return rows;
    } finally {
        connection.release();
    }
};



export default publicModel;