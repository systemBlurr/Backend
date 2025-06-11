import fs from 'fs';
import moment from 'moment';
import multer from 'multer';


export const singleFileUploader = (uploadPath, prefix, variableName, fileSize) => {

    let Storage = multer.diskStorage({
        destination: function (req, file, callback) {
            if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath)
            callback(null, uploadPath);
        },
        filename: function (req, file, callback) {
            let filenames = file.originalname.split('.');
            var current_timestamp = moment().unix();
            callback(null, `${prefix}-${current_timestamp}.${filenames[filenames.length - 1]}`);
        }
    });

    return multer({ storage: Storage, limits: { fileSize: fileSize } }).single(variableName);

};

export const multiFileUploader = (uploadPath, prefix, variableName, fileSize, maxImages) => {

    let storage = multer.diskStorage({
        destination: (req, file, callback) => {
            if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
            callback(null, uploadPath);
        },
        filename: (req, file, callback) => {
            const filenames = file.originalname.split('.');
            const currentTimestamp = moment().unix();
            const randNum = Math.floor(1000 + Math.random() * 9000);
            const fileExtension = filenames[filenames.length - 1]; // Get file extension
            callback(null, `${prefix}-${currentTimestamp}-${randNum}.${fileExtension}`);
        },
    });

    return multer({ storage: storage, limits: { fileSize: fileSize } }).array(variableName, maxImages);
};


