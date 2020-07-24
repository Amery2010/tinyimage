import fs from 'fs'
import path from 'path'

type FileInfor = {
  path: string;
  size: number;
}

async function getFileListInfor(filePaths: string[], imageExt: string[]): Promise<FileInfor[]> {
  const pathList: FileInfor[] = []
  const getFiles = (paths: string[]): any => {
    return paths.map(filePath => {
      return new Promise((resolve) => {
        const stat = fs.statSync(filePath)
        const ext = path.extname(filePath).substring(1)
        if (stat.isFile() && imageExt.includes(ext)) {
          const fileInfor = {
            path: filePath,
            size: stat.size,
          }
          pathList.push(fileInfor)
          resolve(fileInfor)
        } else if (stat.isDirectory()) {
          const getFilesPromises = getFiles(fs.readdirSync(filePath).map(path => `${filePath}/${path}`))
          resolve(Promise.all(getFilesPromises))
        } else {
          resolve({
            path: filePath,
            size: 0,
          })
        }
      })
    })
  }
  await Promise.all(getFiles(filePaths))
  return pathList
}

export default getFileListInfor
