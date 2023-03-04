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

}

document.querySelector('#start').addEventListener('click', function(e) {
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    })
    .then(function(stream) {
         p = new SimplePeer({
            initiator: true,
            stream: stream,
            trickle: false
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
})

document.querySelector('#incoming').addEventListener('submit', function (e) {
    e.preventDefault()
    if (p == null) {
            p = new SimplePeer ({
            initiator: false,
            trickle: false
        })
        bindEvents(p)
    }   
    p.signal(JSON.parse(e.target.querySelector('textarea').value))
})