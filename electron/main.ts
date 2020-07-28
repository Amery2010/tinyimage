import path from 'path'
import { app, BrowserWindow, Menu, Tray } from 'electron'
import { createMenu } from './core/menu'
import './core/ipc'

let mainWindow: Electron.BrowserWindow
let tray: Electron.Tray
let trayQuit = false
const contextMenu = Menu.buildFromTemplate([
  {
    label: '打开',
    click: () => {
      mainWindow.show()
    }
  },
  { role: 'about', label: '关于' },
  {
    label: '退出',
    click: () => {
      trayQuit = true
      app.quit()
    }
  },
])

function createWindow () {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 400,
    height: 400,
    webPreferences: {
      webSecurity: true,
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  tray = new Tray(path.join(__dirname, '../tray@2x.png'))
  
  tray.setToolTip('TinyImage')
  tray.setContextMenu(contextMenu)

  mainWindow.loadFile(path.join(__dirname, '../index.html'))

  mainWindow.on('close', (ev: Electron.Event) => {
    if (mainWindow.isVisible() && !trayQuit) {
      mainWindow.hide()
      ev.preventDefault()
    }
  })

  createMenu(mainWindow)
}



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

// app.on('activate', function () {
//   // 在macOS上，当单击dock图标并且没有其他窗口打开时，
//   // 通常在应用程序中重新创建一个窗口。
//   if (BrowserWindow.getAllWindows().length === 0) {
//     createWindow()
//   }
// })
