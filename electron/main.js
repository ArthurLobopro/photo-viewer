const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')

function mainWindow() {
    const win = new BrowserWindow({
        //icon: path.join(__dirname,"../assets/icon32.png"),
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
// if (require('electron-squirrel-startup')){
//     return app.quit();
// }