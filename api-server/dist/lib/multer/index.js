"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MulterHelper = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const constants_1 = require("../constants");
const aws_1 = require("../aws");
class MulterHelper {
}
exports.MulterHelper = MulterHelper;
_a = MulterHelper;
// Set up storage and filename configuration
MulterHelper.storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Set upload directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Customize file naming
    },
});
MulterHelper.uploadAtDisk = (0, multer_1.default)({ storage: _a.storage });
MulterHelper.uploadToS3 = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: aws_1.AWSHelper.client,
        bucket: constants_1.S3_BUCKET_NAME,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString());
        }
    }),
});
