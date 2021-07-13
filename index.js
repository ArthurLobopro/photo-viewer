const get = id => document.getElementById(id)

const imageView = get('image-view')

function getArgFiles() {
    return ipcRenderer.sendSync('request-arg')
}

const images = []

let imagemAtual 

let interval

const attImage = (index) => {
    imagemAtual = images[index] ?? ""
    imageView.src = imagemAtual
    imageView.style.zoom = ""
}

const getAtualRotate = () => {
    let atualRotateString = imageView.style.transform ?? "(0deg)"
    const start = atualRotateString.indexOf('(') + 1
    const end = atualRotateString.indexOf(')')
    // console.log(atualRotateString.substring(start, end));
    const atualRotate = Number( atualRotateString.substring(start, end).replace('deg','') )
    return atualRotate ?? 0
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
    async add(){
        const files = await ipcRenderer.invoke('add-files')
        attList(files)
    },
    remove(){
        const src = imageView.src
        const index = images.indexOf(src)
        images.splice(index,1)
        attImage( index === -1 ? 0 : index )
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

const keyboardFunctions = {
    ArrowRight: buttonsFunctions.next,
    ArrowLeft: buttonsFunctions.previous,
    "+": buttonsFunctions.add,
    "-": buttonsFunctions.remove,
    "ctrl+": buttonsFunctions.zoomIn,
    "ctrl-": buttonsFunctions.zoomOut,
    " ": () => {
        const playIsVisible = buttons.play.style.display === ''

        return playIsVisible ? buttonsFunctions.play() : buttonsFunctions.pause()
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

window.onload = () => {
    addFunctions()
    const files = getArgFiles()
    if(files.length > 0){
        files.forEach( img => images.push(img))
        attImage(0)
    }
}

window.onkeydown = event => {
    const key = `${event.ctrlKey ? 'ctrl' : ''}${event.shiftKey ? "shift" : ''}${event.key}`
    keyboardFunctions[key]?.()
}