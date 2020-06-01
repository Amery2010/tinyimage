import path from 'path'
import { app, BrowserWindow, ipcMain, nativeImage } from 'electron'
import { menubar } from 'menubar'
import minify from './libs/minify'

function createWindow () {
  // 创建浏览器窗口
  // const mainWindow = new BrowserWindow({
  //   width: 1024,
  //   height: 768,
  //   webPreferences: {
  //     webSecurity: false,
  //     contextIsolation: true,
  //     nodeIntegration: true,
  //     preload: path.join(__dirname, 'preload.js'),
  //   },
  // })

  // mainWindow.loadFile('../static/menubar.html')

  const menuBar = menubar({
    index: `file://${path.join(__dirname, '../static/menubar.html')}`,
    browserWindow: {
      title: 'TinyImage',
      width: 475,
      height: 400,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js'),
      },
    }
  })
  menuBar.on('ready', () => {
    console.log('app is ready');
    // your app code here
  })

  // 打开开发者工具
  // mainWindow.webContents.openDevTools()
}

ipcMain.on('ondragstart', (ev, filePath) => {
  ev.sender.startDrag({
    file: filePath,
    icon: nativeImage.createFromPath(path.join(__dirname, '../static/icons/logo@2x.png')),
  })

  minify(filePath)
})

ipcMain.on('postMessage', async (event, message) => {
  switch (message.bridgeName) {
    case 'minify':
      try {
        const result = await minify(message.data)
        const data = result.map(item => {
          return {
            srcPath: item.sourcePath,
            destPath: item.destinationPath,
            length: item.data.length,
          }
        })
        event.reply('receiveMessage', {
          bridgeName: 'minify',
          cid: message.cid,
          data,
        },)
      } catch (err) {
        event.reply('receiveMessage', {
          bridgeName: 'minify',
          error: { code: 500, message: err.message },
        })
      }
      break
    default:
      break
  }
})

// Electron会在初始化完成并且准备好创建浏览器窗口时调用这个方法
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', createWindow)

// 当所有窗口都被关闭后退出
app.on('window-all-closed', function () {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
