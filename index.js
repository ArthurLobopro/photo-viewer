const { ipcRenderer } = require('electron')

const get = id => document.getElementById(id)

const photoInput = get('photo-input')
const imageView = get('image-view')

const images = []

let imagemAtual 

let interval

const attImage = (index) => {
    imagemAtual = images[index] ?? ""
    imageView.src = imagemAtual
    imageView.style.zoom = ""
}

const buttons = {
    add: get('add'),
    remove: get('remove'),
    previous: get('previous'),
    next: get('next'),
    zoomIn: get('zoom-in'),
    zoomOut: get('zoom-out'),
    play: get('play'),
    pause: get('pause')
}

const buttonsFunctions = {
    add: async () => {
        const files = await ipcRenderer.invoke('add-files','teste').then( res => res)
        attList(files)
    },
    remove(){
        const src = imageView.src
        const index = images.indexOf(src)
        images.splice(index,1)
        attImage( index === -1 ? 0 : index )
        // imageView.src = index === -1 ? "" : images[ index === 0 ? 0 : index  - 1  ] 
        // imageView.src = images.length === 0 ? "" : imageView.src
    },
    previous(){
        const index = images.indexOf(imagemAtual) - 1
        attImage( index === -1 ? images.length - 1 : index)
    },
    next(){
        const index = images.indexOf(imagemAtual) + 1
        attImage( index === images.length ? 0 : index)
    },
    zoomIn(){
        let zoom = String(imageView.style.zoom).replace('%','') || 100
        imageView.style.zoom = `${Number(zoom) + 10}%`
    },
    zoomOut(){
        let zoom = String(imageView.style.zoom).replace('%','') || 100
        imageView.style.zoom = `${Number(zoom) - 10}%`
    },
    play(){
        interval = setInterval(() => buttonsFunctions.next(), 2000);
        buttons.play.style.display = 'none'
        buttons.pause.style.display = ''
    },
    pause(){
        clearInterval(interval)
        buttons.play.style.display = ''
        buttons.pause.style.display = 'none'
    }
}

function attList(files) {

    files.forEach( file => {
            
            if(images.indexOf(file) === -1){
                images.push(file)
            }

            if(images.length === 1){
               attImage(0)
            }

    })
}

const addFunctions = () => {
    const btn_array = Object.entries(buttons)

    btn_array.forEach( ([name,button]) => {
        button.onclick = buttonsFunctions[name]
    })
} 



photoInput.oninput = attList

module.exports = addFunctions()