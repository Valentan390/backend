// import multer from 'multer';
// import createHttpError from 'http-errors';

// import { TEMP_UPLOAD_DIR } from '../constants/index.js';

// const storage = multer.diskStorage({
//   // destination: (req, file, callback)=> {
//   //     callback(null, TEMP_UPLOAD_DIR);
//   // }
//   destination: TEMP_UPLOAD_DIR,
//   filename: (req, file, callback) => {
//     const filename = `${Date.now()}_${file.originalname}`;
//     callback(null, filename);
//   },
// });

// const limits = {
//   fileSize: 1024 * 1024 * 5,
// };

// const fileFilter = (req, file, callback) => {
//   const extention = file.originalname.split('.').pop();
//   if (extention === 'exe') {
//     return callback(createHttpError(400, '.exe not allow extension'));
//   }
//   callback(null, true);
// };

// export const upload = multer({
//   storage,
//   limits,
//   fileFilter,
// });

import multer, { StorageEngine, FileFilterCallback } from 'multer';
import createHttpError from 'http-errors';
import { Request } from 'express';

import { TEMP_UPLOAD_DIR } from '../constants/index.js';

const storage: StorageEngine = multer.diskStorage({
  destination: TEMP_UPLOAD_DIR,
  filename: (
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, filename: string) => void,
  ) => {
    const filename = `${Date.now()}_${file.originalname}`;
    callback(null, filename);
  },
});

const limits: multer.Options['limits'] = {
  fileSize: 1024 * 1024 * 5, // 5 MB
};

const fileFilter: multer.Options['fileFilter'] = (
  req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback,
) => {
  const extension = file.originalname.split('.').pop()?.toLowerCase();
  if (extension === 'exe') {
    return callback(createHttpError(400, '.exe not allowed extension'));
  }
  callback(null, true);
};

export const upload = multer({
  storage,
  limits,
  fileFilter,
});
