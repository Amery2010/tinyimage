import path from 'path'
import { app, BrowserWindow, ipcMain, dialog } from 'electron'
// import { menubar } from 'menubar'
import minify from './libs/minify'
import getFilePaths from './libs/getFilePaths'
import { createMenu } from './core/menu'

function createWindow () {
  // 创建浏览器窗口
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 400,
    webPreferences: {
      webSecurity: true,
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  mainWindow.loadFile(path.join(__dirname, '../index.html'))

  // const menuBar = menubar({
  //   index: `file://${path.join(__dirname, '../index.html')}`,
  //   browserWindow: {
  //     title: 'TinyImage',
  //     width: 475,
  //     height: 400,
  //     webPreferences: {
  //       nodeIntegration: true,
  //       contextIsolation: true,
  //       preload: path.join(__dirname, 'preload.js'),
  //     },
  //   }
  // })
  // menuBar.on('ready', () => {
  //   console.log('app is ready');
  //   // your app code here
  // })

  // 打开开发者工具
  // mainWindow.webContents.openDevTools()
  createMenu(mainWindow)
}

ipcMain.on('postMessage', (event, message) => {
  switch (message.bridgeName) {
    case 'minify':
      minify(message.data).then(result => {
        if (result.status) {
          if (result.data) {
            const data = result.data.map(item => {
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
            })
          } else {
            event.reply('receiveMessage', {
              bridgeName: 'minify',
              cid: message.cid,
              error: {
                code: 501,
                message: '压缩失败！'
              },
            })
          }
        } else {
          event.reply('receiveMessage', {
            bridgeName: 'minify',
            cid: message.cid,
            error: {
              code: 500,
              message: result.error
            },
          })
        }
      }).catch(err => {
        event.reply('receiveMessage', {
          bridgeName: 'minify',
          cid: message.cid,
          error: {
            code: 500,
            message: err.message
          },
        })
      })
      break
    case 'selectFiles':
      const imageExt = ['jpg', 'jpeg', 'png', 'gif', 'svg']
      dialog.showOpenDialog({
        filters: [
          { name: '图片文件', extensions: imageExt },
        ],
        properties: [
          'openFile',
          'openDirectory',
          'multiSelections',
          'treatPackageAsDirectory',
        ]
      }).then(result => {
        if (result.canceled) {
          event.reply('receiveMessage', {
            bridgeName: 'selectFiles',
            cid: message.cid,
            data: [],
          })
        } else {
          getFilePaths(result.filePaths, imageExt).then(result => {
            event.reply('receiveMessage', {
              bridgeName: 'selectFiles',
              cid: message.cid,
              data: result,
            })
          })
        }
      }).catch(err => {
        event.reply('receiveMessage', {
          bridgeName: 'selectFiles',
          cid: message.cid,
          error: {
            code: 500,
            message: err.message
          },
        })
      })
      break
    case 'getVersion':
      event.reply('receiveMessage', {
        bridgeName: 'version',
        cid: message.cid,
        data: app.getVersion(),
      })
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
