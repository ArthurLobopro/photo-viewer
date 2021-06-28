const get = id => document.getElementById(id)

const photoInput = get('photo-input')
const imageView = get('image-view')

const atualImages = []

const buttons = {
    add: get('add'),
    remove: get('remove')
}

const buttonsFunctions = {
    add: () => photoInput.click(),
    remove: () => {
        const src = imageView.src
        const index = atualImages.indexOf(src)
        atualImages.splice(index,1)
        console.table({index})
        imageView.src = index === -1 ? "" : atualImages[ index === 0 ? 0 : index  - 1  ] 
        imageView.src = atualImages.length === 0 ? "" : imageView.src
    }
}

