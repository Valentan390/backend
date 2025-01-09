import { v2 as cloudinary, ConfigOptions, UploadApiResponse } from 'cloudinary';
import createHttpError from 'http-errors';
import { unlink } from 'node:fs/promises';

import { env } from './env.js';

const cloud_name = env('CLOUDINARY_CLOUD_NAME');
const api_key = env('CLOUDINARY_API_KEY');
const api_secret = env('CLOUDINARY_API_SECRET');

const config: ConfigOptions = {
  cloud_name: String(cloud_name),
  api_key: String(api_key),
  api_secret: String(api_secret),
};

cloudinary.config(config);

export const saveFileToCloudinary = async (
  file: Express.Multer.File,
): Promise<string> => {
  try {
    const { secure_url }: UploadApiResponse = await cloudinary.uploader.upload(
      file.path,
      {
        folder: 'posters',
      },
    );
    await unlink(file.path);
    return secure_url;
  } catch (error) {
    await unlink(file.path);
    throw createHttpError(500, (error as Error).message);
  }
};
