// import { ipcRenderer } from 'electron'

const $select = document.getElementById('select')
if ($select) {
  $select.addEventListener('change', ev => {
    const target = ev.target as HTMLInputElement
    if (target.files) {
      const fileList = Object.values(target.files).map(file => file.path)
      window.nativeBridge.invoke('minify', fileList, () => {
        alert('压缩成功！')
      })
    } else {
      console.warn('文件列表获取异常')
    }
  }, false)
}
