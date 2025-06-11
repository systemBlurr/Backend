import hrmdb from "../config/hrmdb.js";

const DeviceModel = {};

// CREATE or UPDATE device
DeviceModel.upsertDevice = async (body) => {
    const connection = await hrmdb.getConnection();
    const updateSql = `
        UPDATE device 
        SET device_name = ?, device_ip = ?, device_port = ?, model_name = ?, model_id = ?
        WHERE id = ?
    `;
    const insertSql = `
        INSERT INTO device (device_name, device_ip, device_port, model_name, model_id) 
        VALUES (?, ?, ?, ?, ?)
    `;

    try {
        if (body.id) {
            const [result] = await connection.query(updateSql, [
                body.device_name,
                body.device_ip,
                body.device_port,
                body.model_name,
                body.model_id,
                body.id
            ]);
            return result;
        } else {
            const [insertResult] = await connection.query(insertSql, [
                body.device_name,
                body.device_ip,
                body.device_port,
                body.model_name,
                body.model_id
            ]);
            return { insertId: insertResult.insertId };
        }
    } finally {
        connection.release();
    }
};

// GET all or paginated
DeviceModel.getDevices = async (query) => {
    const connection = await hrmdb.getConnection();
    const page = parseInt(query.page || 1);
    const perPage = parseInt(query.per_page || 10);
    const offset = (page - 1) * perPage;

    try {
        const [rows] = await connection.query(
            `SELECT * FROM device ORDER BY id DESC LIMIT ?, ?`,
            [offset, perPage]
        );
        const [[count]] = await connection.query(`SELECT COUNT(*) as total FROM device`);
        return { rows, ...count };
    } finally {
        connection.release();
    }
};

// DELETE
DeviceModel.deleteDevice = async (id) => {
    const connection = await hrmdb.getConnection();
    try {
        const [result] = await connection.query(`DELETE FROM device WHERE id = ?`, [id]);
        return result;
    } finally {
        connection.release();
    }
};

export default DeviceModel;
