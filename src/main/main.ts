/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import fetch from 'node-fetch';
import fs, { WriteStream } from "fs"
import FormData from 'form-data'
const AudioRecorder = require('node-audiorecorder')

// Options is an optional parameter for the constructor call.
// If an option is not given the default value, as seen below, will be used.
const options = {
  program: `rec`, // Which program to use, either `arecord`, `rec`, or `sox`.
  device: null, // Recording device to use, e.g. `hw:1,0`

  bits: 16, // Sample size. (only for `rec` and `sox`)
  channels: 1, // Channel count.
  encoding: `signed-integer`, // Encoding type. (only for `rec` and `sox`)
  format: `S16_LE`, // Encoding type. (only for `arecord`)
  rate: 16000, // Sample rate.
  type: `wav`, // Format type.

  // Following options only available when using `rec` or `sox`.
  silence: 2, // Duration of silence in seconds before it stops recording.
  thresholdStart: 0.5, // Silence threshold to start recording.
  thresholdStop: 0.5, // Silence threshold to stop recording.
  keepSilence: true, // Keep the silence in the recording.
}
// Optional parameter intended for debugging.
// The object has to implement a log and warn function.
const logger = console
const DIRECTORY = "/tmp/"





class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      webSecurity: false,
      sandbox: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);




// Create an instance.
let audioRecorder = new AudioRecorder(options, logger)
// Log information on the following events.
audioRecorder.on('error', function () {
    console.warn('Recording error.');
  });
  audioRecorder.on('end', function () {
    console.warn('Recording ended.');
  });
  
  // Create file path with random name.
  const fileName = path.join(
    DIRECTORY,
    Math.random()
      .toString(36)
      .replace(/[^0-9a-zA-Z]+/g, '')
      .concat('.wav')
  );
  let fileStream:WriteStream|null = null;

function startAudioRecord(){
    // Start and write to the file.
    fileStream = fs.createWriteStream(fileName, { encoding: 'binary' });
    audioRecorder.start().stream().pipe(fileStream);
    console.log("fileStream:",fileStream);
}
function stopAudioRecord():fs.PathLike{
    if (fileStream===null){
        console.warn ("audio record not started");
        throw Error();
    }else{
        audioRecorder.stop()
        fileStream?.close()
        return fileStream.path
    }
    
}
export async function sendVoiceRecogRequest(path:fs.PathLike):Promise<String>{
    let file = fs.createReadStream(path)
    let formData = new FormData();
    let params = {
        language:"ko-KR",
        completion:'sync'
    }
    formData.append("params",JSON.stringify(params))
    console.log("file:",file)
    formData.append("media",file,"test.wav")
    let response = await fetch(`#{CLOVA_URL}`,{
        method:"POST",
        headers:{
            'X-CLOVASPEECH-API-KEY':'#{API_KEY}'
        },
        body:formData
    })
    let result = await response.json();
    console.log("result:",result.text)
    //음성인식 요청 
    return result.text;
   
}
ipcMain.on("startAudioRecord",()=>{
    console.log("starting audio record")
    startAudioRecord();
    console.log("audio record start")
})

ipcMain.on("stopAudioRecord",async ()=>{
    let filePath = stopAudioRecord();
    let result = await sendVoiceRecogRequest(filePath)
    if (mainWindow!==null){
    mainWindow.webContents.send("audioRecordResponse",result)
  }

})