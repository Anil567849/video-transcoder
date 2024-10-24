import ffmpeg from 'fluent-ffmpeg';
import { AWSHelper } from '../aws';

export class FfmpegHelper {

    public static RESOLUTIONS = [
        { name: "360p", width: 480, height: 360 },
        { name: "480p", width: 858, height: 480 },
        { name: "720p", width: 1280, height: 720 },
    ];

    public static trascodeVideo(originalVideoPath: string, outputPath: string, width: number, height: number, resolve: (value: unknown) => void) {
        ffmpeg(originalVideoPath)
            .output(outputPath)
            .withVideoCodec("libx264")
            .withAudioCodec("acc")
            .withSize(`${width}x${height}`)
            .format('.mp4')
            .on('end', function () {
                // console.log('Finished processing');
                AWSHelper.uploadToS3(outputPath);
                resolve(1);
            })
            .run();
    }

}