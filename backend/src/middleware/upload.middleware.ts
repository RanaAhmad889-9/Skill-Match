import multer from 'multer';
import { AppError } from '../utils/AppError';

const storage = multer.memoryStorage();

const fileFilter=(
    req:Express.Request,
    file:Express.Multer.File,
    cb:multer.FileFilterCallback
)=>{
    if(file.mimetype === 'application/pdf'){
        cb(null,true);
    }else {
    cb(new AppError('Only PDF files are allowed', 400));
  }
};

export const upload=multer({
    storage,
    fileFilter,
    limits:{fileSize:5*1024*1024},
});