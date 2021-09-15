// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const ipc = ipcMain
const fs = require('fs');
const { event } = require('jquery');
const { eventNames } = require('process');
const discordRPC = require("discord-rich-presence")("867967229042524291");


function createWindow () {
  // Create the browser window.
  const loginWindow = new BrowserWindow({
    width: 360,
    height: 450,
    transparent: true,
    frame: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the login.html of the app.
     loginWindow.loadFile('login.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
    ipc.on('quitApp', ()=>{
      loginWindow.close()
    })

    ipcMain.on('main-window', ()=>{
      // loginWindow.close()
    })

    
    ipcMain.on('close-login-window', ()=>{
      loginWindow.close()
    })
    
    // ipc.on('maximizeApp', ()=>{
    //   mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
    // })

    ipc.on('minimizeApp', ()=>{
      loginWindow.minimize()
    })
  }

ipcMain.on('main-window', ()=>{
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1150,
    height: 650,
    transparent: true,
    frame: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })
  
  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
  //mainWindow.webContents.openDevTools()
  // ipc.on('maximizeApp', ()=>{
  //   mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
  // })

  ipc.on('quitMainApp', ()=>{
    mainWindow.close()
  })

  ipc.on('minimizeMainApp', ()=>{
    mainWindow.minimize()
  })
  function jsonReader(fp){
    let r = fs.readFileSync("./"+fp)
    return JSON.parse(r);
  }
 
  
  ipc.on("delete-profile", (event,profile_name) => {
    // Fixed :)
    let data = jsonReader("profiles.json")
    delete data[profile_name];
    mainWindow.webContents.send("profiles-count", Object.keys(data).length)
    fs.writeFileSync("./profiles.json", JSON.stringify(data, null, 4));
  })

  ipc.on("load-profiles", (event) => {
  
    let data = jsonReader("profiles.json")
    for (let i of Object.keys(data)){
      event.reply("profile-load", i, data[i].catchall, data[i].profile_color) 

    }
    mainWindow.webContents.send("profiles-count", Object.keys(data).length)
    
  
  })
  ipc.on("load-proxies", (event) => {
    let data = jsonReader("proxies.json")
    for(let i of Object.keys(data)){
      let proxyName = i;
      let proxyColor = data[i].color;
      event.reply("proxy-load", proxyName, proxyColor)
    }
    mainWindow.webContents.send("proxies-count", Object.keys(data).length)
  })
  ipc.on("save-proxies", (event, proxyList, proxyName, proxyColor) =>{
    let data = jsonReader("proxies.json")
    data[proxyName] = {"color": proxyColor,
                        "proxylist":proxyList}
    fs.writeFileSync("./proxies.json", JSON.stringify(data, null, 4));
  })
  ipc.on("delete-proxy", (event, proxyName) => {
    let data = jsonReader("proxies.json")
    delete data[proxyName]
    fs.writeFileSync("./proxies.json", JSON.stringify(data, null, 4))
    mainWindow.webContents.send("proxies-count", Object.keys(data).length)
  })
  

  ipc.on('add-profile', (event, profilenameIN, catchallIN, profilecolorIN, addressinputIN, aptIN, cityIN, zipIN, profilestateIN, profilecountryIN)=>{
    let profile_name = "" + profilenameIN + "";
    const newprofile =  {
      profile_color: "" + profilecolorIN + "",
      catchall: "" + catchallIN + "",
      address: "" + addressinputIN + "",
      apt_suite: "" + aptIN + "",
      country: "" + profilecountryIN + "",
      city: "" + cityIN + "",
      state: "" + profilestateIN + "",
      zip: "" + zipIN + "",
    }
  
    let data = jsonReader("profiles.json");
    data[profile_name] = newprofile;
    //data.push(newprofile);
    fs.writeFileSync("./profiles.json", JSON.stringify(data, null, 4));
  })
  

  
});

ipcMain.on('loading-window', ()=>{
  // Create the browser window.
  const loadWindow = new BrowserWindow({
    width: 360,
    height: 450,
    transparent: true,
    frame: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  loadWindow.loadFile('loading.html')

  ipc.on('quitLoad', ()=>{
    loadWindow.close()
  })


});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  discordRPC.updatePresence({
    state: 'Genning accounts',
    details: '🚀',
    startTimestamp: new Date(),
    largeImageKey: 'mainimg',
    smallImageKey: 'snek_small',
    instance: true,
  });
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.













