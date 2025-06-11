import hrmdb from "../config/hrmdb.js";
import filterService from "../service/filter.service.js";

const BusinessModel = {};
const conditionEnum = filterService.condition;

const businessFilterConfig = [
    { inputKey: "business_name", column: "business_name", condition: conditionEnum.CONTAIN },
    { inputKey: "business_mobile", column: "business_mobile", condition: conditionEnum.CONTAIN },
    { inputKey: "business_alt_mobile", column: "business_alt_mobile", condition: conditionEnum.CONTAIN },
    { inputKey: "contact_person_name", column: "contact_person_name", condition: conditionEnum.CONTAIN },
    { inputKey: "contact_mobile", column: "contact_mobile", condition: conditionEnum.CONTAIN },
    { inputKey: "district", column: "district", condition: conditionEnum.CONTAIN },
];

BusinessModel.upsertBusinesses = async (body) => {
    const connection = await hrmdb.getConnection();

    const columns = `
        customer_type, business_name, gst_number, business_mobile, business_alt_mobile,
        business_email_id, contact_person_name, contact_mobile, contact_person_alt_mobile,
        contact_email_id, source_id, source_from, remark, state, district, block,
        tahshil, post, vill
    `;

    const values = [
        body.customer_type,
        body.business_name,
        body.gst_number,
        body.business_mobile,
        body.business_alt_mobile,
        body.business_email_id,
        body.contact_person_name,
        body.contact_mobile,
        body.contact_person_alt_mobile,
        body.contact_email_id,
        body.source_id,
        body.source_from,
        body.remark,
        body.state,
        body.district,
        body.block,
        body.tahshil,
        body.post,
        body.vill,
    ];

    const updateFields = columns
        .split(",")
        .map(col => `${col.trim()} = ?`)
        .join(", ");

    try {
        if (body.business_id) {
            const updateSql = `UPDATE BusinessContacts SET ${updateFields} WHERE business_id = ?`;
            const [result] = await connection.query(updateSql, [...values, body.business_id]);
            return result;
        } else {
            const insertSql = `INSERT INTO BusinessContacts (${columns}) VALUES (${values.map(() => "?").join(",")})`;
            const [insertResult] = await connection.query(insertSql, values);
            return { insertId: insertResult.insertId };
        }
    } finally {
        connection.release();
    }
};

BusinessModel.getBusinesses = async (reqData) => {
    // console.log("---model---",reqData);

    const connection = await hrmdb.getConnection();
    console.log("-------------", connection);

    const filter = filterService.hrmgenerateFilterSQL(reqData, businessFilterConfig);
    const whereCondition = filter.length > 0 ? `WHERE ${filter}` : "";

    const pageSize = parseInt(reqData.perPage || 10);
    const index = (parseInt(reqData.page || 1) - 1) * pageSize;

    try {
        const countSql = `SELECT COUNT(*) as total FROM BusinessContacts ${whereCondition}`;
        const listSql = `
            SELECT * FROM BusinessContacts
            ${whereCondition}
            ORDER BY business_id DESC
            LIMIT ?, ?
        `;

        const [rows] = await connection.query(listSql, [...filter.values, index, pageSize]);
        const [[count]] = await connection.query(countSql, filter.values);
        return { rows, ...count };
    } finally {
        connection.release();
    }
};

BusinessModel.deleteBusinesses = async (id) => {
    const connection = await hrmdb.getConnection();
    try {
        const sql = `DELETE FROM BusinessContacts WHERE business_id = ?`;
        const [result] = await connection.query(sql, [id]);
        return result;
    } finally {
        connection.release();
    }
};

export default BusinessModel;
