
const socket = io('/');
const vedioGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;
var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '443'
});

let myVideoStream;
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream);
        })
    });

    socket.on('user-connected', (userId) => {
        connectToNewUsers(userId, stream);
    })
});
peer.on('open', id => {
    console.log('My ID>>>', id);
    socket.emit('join-room', ROOM_ID, id);
})





const connectToNewUsers = (userId, stream) => {
    console.log('UserId >>>', userId);
    const call = peer.call(userId, stream);
    const video  = document.createElement('video');
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    })
}

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    vedioGrid.append(video);
}

$('input').on('keyup', function(e) {
    if(e.which === 13 && this.value.length !== 0) {
        socket.emit('message', this.value);
        this.value = '';
    }
});

socket.on('createMessage', message => {
    $('ul.messages').append(`<li class="message"><b>user</b></br>${message}</li>`)
    scrollToBottom();
    console.log('message from server>>>', message);
})

const scrollToBottom = () => {
    let d = $('.main__chat_window');
    d.scrollTop(d.prop('scrollHeight'));
}

// Mute our Audio
const muteUnmute = () => {
    console.log(myVideoStream.getAudioTracks());
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if(enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    } else {
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
};

const setMuteButton = () => {
    const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
    `;
    document.querySelector('.main__mute_button').innerHTML = html;
}

const setUnmuteButton = () => {
    const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
    `;
    document.querySelector('.main__mute_button').innerHTML = html;
}

// Mute our video
const startStopVideo = () => {
    console.log(myVideoStream.getVideoTracks());
    const enabled = myVideoStream.getVideoTracks()[0].enabled;
    if(enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        setStopVideoButton();
    } else {
        setStartVideoButton();
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
};

const setStartVideoButton = () => {
    const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
    `;
    document.querySelector('.main__video_button').innerHTML = html;
}

const setStopVideoButton = () => {
    const html = `
    <i class="stop__video fas fa-video-slash"></i>
    <span>Start Video</span>
    `;
    document.querySelector('.main__video_button').innerHTML = html;
}