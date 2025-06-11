
const validationService = {}

/**
 * check param exists in request or not and return list of error if any else empty array
 * 
 * @param request http request object
 * @param param parameters which need to be check in request body
 * @returns list of error messages
 */

const responseStream = {
    send: console.log,
    status: (code) => ({ send: console.log }),
};
validationService.validateRequired = (request, param, next) => {
    let error = [];
    param.forEach(element => {
        if (request[element] == undefined || request[element] == 'undefined' ||
            (typeof request[element] == "string" && request[element].trim() == "")) {
            error.push(element + " is required")
        }
    });
    if (error.length > 0) {
        return error;
    }

}

validationService.validateAtleastOneRequired = (request, param) => {

    let error = [];
    param.forEach(element => {
        if (request[element] == undefined || request[element] == 'undefined' ||
            (typeof request[element] == "string" && request[element].trim() == "")) {
            error.push(element)
        }
    });
    if (error.length == param.length) {
        return error;
    }
}

/**
 * check param exists in request or not if exists then it should not be empty array
 * 
 * @param {*} request 
 * @params {*} params 
 * @returns 
 */
validationService.validateArrayRequired = (request, params) => {

    let error = [];
    params.forEach(element => {
        if (request[element] == undefined || request[element] == 'undefined' || request[element] == null ||
            (request[element].length == 0)) {
            error.push(element + " is required")
        }
    });
    if (error.length > 0) {
        return error;
    }
}
/**
 * check given value is undefined or empty
 */
validationService.isEmpty = (value) => {
    return value == undefined || (value == "string" && value.trim() == "")
}
/**
 * check given value is present and is a number
 */
validationService.validateNumber = (request, param) => {
    let error = [];
    param.forEach(element => {
        if (validationService.isEmpty(request[element]) || isNaN(request[element])) {
            error.push(element + " should be number")
        }
    });
    if (error.length > 0) {
        return error;
    }
}
/**
 * validate mobile number starts with +64 or not
 * 
 * @param request
 * @param param attribute in request which have mobile number to validate present
 * 
 * @returns list of error
 */
validationService.validateMobile = (request, param) => {
    let error = [];
    if (request[param] != undefined && request[param] != null && !request[param].startsWith("+64")) {
        error.push(param + " should start with +64");
    }
    // we can add length check also
    if (error.length > 0) {
        return error;
    }
    return error;
}

/**
 * validate duration for get wassup  details
 * 
 * @param request
 * @param param attribute in request which have duration to validate present
 * 
 * @returns list of error
 */
validationService.validateDuration = (request, param) => {
    const durationRegex = /^(\d{1,2})\s+(day|month|hour){1}$/;

    let error = [];
    param.forEach(element => {
        if (request[element] == undefined || request[element] == 'undefined' ||
            (typeof request[element] == "string" && request[element].trim() == "")) {
            error.push(element + " is required")
        }
        else if (!request[element].match(durationRegex)) {
            error.push(element + " is not valid")
        }
    });
    if (error.length > 0) {
        return error;
    }
}

export default validationService;