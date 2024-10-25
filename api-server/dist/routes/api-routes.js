"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = require("../lib/multer");
const router = express_1.default.Router();
// router.post("/upload-video", MulterHelper.uploadToS3.single('video'), (req: Request, res: Response) => {
router.post("/upload-video", multer_1.MulterHelper.uploadAtDisk.single('video'), (req, res) => {
    // console.log(req.file);  
    try {
        if (!req.file) {
            res.status(404).json({ error: 'No file exists' });
            return;
        }
        res.json({ data: "uploaded" });
    }
    catch (error) {
        res.status(500).json({ error: 'File upload failed' });
    }
});
exports.default = router;
