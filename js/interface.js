var audio_context;
var recorder;

function startUserMedia(stream) {
	var input = audio_context.createMediaStreamSource(stream);
	console.log('Media stream created.');

	recorder = new Recorder(input);
	console.log('Recorder initialised.');
}

function startRecording(button) {
    recorder && recorder.record();
    button.disabled = true;
    button.nextElementSibling.disabled = false;
    console.log('Recording...');
}

function stopRecording(button) {
    recorder && recorder.stop();
    button.disabled = true;
    button.previousElementSibling.disabled = false;
    console.log('Stopped recording.');
    
    // send audio data to server
    uploadBlob();
    
    chrome://flags.clear();
 }

function uploadBlob() {
	recorder && recorder.exportWAV(function(blob) {
		var formData = new FormData();
		formData.append("audio", blob);
		$.ajax({
		    type: 'POST',
		    url: 'php/upload.php',
		    data: formData,
		    processData: false,
		    contentType: false
		}).done(function() {
		       console.log("Succesfully uploaded.");
		});
	});
}

window.onload = function init() {
	try {
		// webkit shim
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
		window.URL = window.URL || window.webkitURL;

		audio_context = new AudioContext;
		console.log('Audio context set up.');
		console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
	} catch (e) {
		alert('No web audio support in this browser!');
	}

	navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
	console.log('No live audio input: ' + e);

	});
};