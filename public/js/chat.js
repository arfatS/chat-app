const socket = io()

socket.on('welcomeUser', (welcome) => {
    console.log(welcome)
})

socket.on('sendMessage', (message) => {
    console.log(message)
})

const messageForm = document.querySelector('#messageForm')

messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const message = e.target.elements.message.value
    socket.emit('sendMessage', message)
})