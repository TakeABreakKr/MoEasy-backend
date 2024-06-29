export abstract class FileService {
  abstract uploadFile(file: Express.Multer.File): string;
}
