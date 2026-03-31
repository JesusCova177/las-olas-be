import { lstatSync, readdirSync } from 'fs';
import { join } from 'path';

export function recursiveDirFiles(path: string, filterExt?: RegExp): string[] {
  const result: string[] = [];
  try {
    const files = readdirSync(path);
    files.forEach((file) => {
      const filePath = join(path, file);
      const stat = lstatSync(filePath);
      if (stat.isDirectory()) {
        result.push(...this.recursiveDirFiles(filePath, filterExt));
      } else {
        if (!!filterExt) {
          const fileExt = file.substring(file.lastIndexOf('.'));
          if (filterExt.test(fileExt)) result.push(filePath);
        } else {
          result.push(filePath);
        }
      }
    });
    return result;
  } catch (err) {
    if (err?.message.includes('ENOENT: no such file or directory, scandir'))
      return result;
    console.error('Error while recursive dir files retrieve.', err);
    throw err;
  }
}
