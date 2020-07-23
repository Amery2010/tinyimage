import { Menu, shell } from 'electron'

const isMac = process.platform === 'darwin'
const appName = 'TinyImage'

export function createMenu(mainWindow: Electron.BrowserWindow) {
  const MacTemplate: Electron.MenuItemConstructorOptions[] = [
    {
      label: appName,
      submenu: [
        { role: 'about', label: `关于 ${appName}` },
        { type: 'separator' },
        {
          type: 'normal',
          label: '设置',
          click: () => {
            mainWindow.webContents.send('invoke', {
              eventName: 'openSetting',
              data: '打开设置'
            })
          }
        },
        { type: 'separator' },
        { role: 'services', label: '服务' },
        { type: 'separator' },
        { role: 'hide', label: `隐藏 ${appName}` },
        { role: 'hideOthers', label: '隐藏其他' },
        { role: 'unhide', label: '显示全部' },
        { type: 'separator' },
        { role: 'quit', label: `退出 ${appName}` }
      ]
    },
    {
      label: '查看',
      submenu: [
        { role: 'reload', label: '刷新' },
        { role: 'forceReload', label: '强制刷新' },
        { role: 'toggleDevTools', label: '切换开发者工具' },
        { type: 'separator' },
        { role: 'resetZoom', label: '重置缩放' },
        { role: 'zoomIn', label: '放大' },
        { role: 'zoomOut', label: '缩小' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: '切换全屏' }
      ]
    },
    {
      label: '窗口',
      submenu: [
        { role: 'minimize', label: '最小化' },
        { role: 'zoom', label: '缩放' },
        { type: 'separator' },
        { role: 'front', label: '全部置于顶层' },
        { type: 'separator' },
        { role: 'window', label: '切换窗口' }
      ]
    },
    {
      label: '帮助',
      submenu: [
        {
          type: 'normal',
          label: '了解更多',
          click: async () => {
            await shell.openExternal('https://xiangfa.org')
          }
        }
      ]
    }
  ]

  const defaultTemplate: Electron.MenuItemConstructorOptions[] = [
    {
      role: 'viewMenu',
      label: '查看',
      submenu: [
        { role: 'reload', label: '重启' },
        { role: 'forceReload', label: '强制重启' },
        { role: 'toggleDevTools', label: '打开或关闭调试者工具' },
        { type: 'separator' },
        { role: 'resetZoom', label: '重置缩放' },
        { role: 'zoomIn', label: '放大' },
        { role: 'zoomOut', label: '缩小' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: '打开或关闭全屏' }
      ]
    },
    {
      role: 'windowMenu',
      label: 'Window',
      submenu: [
        { role: 'minimize', label: '最小化' },
        { role: 'zoom', label: '缩放' },
        { role: 'close', label: '关闭' }
      ]
    },
    {
      role: 'help',
      label: '帮助',
      submenu: [
        {
          label: '了解更多',
          click: async () => {
            await shell.openExternal('https://xiangfa.org')
          }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(isMac ? MacTemplate : defaultTemplate)
  Menu.setApplicationMenu(menu)
}
