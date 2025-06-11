import db from "../config/db.js";
import filterService from "../service/filter.service.js";

const authModel = {};


authModel.getUsers = async (id) => {
    const connection = await db.getConnection();

    const listSql = `SELECT um.id, um.name, um.email, um.mobile, um.profile,  r.name role, d.name AS department, um.status
                FROM 
                    user_master um
                INNER JOIN 
                    role r ON r.id = um.role_id
                INNER JOIN 
                    department d ON d.id = um.dep_id
                where um.id = ?
                GROUP BY 
                    um.id, um.name, um.email, um.mobile, um.profile, um.status `
    try {
        const [[rows]] = await connection.query(listSql, [id])
        return rows;
    } finally {
        connection.release();
    }
};

authModel.getUserByEmail = async (email) => {
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
authModel.getUserById = async (id) => {
    const connection = await db.getConnection();
    try {
        const sql = `select id, email, password from user_master where id = ?`
        const [[result]] = await connection.query(sql, [id]);
        return result;
    } finally {
        connection.release();
    }
};
authModel.updatePassword = async ({ password, id }) => {
    const connection = await db.getConnection();
    try {
        const sql = `update user_master set password = ? where id = ?`
        await connection.query(sql, [password, id]);
        return true;
    } finally {
        connection.release();
    }
};


authModel.updateUser = async (body) => {
    const connection = await db.getConnection();
    const updateSql = `update user_master set name = ?, email = ?, mobile = ?,profile =? where id = ?`;
    const getSql = `select um.id, um.name, um.email, um.password, um.mobile, um.profile, r.name role, d.name department, um.status from user_master um
        inner join role r on r.id = um.role_id
        inner join department d on d.id = um.dep_id
        where um.id = ?`
    try {
        await connection.query(updateSql, [body.name, body.email, body.mobile, body.profile, body.id]);
        const [[result]] = await connection.query(getSql, [body.id]);
        return result;
    } finally {
        connection.release();
    }
};

authModel.sendOtp = async (body) => {
    const connection = await db.getConnection();
    try {
        const sql = `insert into u_otp (user_id, ip, user_agent, otp, status, contact, created_on) values (?,?,?,?,?,?, now())`;
        await connection.query(sql, [body.id, body.ip, body.userAgent, body.otp, body.status, body.contact]);
        return true;
    } finally {
        connection.release();
    }
};
authModel.getOtpEmail = async (contact) => {
    const connection = await db.getConnection();
    try {
        const sql = `select id, user_id userId, otp from u_otp where contact = ? order by id desc`;
        const [[result]] = await connection.query(sql, [contact]);
        return result;

    } finally {
        connection.release();
    }
};
authModel.verifyCode = async ({ id, userId, status }) => {
    const connection = await db.getConnection();
    try {
        const sql = `update u_otp set status = ? where id = ? and user_id = ?`;
        await connection.query(sql, [status, id, userId]);
        return true;

    } finally {
        connection.release();
    }
};

export default authModel;