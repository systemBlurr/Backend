
export const getSuccessObject = (result = {}) => {
    let response = {
        status: 200,
        message: 'success',
        data: result
    };
    return response;
};

export const getErrorObject = (statusCode, message, data = {}) => {
    console.error("Response sent with code %s, message: %s, data: %o", statusCode, message, data);
    let response = {
        status: statusCode,
        message: message,
        data: data
    };
    return response;
};