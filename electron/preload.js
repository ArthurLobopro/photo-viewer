const { contextBridge, ipcRenderer } = require('electron')

window.addEventListener('DOMContentLoaded', () => {
    require('./header/header-actions-renderer')
    contextBridge.exposeInMainWorld('ipcRenderer', ipcRenderer)
})