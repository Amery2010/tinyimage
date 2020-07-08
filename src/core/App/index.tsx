import React from 'react'
import logo from '../../assets/logo.svg'
import './App.css'

function notification (title: string, content: string) {
  return new Notification(title, {
    body: content,
  })
}

function getFilesWebkitDataTransferItems (dataTransferItems: any) {
  const files: any[] = []
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
    const entriesPromises = []
    for (let item of dataTransferItems) {
      entriesPromises.push(traverseFileTreePromise(item.webkitGetAsEntry()))
    }
    Promise.all(entriesPromises).then(() => {
      resolve(files)
    }).catch(err => reject(err))
  })
}

function compress (fileList: any[]): void {
  if (fileList) {
    const total = fileList.length
    let count = 0
    document.querySelector('.logo')?.classList.add('speedup')
    fileList.forEach(path => {
      window.nativeBridge.invoke('minify', path, (err) => {
        if (err) return notification('错误信息', err.message)
        console.log(path + ' 压缩成功！')
        if (++count === total) {
          document.querySelector('.logo')?.classList.remove('speedup')
          notification('任务信息', '已完成全部文件的压缩！')
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
      const filePaths: string[] = []
      fileList.forEach((item: any) => {
        filePaths.push(item.path)
      })
      compress(filePaths)
    })
  }
}, false)

function App () {
  const handleSelectFiles = () => {
    window.nativeBridge.invoke('selectFiles', null, (err, filePaths) => {
      if (err) return alert(err.message)
      compress(filePaths)
    })
  }
  return (
    <div id="app">
      <main>
        <img src={logo} className="logo" alt="logo" />
        <p className="tip">拖动文件到这里，或者<span className="select" onClick={handleSelectFiles}>浏览</span></p>
      </main>
    </div>
  )
}

export default App
