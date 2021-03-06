let handlefail = function (err) {
    console.log(err)
}

var audMute = false;
var vidMute = false;

var end = false;

let appId = "12ee0b37ab51440e9de81ed830ad8b7f";
let globalStream;

let client = AgoraRTC.createClient({
    mode: "live",
    codec: "h264"
})

client.init(appId, () => console.log("AgoraRTC Client Connected"), handlefail
)

function removeMyVideoStream() {
    globalStream.stop();
    document.getElementById("remote").style.backgroundColor = 'transparent';
   	document.getElementById("remote-container").style.backgroundColor = 'transparent';
}

function removeVideoStream(evt) {
    let stream = evt.stream;
    stream.stop();
    let remDiv = document.getElementById(stream.getId())
    remDiv.parentNode.removeChild(remDiv);
    remDiv.style.backgroundColor = 'transparent';
}

function addVideoStream1(streamId) {
    console.log()
    let remoteContainer = document.getElementById("remote");
    let streamDiv = document.createElement("div");
    streamDiv.id = streamId;
    streamDiv.style.height = "250px";
    streamDiv.style.backgroundColor = 'black';
    streamDiv.style.marginTop = "10px";
    remoteContainer.appendChild(streamDiv)
}

document.getElementById("join").onclick = function () {
    let channelName = document.getElementById("channelName").value;
    let Username = document.getElementById("username").value;

    client.join(
        null,
        channelName,
        Username,
        () => {
            var localStream = AgoraRTC.createStream({
                video: true,
                audio: true,
            })

            localStream.init(function () {
                localStream.play("self")
                console.log(`App id: ${appId}\nChannel id: ${channelName}`)
                client.publish(localStream)
            })

            globalStream = localStream
        }
    )

    client.on("stream-added", function (evt) {
        console.log("Added Stream");
        client.subscribe(evt.stream, handlefail)
    })

    client.on("stream-subscribed", function (evt) {
        console.log("Subscribed Stream");
        let stream = evt.stream;
        addVideoStream1(stream.getId());
        stream.play(stream.getId());
    })

    client.on("peer-leave", function (evt) {
        console.log("Peer has left")
        removeVideoStream(evt)
    }
    )
}

document.getElementById("end").onclick = function (){
    client.leave(function() {
        console.log("Left!")
    },handlefail)
    removeMyVideoStream();

    document.getElementById("remote").style.backgroundColor = 'transparent';
   	document.getElementById("remote-container").style.backgroundColor = 'transparent';

    if(vidMute){
    	vidMute = false;
		document.getElementById("video-Mute").style.backgroundColor = 'white';
    }

    if (audMute) {
    	audMute = false;
		document.getElementById("audio-Mute").style.backgroundColor = 'white';
    }

}

document.getElementById("videoMute").onclick = function (){
	if(!vidMute){
		globalStream.muteVideo();
		vidMute = true;
		document.getElementById("video-Mute").style.backgroundColor = 'red';
	}
	else{
		globalStream.unmuteVideo();
		vidMute = false;
		document.getElementById("video-Mute").style.backgroundColor = 'white';
	}
}

document.getElementById("audioMute").onclick = function (){
	if(!audMute){
		globalStream.muteAudio();
		audMute = true;
		document.getElementById("audio-Mute").style.backgroundColor = 'red';
	}
	else{
		globalStream.unmuteAudio();
		audMute = false;
		document.getElementById("audio-Mute").style.backgroundColor = 'white';
	}
}