// import { Request, Response, NextFunction, RequestHandler } from 'express';
// import { CustomRequest, ParamsWithId } from '../types/params';

// export const ctrlWrapper = (
//   ctrl: RequestHandler<ParamsWithId>,
// ): RequestHandler<ParamsWithId> => {
//   const func = async (
//     req: CustomRequest,
//     res: Response,
//     next: NextFunction,
//   ) => {
//     try {
//       await ctrl(req, res, next);
//     } catch (error) {
//       next(error);
//     }
//   };

//   return func;
// };

import { Request, Response, NextFunction } from 'express';
// import { CustomRequest, ParamsWithId } from '../types/params';

// export const ctrlWrapper = (
//   ctrl: (
//     req: CustomRequest,
//     res: Response,
//     next: NextFunction,
//   ) => Promise<void>,
// ): RequestHandler<ParamsWithId> => {
//   const func: RequestHandler<ParamsWithId> = async (
//     req: Request<ParamsWithId>,
//     res: Response,
//     next: NextFunction,
//   ) => {
//     try {
//       // Приведение req к CustomRequest
//       await ctrl(req as CustomRequest, res, next);
//     } catch (error) {
//       next(error);
//     }
//   };

//   return func;
// };

export const ctrlWrapper = (
  ctrl: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) => {
  const func = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await ctrl(req, res, next);
    } catch (error) {
      next(error);
    }
  };

  return func;
};
