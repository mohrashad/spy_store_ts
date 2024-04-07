import multer from "multer"
import path from "path"
import {v4 as uuid} from 'uuid';

export const fileUploadOptions = () => ({
    storage: multer.diskStorage({
        destination: (req: any, file: any, cb: any) => cb(null,  path.join(__dirname, '../../uploads')),
        filename: (req: any, file: any, cb: any) => cb(null, uuid() + file.originalname)
    }),
    fileFilter: (req: any, file: any, cb: any) => {
        if (file && file.mimetype && (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')) {
            return cb(null, true)
        }
       return cb(null, false);
    },
    limits: {
        fieldNameSize: 255,
        fileSize: 1024 * 1024 * 2
    }
});