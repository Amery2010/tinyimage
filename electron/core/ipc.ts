import { app, ipcMain, dialog } from 'electron'
import minify from '../libs/minify'
import getFileListInfor from '../utils/getFileListInfor'

ipcMain.on('postMessage', (event, message) => {
  switch (message.bridgeName) {
    case 'minify':
      minify(message.data).then(result => {
        if (result.status) {
          if (result.data) {
            const item = result.data[0]
            event.reply('receiveMessage', {
              bridgeName: 'minify',
              cid: message.cid,
              data: {
                srcPath: item.sourcePath,
                destPath: item.destinationPath,
                path: item.sourcePath,
                size: item.data.length,
              },
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
          getFileListInfor(result.filePaths, imageExt).then(result => {
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
