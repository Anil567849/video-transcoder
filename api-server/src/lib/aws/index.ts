import {S3Client} from '@aws-sdk/client-s3';

export class AWSHelper {
    public static client = new S3Client({
        region: "",
        credentials: {
            accessKeyId: "",
            secretAccessKey: "",
        }
    })
}