const get = id => document.getElementById(id)

const photoInput = get('photo-input')
const imageView = get('image-view')

const images = []

let imagemAtual 

const attImage = (index) => {
    imagemAtual = images[index]
    imageView.src = imagemAtual ?? ""
}

const buttons = {
    add: get('add'),
    remove: get('remove'),
    previous: get('previous'),
    next: get('next'),
    zoomIn: get('zoom-in')
}

const buttonsFunctions = {
    add: () => photoInput.click(),
    remove(){
        const src = imageView.src
        const index = images.indexOf(src)
        console.log(images);
        images.splice(index,1)
        console.log(images);
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
    }
}

function attList() {
    const files = Array.from(photoInput.files)

    files.forEach( file => {
        const reader = new FileReader()
        reader.readAsDataURL(file)

        reader.onload = event => {
            const img = event.target.result
            
            if(images.indexOf(img) === -1){
                images.push(img)
            }

            if(images.length === 1){
               attImage(0)
            }

        }

    })
}

const addFunctions = () => {
    const btn_array = Object.entries(buttons)

    btn_array.forEach( ([name,button]) => {
        button.onclick = buttonsFunctions[name]
    })
} 

addFunctions()

photoInput.oninput = attList