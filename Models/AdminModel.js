import db from "../config/db.js";
import filterService from "../service/filter.service.js";

const adminModel = {};
const conditionEnum = filterService.condition;

const user_config = [
    { inputKey: "name", column: 'um.name', condition: conditionEnum.EQ },
    // { inputKey: "cCode", column: 'c_code', condition: conditionEnum.EQ },
    // { inputKey: "location", column: 'location', condition: conditionEnum.CONTAIN },
    // { inputKey: "gstin", column: 'gstin', condition: conditionEnum.CONTAIN },
]
adminModel.getUsers = async (reqData) => {
    const connection = await db.getConnection();
    const filter = filterService.generateFilterSQL(reqData, user_config);
    const whereCondition = filter.trim().length > 0 ? ' WHERE ' : '';

    let pageSize = reqData.per_page;
    let index = (reqData.page - 1) * pageSize;

    const countSql = `select count(*) as total from user_master um
        inner join role r on r.id = um.role_id
        inner join department d on d.id = um.dep_id ${whereCondition} ${filter}`
    const listSql = `SELECT um.id, um.name, um.email, um.mobile, um.profile, JSON_ARRAYAGG( JSON_OBJECT('id', r.id, 'name', r.name) ) AS role, JSON_ARRAYAGG( JSON_OBJECT('id', d.id, 'name', d.name) ) AS department, um.status
                FROM 
                    user_master um
                INNER JOIN 
                    role r ON r.id = um.role_id
                INNER JOIN 
                    department d ON d.id = um.dep_id
                GROUP BY 
                    um.id, um.name, um.email, um.mobile, um.profile, um.status
                ${whereCondition} ${filter} ORDER BY um.id DESC limit ${index},${pageSize}`
    try {
        const [rows] = await connection.query(listSql)
        const [[count]] = await connection.query(countSql)
        const response = { rows, ...count }
        return response;

    } finally {
        connection.release();
    }
};

adminModel.getUserByEmail = async (email) => {
    const connection = await db.getConnection();
    try {
        const sql = `select um.id, um.name, um.email, um.password, um.mobile, um.profile, r.name role, d.name department, um.status from user_master um
        inner join role r on r.id = um.role_id
        inner join department d on d.id = um.dep_id
        where email = ?`
        const [[result]] = await connection.query(sql, [email]);
        return result;

    } finally {
        connection.release();
    }
};

adminModel.upsertUser = async (body) => {
    const connection = await db.getConnection();
    const password = body.password ? `, password = '${body.password}'` : ``
    try {
        const updateSql = `update user_master set name = ?, email = ?, mobile = ?, role_id = ?, dep_id = ?, profile =?,  status = ? ${password} where id = ?`;
        const insertSql = `insert into user_master (name, email, password, mobile, role_id, dep_id,status, profile, created_on) values (?,?,?,?,?,?,?,?, now())`;

        if (body.id) {
            await connection.query(updateSql, [body.name, body.email, body.mobile, body.roleId, body.depId, body.profile, body.status, body.id]);
        } else {
            await connection.query(insertSql, [body.name, body.email, body.password, body.mobile, body.roleId, body.depId, body.status, body.profile]);
        }
        return true;
    } finally {
        connection.release();
    }
};

adminModel.sendOtp = async (body) => {
    const connection = await db.getConnection();
    try {
        const sql = `insert into u_otp (user_id, ip, user_agent, otp, status, contact, created_on) values (?,?,?,?,?,?, now())`;
        await connection.query(sql, [body.id, body.ip, body.userAgent, body.otp, body.status, body.contact]);
        return true;
    } finally {
        connection.release();
    }
};
adminModel.getOtpEmail = async (contact) => {
    const connection = await db.getConnection();
    try {
        const sql = `select id, user_id userId, otp from u_otp where contact = ? order by id desc`;
        const [[result]] = await connection.query(sql, [contact]);
        return result;

    } finally {
        connection.release();
    }
};
adminModel.verifyCode = async ({ id, userId, status }) => {
    const connection = await db.getConnection();
    try {
        const sql = `update u_otp set status = ? where id = ? and user_id = ?`;
        await connection.query(sql, [status, id, userId]);
        return true;

    } finally {
        connection.release();
    }
};

adminModel.updatePassword = async (body) => {
    const connection = await db.getConnection();
    try {
        const sql = `update user_master set password = ? where email = ?`;
        await connection.query(sql, [body.password, body.email]);
        return true;

    } finally {
        connection.release();
    }
}

adminModel.deleteUser = async (id) => {
    const connection = await db.getConnection();
    try {
        const sql = `delete from user_master where id = ?`
        const [result] = await connection.query(sql, [id]);
        return result;
    } finally {
        connection.release();
    }
}

adminModel.getDepartments = async (email) => {
    const connection = await db.getConnection();
    try {
        const sql = `select id , name from department`;
        const [result] = await connection.query(sql, []);
        return result;
        
    } finally {
        connection.release();
    }
};
adminModel.getRoles = async (email) => {
    const connection = await db.getConnection();
    try {
        const sql = `select id , name from role`;
        const [result] = await connection.query(sql, []);
        return result;

    } finally {
        connection.release();
    }
};

export default adminModel; 