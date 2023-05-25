const messages = []


const addMessage = (id, content) => {
    const exist = messages.find(m => m.id === id)
    if (exist) {
        exist.content.push(content)
    }
    messages.push({
        id, content: [content]
    })
}


const getMessage = (id) => messages.find(m => m.id === id)


module.exports = { addMessage, getMessage }