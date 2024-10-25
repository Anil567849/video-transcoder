import express, { Request, Response } from 'express';
import { MulterHelper } from '../lib/multer';
const router = express.Router();

router.post("/upload-video", MulterHelper.uploadToS3.single('video'), (req: Request, res: Response) => {
// router.post("/upload-video", MulterHelper.uploadAtDisk.single('video'), (req: Request, res: Response) => {
    // console.log(req.file);  
    try {
        if (!req.file) {
            res.status(404).json({ error: 'No file exists' });
            return;
        }
        res.json({ data : "uploaded" });
    } catch (error) {
        res.status(500).json({ error: 'File upload failed' });
    }
})

export default router;