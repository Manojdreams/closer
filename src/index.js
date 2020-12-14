const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
let minWindow = false;
var moment = require('moment');
const axios = require('axios');
const { autoUpdater } = require('electron-updater');
var localData;
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let myWindow = null

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (myWindow) {
      if (myWindow.isMinimized()) myWindow.restore()
      myWindow.focus()
    }
  })

app.commandLine.appendSwitch('disable-renderer-backgrounding')


const createWindow = () => {
  // Create the browser window

  // var exec = require('child_process').execFile;
  //   console.log("fun() start");
  //   exec('active_window.exe', function (err, data) {
  //     console.log(err)
  //     console.log(data.toString());
  //   });

  // var python = require('child_process').spawn('python', ['./active_window.py']);
  // console.log(python);
  // python.stdout.on('data', function (data) {
  //   console.log("data: ", data.toString('utf8'));bhjcs
  // });
  
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 717,
    webPreferences: {
      nodeIntegration: true,
      devTools: false
    },
    // maxWidth: 1024,
    // maxHeight: 717,
    minWidth: 1024,
    minHeight: 717,
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  // localStorage.setItem('minWindow', false);
  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
  const template = [
    {
      label: 'File',
      submenu: [
        {
          role: 'minimize'
        },
        {
          role: 'close'
        }
      ]
    },
  ]
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
  mainWindow.on('minimize',function(event){
});
  mainWindow.on('close', function () { //   <---- Catch close event
 
    mainWindow.webContents
      .executeJavaScript('({...localStorage});', true)
      .then(localStorage => {
       localData = localStorage;
        // console.log(localData);
        if (localData.task_run === 'true') {
          var punchOutTime = moment().utc().format('Y-MM-DD HH:mm:ss');

          var header = {
            'Authorization': 'Bearer ' + localData.token
          }
          var data = {
            work_log_type: 'Computer',
            task_id: localData.task_id,
            punch_in: '',
            punch_out: punchOutTime
          };
          axios.post('https://www.the-close.work/api/user/logs', data, { headers: header })
            .then(res => {
              console.log(res);
              app.quit();
            })
        }
        else{
          app.quit();
        }
      });
   
    // The dialog box below will open, instead of your app closing.
    // console.log(localData);
    
});
  mainWindow.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify();
  });

};





// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
}

autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update_available');
});
autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update_downloaded');
});

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
