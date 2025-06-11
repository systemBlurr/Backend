const consoleLogMiddleware = (req, res, next) => {
    console.log("--test---",req, res);
    next(); // Pass control to the next middleware or route handler
};
export default consoleLogMiddleware;