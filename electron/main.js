const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')

require('./header/header-actions-main')

function mainWindow() {
    const win = new BrowserWindow({
        icon: path.join(__dirname,"../assets/icon.png"),
        frame: false,
        webPreferences:{
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile('index.html')
}

app.whenReady().then(mainWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        mainWindow()
    }
})

ipcMain.on('request-arg', (event) => {
    const args = process.argv
    console.log(args);
    const files = []
    args.forEach( arg => {
        const isPath = path.isAbsolute(arg)
        const isImage = [
            '.jpg', '.png', '.gif','.webp','.svg','.jpeg'
        ].some( fmt => arg.indexOf(fmt) === (arg.length) - fmt.length )
        if(isPath && isImage){
            files.push(arg)
        }
    })
    event.returnValue = files
})

ipcMain.handle('add-files', async (event, arg) => {
    return dialog.showOpenDialog({ 
        properties: ['openFile', 'multiSelections'],
        filters: [{ name: 'Imagens', extensions: ['jpg', 'png', 'gif','webp','svg','jpeg']}]
    })
    .then( res => {
        return res.canceled === true ? [] : res.filePaths
    })
})

// Faz com que o programa não inicie várias vezes durante a instalação
if (require('electron-squirrel-startup')){
    return app.quit();
}