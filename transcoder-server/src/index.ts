import { GetObjectCommandOutput } from '@aws-sdk/client-s3';
import { writeFile } from 'node:fs/promises';
import path from 'path';
import { AWSHelper } from './lib/aws/index';
import { FfmpegHelper } from './lib/ffmpeg';

async function startTranscoding() {
  try {

    const response: GetObjectCommandOutput = await AWSHelper.getObject();

    if (!response.Body) return;

    const originalFilePath = 'original-video.mp4';

    const str = await response.Body.transformToString()

    await writeFile(originalFilePath, str);

    const originalVideoPath = path.resolve(originalFilePath);

    const promises = new Promise((resolve, reject) => {

      FfmpegHelper.RESOLUTIONS.map(async (resolution) => {
        const outputPath = `video-${resolution.name}.mp4`;
        await FfmpegHelper.trascodeVideo(originalVideoPath, outputPath, resolution.width, resolution.height, resolve);
      })

    })

    await Promise.all([promises]);

  } catch (caught) {

    console.log("error", caught)

  }
}

startTranscoding();