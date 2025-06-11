/**
 * @author Surya
 */
import moment from 'moment';
import multer from 'multer';
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

let uploadService = {};
var mime = {
    html: 'text/html',
    txt: 'text/plain',
    css: 'text/css',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    js: 'application/javascript'
};


/**
 * this will return an object of multer to store single file from http request
 * 
 * @param {string} uploadPath - dir path where to save file
 * @param {string} prefix - prefix which need to add to file name
 * @param {Array} variableName - name of fields in which file is present
 * @param {number} fileSize - max size of file in bytes
 *
 */
 uploadService.getMixUploader = (uploadPath, prefix, variableName, fileSize) => {

    let Storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, uploadPath);
        },
        filename: function (req, file, callback) {
            let filenames = file.originalname.split('.');
            var current_timestamp = moment().unix();
            const randNum = Math.floor(1000 + Math.random() * 9000);
            callback(null, `${prefix}-${current_timestamp}.${randNum}.${filenames[filenames.length - 1]}`);
        }
    });

    return multer({ storage: Storage, limits: { fileSize: fileSize } }).fields(variableName);
}


/**
 * this will return an object of multer to store single file from http request
 * 
 * @param uploadPath - dir path where to save file
 * @param prefix - prefix which need to add to file name
 * @param variableName - name of attribute in which file is present
 * @param fileSize - max size of file in bytes
 *
 */
uploadService.getUploader = (uploadPath, prefix, variableName, fileSize) => {

    let Storage = multer.diskStorage({
        destination: function (req, file, callback) {
            if(!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath)
            callback(null, uploadPath);
        },
        filename: function (req, file, callback) {
            let filenames = file.originalname.split('.');
            var current_timestamp = moment().unix();
            callback(null, `${prefix}-${current_timestamp}.${filenames[filenames.length - 1]}`);
        }
    });

    return multer({ storage: Storage, limits: { fileSize: fileSize } }).single(variableName);
}

/**
 * 
 * @param {*} uploadPath 
 * @param {*} prefix 
 * @param {*} variableName 
 * @param {*} fileSize 
 * @param {*} maxImages 
 */
uploadService.getMultiUpload = (uploadPath, prefix, variableName, fileSize, maxImages) => {

    let Storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, uploadPath);
        },
        filename: function (req, file, callback) {
            let filenames = file.originalname.split('.');
            var current_timestamp = moment().unix();
            callback(null, `${prefix}-${current_timestamp}.${file.originalname}`);
        }
    });

    return multer({ storage: Storage, limits: { fileSize: fileSize } }).array(variableName, maxImages);
}

/**
 * this will generate thumbnail of given size from file  
 * 
 * @param filepath - dir path where file resites
 * @param filename - name of file
 * @param size - resolution of file required
 */
uploadService.createThumbnail = (filepath, filename, size) => {

    sharp(path.join(filepath, filename))
        .resize(size)
        .toFile(path.join(filepath, size + "_" + filename), (err, info) => {
            if(err) console.log("createThumbnail failed:", err)
        });

}


/**
 * wirte given file to response stream and close response
 * 
 * @param dirPath - dir path where file resites
 * @param file - name of file
 * @param response - http response to which need to wirte file
 */
uploadService.writeImage = (dirPath, file, response) => {
    uploadService.writeImageThumbnail(dirPath, file, response, 0);
}
/**
 * wirte given file to response stream after resizeing and close response
 * 
 * @param dirPath - dir path where file resites
 * @param file - name of file
 * @param response - http response to which need to wirte file
 * @param size - resolution of required file
 */
uploadService.writeImageThumbnail = (dirPath, file, response, size) => {
    var filePath = path.join(dirPath, file);
    if (fs.existsSync(filePath)) {
        var type = mime[path.extname(file).slice(1)] || 'text/plain';
        var imgFile = sharp(filePath, { failOnError: false });
        if (size > 0) {
            imgFile = imgFile.resize(size)
        }
        imgFile.toBuffer()
            .then(data => {
                response.set('Content-Type', type);
                response.set('Cache-Control', 'max-age=31536000')
                response.send(data)
            }).catch(err => { console.log("writeImageThumbnail failed:", err) });
    } else {
        response.status(404).send("Not found.");
    }
}

export default uploadService;