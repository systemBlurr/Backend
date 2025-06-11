import pkg from 'mysql2/promise';
const { createPool } = pkg; // Destructure createPool from the imported package
import dotenv from 'dotenv';
dotenv.config();

// console.log("process.env.DB_PASSWORD",process.env.DB_PASSWORD)
const pool = createPool({
    host: process.env.INVENTORY_DB_HOST,
    user: process.env.INVENTORY_DB_USER,
    password: "santosh#25",
    database: process.env.INVENTORY_DB_NAME,
    port: process.env.INVENTORY_DB_PORT ? parseInt(process.env.INVENTORY_DB_PORT) : 3306,
    charset: 'utf8mb4',
    decimalNumbers: true,
    connectTimeout: 20 * 1000,
    namedPlaceholders: true,
    connectionLimit: process.env.INVENTORY_DB_CONNECTION_LIMIT ? parseInt(process.env.INVENTORY_DB_CONNECTION_LIMIT) : 10
});

pool.on('acquire', (connection) => {
    console.log('Connection %d acquired', connection.threadId);
});

pool.on('release', (connection) => {
    console.log('Connection %d released', connection.threadId);
});

const getConnection = () => {
    return pool.getConnection();
}

const db = {
    getConnection,
};

export default db;