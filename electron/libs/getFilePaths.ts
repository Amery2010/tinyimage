import fs from 'fs'
import path from 'path'

async function getFilePaths (filePaths: string[], imageExt: string[]): Promise<string[]> {
  const pathList: string[] = []
  const getFiles = (paths: string[]): any => {
    return paths.map(filePath => {
      return new Promise((resolve) => {
        const stat = fs.statSync(filePath)
        if (stat.isFile() && imageExt.includes(path.extname(filePath).substring(1))) {
          pathList.push(filePath)
          resolve(filePath)
        } else if (stat.isDirectory()) {
          const getFilesPromises = getFiles(fs.readdirSync(filePath).map(path => `${filePath}/${path}`))
          resolve(Promise.all(getFilesPromises))
        } else {
          resolve(filePath)
        }
      })
    })
  }
  await Promise.all(getFiles(filePaths))
  return pathList
}

export default getFilePaths
