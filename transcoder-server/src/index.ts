import { GetObjectCommand, S3Client, PutObjectCommand, GetObjectCommandOutput } from '@aws-sdk/client-s3';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';

const client = new S3Client({
  region: "",
  credentials: {
    accessKeyId: "",
    secretAccessKey: ""
  }
});

const RESOLUTIONS = [
  { name: "360p", width: 480, height: 360 },
  { name: "480p", width: 858, height: 480 },
  { name: "720p", width: 1280, height: 720 },
];

const BUCKET_NAME = process.env.BUCKET_NAME;
const KEY = process.env.KEY;

const TRANSCODED_BUCKET_NAME = process.env.BUCKET_NAME;
const TRANSCODED_KEY = process.env.KEY;

async function uploadToS3(filePath: string) {
  const putCmd = new PutObjectCommand({
    Bucket: TRANSCODED_BUCKET_NAME,
    Key: TRANSCODED_KEY,
    Body: await readFile(filePath),
  })
  await client.send(putCmd)
}

async function trascodeVideo(originalVideoPath: string, outputPath: string, width: number, height: number, resolve: (value: unknown) => void) {
  ffmpeg(originalVideoPath)
    .output(outputPath)
    .withVideoCodec("libx264")
    .withAudioCodec("acc")
    .withSize(`${width}x${height}`)
    .format('.mp4')
    .on('end', function () {
      // console.log('Finished processing');
      uploadToS3(outputPath);
      resolve(1);
    })
    .run();
}

async function startTranscoding() {
  try {
    const getCmd = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: KEY,
    });

    const response: GetObjectCommandOutput = await client.send(getCmd);

    const originalFilePath = 'original-video.mp4';

    if (!response.Body) return;

    const str = await response.Body.transformToString()

    await writeFile(originalFilePath, str);

    const originalVideoPath = path.resolve(originalFilePath);

    const promises = new Promise((resolve, reject) => {

      RESOLUTIONS.map(async (resolution) => {
        const outputPath = `video-${resolution.name}.mp4`;
        await trascodeVideo(originalVideoPath, outputPath, resolution.width, resolution.height, resolve);
      })

    })

    await Promise.all([promises]);
  } catch (caught) {
    console.log("error", caught)
  }
}

startTranscoding();