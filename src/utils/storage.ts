import * as path from 'path';
import { diskStorage } from 'multer';
import * as mime from 'mime';
import { v4 as uuid } from 'uuid';
import * as fs from 'fs';

export function ensureDirectoryExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    fs.chmodSync(dirPath, '0777'); // ustawienie uprawnień na 0777
  }
}

export function storageDir() {
  const dirPath = path.join(__dirname, '../../../src/storage');
  ensureDirectoryExists(dirPath);
  return dirPath;
}

export function multerStorage(dest: string) {
  ensureDirectoryExists(dest);

  return diskStorage({
    destination: (req, file, cb) => cb(null, dest),
    filename: (req, file, cb) => {
      const ext =
        mime.getExtension(file.mimetype) || path.extname(file.originalname);
      cb(null, `${uuid()}.${ext}`);
    },
  });
}
