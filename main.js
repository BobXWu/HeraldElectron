const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const ipc = electron.ipcMain;
const Menu = electron.Menu;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let loginWindow; //登录窗口
let mainWindow;  //主窗口
let pageWindow;   //浏览其他web页面的窗口

global.sharedObject = {
  "huodong_url": ""
};

function createLoginWindow(){
  loginWindow = new BrowserWindow({width: 300, height: 450, show: false, frame: false})
  loginWindow.loadURL(`file://${__dirname}/html/login.html`)
  loginWindow.webContents.openDevTools()
 
  var template = []

  var menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu);

  loginWindow.on('closed', function(){
    loginWindow = null;
  })

  loginWindow.once('ready-to-show', function(){
    loginWindow.show();
  })
}

function createMainWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600, frame: false, show:true})

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/html/index.html`)

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  mainWindow.once('ready-to-show', function(){
    mainWindow.webContents.send('stopLoadingGif')
  })

}

function createPageWindow(){
  pageWindow = new BrowserWindow({width: 800, height: 600, parent: mainWindow, modal: true, show: true, frame: true})

  var url = global.sharedObject.huodong_url
  pageWindow.loadURL( url )
  mainWindow.webContents.openDevTools()

  pageWindow.on('closed', function(){
    pageWindow = null
  })

  pageWindow.once('ready-to-show', function(){
    pageWindow.webContents.send('stopLoadingGif')//通知web页面关闭加载动画
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createLoginWindow)
// app.on('ready', createLoginWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createMainWindow()
  }
})

//关闭登录窗口并打开主窗口
ipc.on('createMainWindow', function(){
  loginWindow.close()
  createMainWindow()
})

//打开新web浏览页面
ipc.on('createPageWindow', function(){
  createPageWindow()
})

ipc.on('closeLoginWindow', function(){
  loginWindow.close()
})

//关闭web浏览页面
ipc.on('closePageWindow', function(){
   pageWindow.close()
})

//关闭主窗口
ipc.on('closeMainWindow', function(){
  mainWindow.close()
})

//回到主窗口
ipc.on('backToLoginWindow', function(){
  mainWindow.close();
  createLoginWindow();
})

