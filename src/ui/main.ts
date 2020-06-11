const $select = document.getElementById('select')
if ($select !== null) {
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
  const $selectFiles = document.querySelector('.select-files')
  if ($selectFiles !== null) {
    $selectFiles.addEventListener('click', (ev) => {
      ev.preventDefault()
      console.log(123)
    }, false)
  }
}


