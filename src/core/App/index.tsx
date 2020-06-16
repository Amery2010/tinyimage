import React, { useRef } from 'react'
import logo from '../../assets/logo.svg'
import './App.css'

interface NativeFile extends File {
  path: string;
}

function extractFileListPath (fileList: FileList) {
  const fileListPath: string[] = Object.values(fileList).map(file => {
    const nativeFile = file as NativeFile
    return nativeFile.path
  })
  return fileListPath
}

document.addEventListener('dragover', ev => {
  ev.preventDefault()
}, false)

document.addEventListener('drop', ev => {
  ev.preventDefault()
  const fileList = ev.dataTransfer?.files
  if (fileList) {
    window.nativeBridge.invoke('minify', extractFileListPath(fileList), () => {
      alert('压缩成功！')
    })
  } else {
    console.warn('文件列表获取异常')
  }
}, false)

function App() {
  const fileInputElem = useRef<HTMLInputElement>(null)

  const handleFilesChange = (ev: React.ChangeEvent) => {
    const target = ev.currentTarget as HTMLInputElement
    const fileList = target.files
    if (fileList) {
      window.nativeBridge.invoke('minify', extractFileListPath(fileList), () => {
        alert('压缩成功！')
      })
    } else {
      console.warn('文件列表获取异常')
    }
  }
  const handleSelectFiles = () => {
    if (fileInputElem.current) {
      fileInputElem.current.click()
    }
  }

  return (
    <div id="app">
      <main>
        <img src={logo} className="logo" alt="logo" />
        <input className="hidden" ref={fileInputElem} type="file" multiple onChange={handleFilesChange} />
        <p className="tip">拖动文件到这里，或者<span className="select" onClick={handleSelectFiles}>浏览</span></p>
      </main>
    </div>
  )
}

export default App
