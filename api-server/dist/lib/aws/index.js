"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AWSHelper = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
class AWSHelper {
}
exports.AWSHelper = AWSHelper;
AWSHelper.client = new client_s3_1.S3Client({
    region: "",
    credentials: {
        accessKeyId: "",
        secretAccessKey: "",
    }
});
