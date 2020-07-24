import React from 'react'
import formatSize from '../../utils/formatSize'
import logo from '../../assets/logo.svg'
import './App.scss'

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

type FileSizeStatus = {
  before: number;
  after: number;
}
let fileSizeStatus: FileSizeStatus = {
  before: 0,
  after: 0,
}
function compress (fileList: any[]): void {
  if (fileList) {
    const total = fileList.length
    let count = 0
    fileSizeStatus = {
      before: 0,
      after: 0,
    }
    document.querySelector('.logo')?.classList.add('speedup')
    fileList.forEach(file => {
      fileSizeStatus.before += file.size
      window.nativeBridge.invoke('minify', file.path, (err, data) => {
        if (err) return notification('错误信息', err.message)
        fileSizeStatus.after += data.size
        console.log(`${file.path}压缩成功！${file.size} -> ${data.size}`)
        if (++count === total) {
          document.querySelector('.logo')?.classList.remove('speedup')
          notification('任务信息', `已完成全部文件的压缩！体积-${((fileSizeStatus.before - fileSizeStatus.after) / fileSizeStatus.before * 100).toFixed(2)}%，共${formatSize(fileSizeStatus.before - fileSizeStatus.after)}`)
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
      compress(fileList)
    })
  }
}, false)

if (window.nativeBridge) {
  window.nativeBridge.register('openSetting', (err, data) => {
    alert('openSetting: ' + data)
  })
}

function App () {
  const handleSelectFiles = () => {
    window.nativeBridge.invoke('selectFiles', null, (err, fileList) => {
      if (err) return alert(err.message)
      compress(fileList)
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
