const socket = io()

//Elements
const $messageForm = document.querySelector('#messageForm')
const $messageInput = document.querySelector('#message')
const $messageBtn = document.querySelector('#messageBtn')
const $shareLocationBtn = document.querySelector('#shareLocation')
const $messages = document.querySelector('#messages')

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML


socket.on('message', (message) => {
    console.log(message)

    const html = Mustache.render(messageTemplate ,{
        message
    })
    $messages.insertAdjacentHTML('beforeend', html)

})

socket.on('locationMessage', (location) => {
    console.log(location)

    const html = Mustache.render(locationTemplate, {
        location
    })
    $messages.insertAdjacentHTML('beforeend', html)

})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageBtn.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {
    
        $messageBtn.removeAttribute('disabled')
        $messageInput.value = ''
        $messageInput.focus()

        if (error) {
            return console.log(error)
        }
        console.log('Message Delivered!')
    })
})


$shareLocationBtn.addEventListener('click', () => {
    
    if (!navigator.geolocation) {
        return alert('Your browser does not support sharing location.')
    }

    $shareLocationBtn.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {

        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude

        }, () => {

            $shareLocationBtn.removeAttribute('disabled')
            console.log('Location shared!')
        })
    })
})