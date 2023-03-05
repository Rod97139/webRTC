let p = null

function bindEvents(p) {

    p.on('error', function(err) {
        console.log('error', err);
    })
    p.on('signal', function(data) {
        document.querySelector('#offer').textContent = JSON.stringify(data)
    })
    p.on('stream', function (stream) {
        let video = document.querySelector('#receiver-video')
        video.srcObject = stream
        console.log(video.srcObject);
        video.play()
    })

    
    // document.querySelector('#incoming').addEventListener('submit', function (e) {
    //     e.preventDefault()
    //     p.signal(JSON.parse(e.target.querySelector('textarea').value))
    // })

}

function startPeer (initiator) {
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    })
    .then(function(stream) {
         p = new SimplePeer({
            initiator: initiator,
            stream: stream,
            trickle: false,
            config: {
                iceServers: [
                  { urls: 'stun:stun.l.google.com:19302' },
                  { urls: 'turn:turn.google.com:19305?transport=udp', username: 'your_username', credential: 'your_password' },
                  { urls: 'turn:turn.google.com:19305?transport=tcp', username: 'your_username', credential: 'your_password' }
                ]
              }
            //,config {serveur stun et turn}
        })
        bindEvents(p)
        let emitterVideo = document.querySelector('#emitter-video')
        
        // debugger
        emitterVideo.srcObject = stream
        console.log(emitterVideo.srcObject);
        emitterVideo.play()
    })
    .catch(function(error) {
        console.log("Erreur lors de l'accès aux périphériques multimédias: " + error.message);
    })  
}

document.querySelector('#start').addEventListener('click', function(e) {
    startPeer(true)
})
document.querySelector('#receive').addEventListener('click', function(e) {
    startPeer(false)
})

document.querySelector('#incoming').addEventListener('submit', function (e) {
    e.preventDefault()
    if (p == null) {
            p = new SimplePeer ({
            initiator: false,
            trickle: false
        })
    }   
    bindEvents(p)
    p.signal(JSON.parse(e.target.querySelector('textarea').value))
})