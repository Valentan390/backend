import { rename } from 'node:fs/promises';
import * as path from 'node:path';
// import { File } from 'multer';

import { UPLOAD_DIR } from '../constants/index.js';

export const saveFileToUploadsDir = async (
  file: Express.Multer.File,
  folder: string,
): Promise<void> => {
  const newPath = path.join(UPLOAD_DIR, folder, file.filename);
  await rename(file.path, newPath);
};
