import React, { useRef } from 'react'
import logo from '../../assets/logo.svg'
import './App.css'

interface NativeFile extends File {
  path: string;
}
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  webkitdirectory?: boolean | string;
}

function getFilesWebkitDataTransferItems (dataTransferItems: any) {
  let files: any[] = []
  const traverseFileTreePromise = (item: any) => {
    return new Promise(resolve => {
      if (item.isFile) {
        item.file((file: File) => {
          if (/image\//.test(file.type)) {
            files.push(file)
          }
          resolve(file)
        })
      } else if (item.isDirectory) {
        const dirReader = item.createReader()
        dirReader.readEntries((entries: any) => {
          const entriesPromises = []
          for (let entr of entries) {
            entriesPromises.push(traverseFileTreePromise(entr))
          }
          resolve(Promise.all(entriesPromises))
        })
      }
    })
  }

  return new Promise((resolve, reject) => {
    let entriesPromises = []
    for (let item of dataTransferItems) {
      entriesPromises.push(traverseFileTreePromise(item.webkitGetAsEntry()))
    }
    Promise.all(entriesPromises).then(() => {
      resolve(files)
    }).catch(err => reject(err))
  })
}

function extractFileListPath (fileList: FileList | null): string[] {
  if (!fileList) return []
  const fileListPath: string[] = Object.values(fileList).map(file => {
    const nativeFile = file as NativeFile
    return nativeFile.path
  })
  return fileListPath
}

function compress (fileList: any[]): void {
  if (fileList) {
    const total = fileList.length
    let count = 0
    fileList.forEach(path => {
      window.nativeBridge.invoke('minify', path, (err) => {
        if (err) {
          alert(err.message)
        } else {
          console.log(path + ' 压缩成功！')
        }
        if (++count === total) {
          alert('已完成全部文件的压缩！')
        }
      })
    })
  } else {
    console.warn('文件列表获取异常')
  }
}

document.addEventListener('dragover', ev => {
  ev.preventDefault()
}, false)

document.addEventListener('drop', ev => {
  ev.preventDefault()
  if (ev.dataTransfer) {
    getFilesWebkitDataTransferItems(ev.dataTransfer.items).then((fileList: any) => {
      const filePathList: string[] = []
      fileList.forEach((item: any) => {
        filePathList.push(item.path)
      })
      compress(filePathList)
    })
  }
}, false)

const FileInput: React.FC<InputProps> = props => {
  const fileInputElem = useRef<HTMLInputElement>(null)

  const handleSelectFiles = () => {
    if (fileInputElem.current) {
      fileInputElem.current.click()
    }
  }
  return (
    <>
      <input ref={fileInputElem} {...props} />
      <p className="tip">拖动文件到这里，或者<span className="select" onClick={handleSelectFiles}>浏览</span></p>
    </>
  )
}

function App () {
  const handleFilesChange = (ev: React.ChangeEvent) => {
    const target = ev.target as HTMLInputElement
    const filePathList: string[] = extractFileListPath(target.files)
    compress(filePathList)
  }

  return (
    <div id="app">
      <main>
        <img src={logo} className="logo" alt="logo" />
        <FileInput
          className="hidden"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFilesChange}
        />
      </main>
    </div>
  )
}

export default App
