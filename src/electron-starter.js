const electron = require("electron");
const { exec } = require('child_process')
const fs = require('fs')
const LCUConnector = require("lcu-connector");

const {app, BrowserWindow} = electron;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

async function readLockFile() {
    return new Promise((resolve, reject) => {
        const regex = process.platform === 'win32' ? /"--install-directory=(.*?)"/ : /--install-directory=(.*?)( --|\n|$)/
        const cmd = process.platform === 'win32' ? "WMIC PROCESS WHERE name='LeagueClientUx.exe' GET CommandLine" : "ps x -o args | grep 'LeagueClientUx'"

        exec(cmd, (err, stdout) => {
            if (err) {
                return reject(err)
            }

            const path = stdout.match(regex) || []

            return fs.readFile(path[1] + '/lockfile', 'utf8', (err, data) => {
                if (err) {
                    return reject("League client not found")
                }
                const [name, pid, port, password, protocol] = data.split(':')

                resolve({
                    protocol,
                    address: '127.0.0.1',
                    port,
                    username: 'riot',
                    password
                })
            })
        })
    })
}

async function refreshClientConnection() {
    await readLockFile().then((data)=> {
        mainWindow.webContents.send("connection:established", data);
    }).catch(err => {
        console.log(err)
        mainWindow.webContents.send("connection:lost")
    });
}

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    // and load the index.html of the app.
    mainWindow.loadURL(`file://${__dirname}/../build/index.html`);
    // mainWindow.loadURL("http://localhost:3001");


    // Open the DevTools.
    mainWindow.webContents.on('did-finish-load', () => {
        // In case user already have league client opened
        // lcu-connector event doesn't fire if league client's already opened =__=
      refreshClientConnection()
    })

    // Emitted when the window is closed.
    mainWindow.on("closed", function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});

const connector = new LCUConnector();

connector.on("connect", (data) => {
    // This only fires when user opens league client after they opened this app
    mainWindow.webContents.send("connection:established", data);
});

connector.on("disconnect", ()=> {
    mainWindow.webContents.send("connection:lost")
})

connector.start();
