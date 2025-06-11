import db from "../config/db.js";
import filterService from "../service/filter.service.js";

const reportModel = {};
const conditionEnum = filterService.condition;


const sales_config = [
    { inputKey: "cId", column: 'c.id', condition: conditionEnum.EQ },
    { inputKey: "pId", column: 'p.id', condition: conditionEnum.EQ },
    { inputKey: "from", column: 's.s_date', condition: conditionEnum.GREATER_THAN_EQUAL},
    { inputKey: "to", column: 's.s_date', condition: conditionEnum.LESS_THAN_EQUAL},
];

reportModel.getSalseOverview = async (reqData) => {
    const connection = await db.getConnection();
    
    // Generate dynamic WHERE condition from filters
    const filter = filterService.generateFilterSQL(reqData, sales_config);
    const whereCondition = filter.trim().length > 0 ? ` WHERE ${filter}` : ''; 

    console.log("whereCondition", whereCondition);

    try {
        const coreMetrics = `SELECT COUNT(DISTINCT s.p_id) AS orders, SUM(s.s_price) AS sales FROM sales s
                                LEFT JOIN product p ON s.p_id = p.id
                               LEFT JOIN customer c ON s.c_id = c.id 
                                ${whereCondition}`;

        const allSallingSql = `SELECT s.id, c.name AS cName, p.name AS pName, s.p_desc, s.qty, s.s_price, s.s_date, s.unit, s.status
                               FROM sales s 
                               LEFT JOIN product p ON s.p_id = p.id
                               LEFT JOIN customer c ON s.c_id = c.id 
                               ${whereCondition}
                               ORDER BY s.s_date DESC`;

        const productSelByQty = `SELECT p.name, SUM(s.qty) AS quantity
                                 FROM sales s
                                 LEFT JOIN product p ON s.p_id = p.id
                                 LEFT JOIN customer c ON s.c_id = c.id 
                                 ${whereCondition}
                                 GROUP BY s.p_id, p.name
                                 ORDER BY quantity DESC LIMIT 6`;

        const productSeleByUnit = `SELECT s.unit, SUM(s.qty) AS quantity 
                                   FROM sales s 
                                   LEFT JOIN product p ON s.p_id = p.id
                                   LEFT JOIN customer c ON s.c_id = c.id 
                                   ${whereCondition}
                                   GROUP BY s.unit 
                                   ORDER BY quantity DESC`;

        const totalSalesProduct = `SELECT s.s_date AS date, p.name, SUM(s.qty) AS qty, SUM(s.s_price) AS total
                                   FROM sales s
                                   LEFT JOIN product p ON s.p_id = p.id
                                   LEFT JOIN customer c ON s.c_id = c.id 
                                   ${whereCondition}
                                   GROUP BY s.s_date, p.name
                                   ORDER BY s.s_date DESC, total DESC`;

        // Execute queries
        const [overView] = await connection.query(coreMetrics);
        const [prdSellByQty] = await connection.query(productSelByQty);
        const [prdSellByUnit] = await connection.query(productSeleByUnit);
        const [totalSallProduct] = await connection.query(totalSalesProduct);
        const [allSallData] = await connection.query(allSallingSql);

        // Return all reports
        return { overView, prdSellByQty, prdSellByUnit, totalSallProduct, allSallData };
    } finally {
        connection.release();
    }
};


const purchase_config = [
    { inputKey: "sId", column: 's.id', condition: conditionEnum.EQ },
    { inputKey: "pId", column: 'p.id', condition: conditionEnum.EQ },
    { inputKey: "from", column: 'pr.p_date', condition: conditionEnum.GREATER_THAN_EQUAL},
    { inputKey: "to", column: 'pr.p_date', condition: conditionEnum.LESS_THAN_EQUAL},
];

reportModel.getPurchaseReprts = async (reqData) => {
    const connection = await db.getConnection();
    const filter = filterService.generateFilterSQL(reqData, purchase_config);
    const whereCondition = filter.trim().length > 0 ? ` WHERE ${filter}` : '';

    const coreMetrics = `SELECT COUNT(DISTINCT pr.p_id) AS product_purchase, SUM(pr.price) AS purchaseValue FROM purchase pr
                                LEFT JOIN product p ON pr.p_id = p.id
                               LEFT JOIN supplier s ON pr.s_id = s.id 
                                ${whereCondition}`;
    const allPurchaseSql = `SELECT pr.id, s.name AS sName, p.name AS pName, pr.description, pr.qty, pr.price, pr.p_date, pr.unit, pr.status
                                FROM purchase pr 
                                LEFT JOIN product p ON pr.p_id = p.id
                                LEFT JOIN supplier s ON pr.s_id = s.id  
                                ${whereCondition}
                                ORDER BY pr.p_date DESC`;
    const productPurchaseByQty = `SELECT p.name, SUM(pr.qty) AS quantity
                                FROM purchase pr
                                LEFT JOIN product p ON pr.p_id = p.id
                                LEFT JOIN supplier s ON pr.s_id = s.id  
                                ${whereCondition}
                                GROUP BY pr.p_id, p.name
                                ORDER BY quantity DESC LIMIT 6`;
    const productPurchaseByUnit = `SELECT pr.unit, SUM(pr.qty) AS quantity 
                                FROM purchase pr 
                                LEFT JOIN product p ON pr.p_id = p.id
                                LEFT JOIN supplier s ON pr.s_id = s.id  
                                ${whereCondition}
                                GROUP BY pr.unit 
                                ORDER BY quantity DESC`;
    const allPurchaseProduct = `SELECT pr.p_date date, p.name, SUM(pr.qty) AS qty, SUM(pr.price) AS total
                                FROM purchase pr
                                LEFT JOIN product p ON pr.p_id = p.id
                                LEFT JOIN supplier s ON pr.s_id = s.id   
                                ${whereCondition}
                                GROUP BY pr.p_date, p.name
                                ORDER BY pr.p_date DESC, total DESC`;

    try {

        const [overView] = await connection.query(coreMetrics);
        const [prdPurchaseByQty] = await connection.query(productPurchaseByQty);
        const [prdPurchaseByUnit] = await connection.query(productPurchaseByUnit);
        const [totalPurchaseProduct] = await connection.query(allPurchaseProduct);
        const [allPurchaseData] = await connection.query(allPurchaseSql);

        // Return all reports
        return { overView, prdPurchaseByQty, prdPurchaseByUnit, totalPurchaseProduct, allPurchaseData };
    } finally {
        connection.release();
    }

}


export default reportModel;
