import { escape } from "mysql2";


const filterService = {
    condition: {
        EQ: 'EQ',
        NEQ: 'NEQ',
        START_WITH: 'STRT_WT',
        END_WITH: 'END_WT',
        CONTAIN: 'CONTAIN',
        NOT_CONTAIN: 'NOT_CONTAIN',
        IS_PRESENT: 'IS_PRESENT',
        JSON_CONTAINS: 'JSON_CONTAINS',
        JSON_CONTAINS_NUMBER: 'JSON_CONTAINS_NUMBER',
        GREATER_THAN_EQUAL: 'GREATER_THAN_EQUAL',
        LESS_THAN_EQUAL: 'LESS_THAN_EQUAL',

    }
};

/**
 * Fetch all users details through parameter
 * @param {*} reqData
 * @param {*} filterConfig
 * @returns
 */
filterService.generateFilterSQL = (reqData, filterConfig) => {
    let sql = '';
    for (let i = 0; i < filterConfig.length; i++) {
        const item = filterConfig[i];
        const input = reqData[item.inputKey];
        if (reqData[item.inputKey] != undefined && reqData[item.inputKey] != '') {
            let condition = '';
            switch (item.condition) {
                case filterService.condition.EQ:
                    condition += item.column + ' = ' + escape(input)
                    break;
                case filterService.condition.NEQ:
                    condition += item.column + ' != ' + escape(input)
                    break;
                case filterService.condition.START_WITH:
                    condition += item.column + ` like ${escape(input + '%')}`;
                    break;
                case filterService.condition.END_WITH:
                    condition += item.column + ` like ${escape('%' + input)}`;
                    break;
                case filterService.condition.CONTAIN:
                    condition += item.column + ` like ${escape('%' + input + '%')}`;
                    break;
                case filterService.condition.NOT_CONTAIN:
                    condition += item.column + ` not like ${escape('%' + input + '%')}`;
                    break;
                case filterService.condition.JSON_CONTAINS:
                    condition += `JSON_CONTAINS(${item.column}, '"${input}"')`;
                    break;
                case filterService.condition.JSON_CONTAINS_NUMBER:
                    if (reqData[item.inputKey] != 0) {
                        condition += ` JSON_CONTAINS(${item.column} , '${input}')`;
                    }
                    break;
                case filterService.condition.LESS_THAN_EQUAL:
                    if (reqData[item.inputKey] != 0) {
                        condition += item.column +  ' <= ' + escape(input)
                    }
                    break;
                case filterService.condition.GREATER_THAN_EQUAL:
                    if (reqData[item.inputKey] != 0) {
                        condition += item.column + ' >= ' + escape(input)
                    }
                    break;
                case filterService.condition.IS_PRESENT:
                    if (input == 'true')
                        condition += item.column + ` is not null`;
                    else if (input == 'false')
                        condition += item.column + ` is null`;
                    break;
            }
            if (condition != '') {
                sql += condition + ' and '
            }
        }
    }
    return sql.substring(0, sql.lastIndexOf(" and "));

};


filterService.hrmgenerateFilterSQL = (reqData, filterConfig) => {
    let sql = '';
    let values = [];

    for (let i = 0; i < filterConfig.length; i++) {
        const item = filterConfig[i];
        const input = reqData[item.inputKey];
        
        if (input !== undefined && input !== '') {
            let condition = '';
            switch (item.condition) {
                case filterService.condition.EQ:
                    condition = `${item.column} = ?`;
                    values.push(input);
                    break;
                case filterService.condition.CONTAIN:
                    condition = `${item.column} LIKE ?`;
                    values.push(`%${input}%`);
                    break;
                case filterService.condition.START_WITH:
                    condition = `${item.column} LIKE ?`;
                    values.push(`${input}%`);
                    break;
                case filterService.condition.END_WITH:
                    condition = `${item.column} LIKE ?`;
                    values.push(`%${input}`);
                    break;
                // Add other cases as needed...

                default:
                    break;
            }

            if (condition) {
                sql += condition + ' AND ';
            }
        }
    }

    // Remove trailing ' AND '
    sql = sql.trim();
    if (sql.endsWith('AND')) {
        sql = sql.substring(0, sql.lastIndexOf('AND')).trim();
    }

    return {
        sql,
        values
    };
};

filterService.generateDurationByUnit = (duration, unit) => {
    // Define a mapping of units to their corresponding strings
    const unitToString = {
        d: 'day',
        m: 'month',
        y: 'year',
    };

    // Check if the unit is valid
    if (unit in unitToString) {
        // Return a formatted string
        return `${duration} ${unitToString[unit]}`;
    } else {
        // Invalid unit, return an error message or handle it as needed
        return 'Invalid unit';
    }
}



export default filterService;

