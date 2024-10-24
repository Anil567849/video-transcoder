import { GetObjectCommand, S3Client, PutObjectCommand, GetObjectCommandOutput } from '@aws-sdk/client-s3';
import { BUCKET_NAME, KEY, TRANSCODED_BUCKET_NAME, TRANSCODED_KEY } from '../constants';
import { readFile } from 'fs/promises';

export class AWSHelper {

    public static client = new S3Client({
        region: "",
        credentials: {
            accessKeyId: "",
            secretAccessKey: ""
        }
    });

    public static async uploadToS3(filePath: string) {
        const putCmd = new PutObjectCommand({
            Bucket: TRANSCODED_BUCKET_NAME,
            Key: TRANSCODED_KEY,
            Body: await readFile(filePath),
        })
        await this.client.send(putCmd)
    }

    public static async getObject(): Promise<GetObjectCommandOutput> {
        const getCmd = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: KEY,
        });
        return await this.client.send(getCmd);
    }

}