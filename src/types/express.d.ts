// types/express.d.ts
// import * as express from 'express';

// declare global {
//   namespace Express {
//     interface Request {
//       user: {
//         _id: string; // Типизация для вашего user, если это объект с полем _id
//         // Добавьте другие поля, если нужно
//       };
//     }
//   }
// }

import 'express';
import { Multer } from 'multer';

declare global {
  namespace Express {
    interface Request {
      file?: Multer.File; // Добавляем поддержку req.file
      user?: { _id: string }; // Добавляем user, если он тоже используется
    }
  }
}
