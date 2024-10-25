import multer from "multer";
import multerS3 from 'multer-s3'
import { S3_BUCKET_NAME } from "../constants";
import { AWSHelper } from "../aws";

export class MulterHelper {
    // Set up storage and filename configuration
    private static storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/'); // Set upload directory
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + '-' + file.originalname); // Customize file naming
        },
    });
    
    public static uploadAtDisk = multer({ storage: this.storage });

    public static uploadToS3 = multer({
        storage: multerS3({
            s3: AWSHelper.client,
            bucket: S3_BUCKET_NAME,
            metadata: function (req, file, cb) {
                cb(null, { fieldName: file.fieldname });
            },
            key: function (req, file, cb) {
                cb(null, Date.now().toString())
            }
        }),
    });
}