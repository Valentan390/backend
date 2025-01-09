import createHttpError from 'http-errors';
import swaggerUI from 'swagger-ui-express';
import { readFileSync } from 'node:fs';
import { Request, Response, NextFunction } from 'express';

import { SWAGGER_PATH } from '../constants/index.js';

export const swaggerDocs = () => {
  try {
    const swaggerDoc = JSON.parse(readFileSync(SWAGGER_PATH, 'utf-8'));
    console.log('Swagger Doc:', swaggerDoc);
    console.log(
      'Middleware function type:',
      typeof swaggerUI.setup(swaggerDoc),
    );
    return [...swaggerUI.serve, swaggerUI.setup(swaggerDoc)];
  } catch (error) {
    return (req: Request, res: Response, next: NextFunction) =>
      next(createHttpError(500, "Can't load swagger docs"));
  }
};

// import createHttpError from 'http-errors';
// import swaggerUI from 'swagger-ui-express';
// import { readFileSync, existsSync } from 'node:fs';
// import { Request, Response, NextFunction } from 'express';

// import { SWAGGER_PATH } from '../constants/index.js';

// export const swaggerDocs = () => {
//   try {
//     // Проверяем, существует ли файл по указанному пути
//     if (!existsSync(SWAGGER_PATH)) {
//       throw new Error(`Swagger file not found at path: ${SWAGGER_PATH}`);
//     }

//     // Загружаем и парсим файл Swagger
//     const swaggerDoc = JSON.parse(readFileSync(SWAGGER_PATH, 'utf-8'));

//     // Возвращаем middleware для Swagger
//     return (req: Request, res: Response, next: NextFunction) => {
//       //   swaggerUI.serve(req, res, next); // Swagger статические файлы
//       swaggerUI.setup(swaggerDoc)(req, res, next); // Swagger UI интерфейс
//     };
//   } catch (error) {
//     // Обработка ошибок при загрузке Swagger документа
//     return (req: Request, res: Response, next: NextFunction) =>
//       next(createHttpError(500, "Can't load swagger docs"));
//   }
// };
