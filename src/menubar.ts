import { ipcRenderer } from 'electron'

const $select = document.getElementById('select')
if ($select) {
  $select.addEventListener('change', ev => {
    const target = ev.target as HTMLInputElement
    if (target.files) {
      const fileList = Object.values(target.files).map(file => file.path)
      ipcRenderer.send('postMessage', {
        bridgeName: 'minify',
        data: fileList,
      })
    } else {
      console.warn('文件列表获取异常')
    }
  }, false)
}

ipcRenderer.addListener('recevieMessage', () => {
  console.log('压缩成功')
})
