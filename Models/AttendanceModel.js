import hrmdb from "../config/hrmdb.js";

const AttendanceModel = {};

AttendanceModel.upsert = async (data) => {
  const conn = await hrmdb.getConnection();
  try {
    if (data.attendance_id) {
      const sql = `
        UPDATE attendance
        SET employee_id=?, company_id=?, check_in=?, check_out=?, attendance_date=?, status=?, late_time=?, working_hour=?
        WHERE attendance_id=?
      `;
      const params = [
        data.employee_id, data.company_id, data.check_in, data.check_out,
        data.attendance_date, data.status, data.late_time, data.working_hour,
        data.attendance_id
      ];
      const [result] = await conn.query(sql, params);
      return result;
    } else {
      const sql = `
        INSERT INTO attendance
        (employee_id, company_id, check_in, check_out, attendance_date, status, late_time, working_hour)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const params = [
        data.employee_id, data.company_id, data.check_in, data.check_out,
        data.attendance_date, data.status, data.late_time, data.working_hour
      ];
      const [result] = await conn.query(sql, params);
      return { insertId: result.insertId };
    }
  } finally {
    conn.release();
  }
};

AttendanceModel.getList = async ({ page = 1, per_page = 10, employee_id, start_date, end_date }) => {
  const conn = await hrmdb.getConnection();
  const offset = (page - 1) * per_page;
  const where = [];
  const params = [];

  if (employee_id) {
    where.push('employee_id = ?');
    params.push(employee_id);
  }
  if (start_date) {
    where.push('attendance_date >= ?');
    params.push(start_date);
  }
  if (end_date) {
    where.push('attendance_date <= ?');
    params.push(end_date);
  }
  const whereSQL = where.length ? 'WHERE ' + where.join(' AND ') : '';
  
  try {
    const [rows] = await conn.query(
      `SELECT * FROM attendance ${whereSQL} ORDER BY attendance_date DESC LIMIT ?, ?`,
      [...params, offset, per_page]
    );
    const [[count]] = await conn.query(
      `SELECT COUNT(*) AS total FROM attendance ${whereSQL}`,
      params
    );
    return { rows, total: count.total };
  } finally {
    conn.release();
  }
};

AttendanceModel.delete = async (id) => {
  const conn = await hrmdb.getConnection();
  try {
    const [result] = await conn.query(`DELETE FROM attendance WHERE attendance_id = ?`, [id]);
    return result;
  } finally {
    conn.release();
  }
};

export default AttendanceModel;
