const video = document.getElementById('video');

Promise.all([
	// To load all the models
	faceapi.nets.tinyFaceDetector.loadFromUri('/face-expression-detector/models'), //remove "/face-expression-detector" when working locally
	faceapi.nets.faceLandmark68Net.loadFromUri('/face-expression-detector/models'), //remove "/face-expression-detector" when working locally
	faceapi.nets.faceRecognitionNet.loadFromUri('/face-expression-detector/models'), //remove "/face-expression-detector" when working locally
	faceapi.nets.faceExpressionNet.loadFromUri('/face-expression-detector/models') //remove "/face-expression-detector" when working locally
]).then(startVideo)

function startVideo() {
	navigator.getUserMedia(
		{ video: {} },
		stream => video.srcObject = stream,
		err => console.error(err)
	)
}

video.addEventListener('play', () => {
	const canvas = faceapi.createCanvasFromMedia(video)
	document.body.append(canvas)
	const displaySize = { width: video.width, height: video.height }
	faceapi.matchDimensions(canvas, displaySize)
	setInterval( async () => {
		const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
		const resizedDetections = faceapi.resizeResults( detections, displaySize)
		canvas.getContext('2d').clearRect( 0, 0, canvas.width, canvas.height)
		faceapi.draw.drawDetections( canvas, resizedDetections )
		faceapi.draw.drawFaceLandmarks( canvas, resizedDetections )
		faceapi.draw.drawFaceExpressions( canvas, resizedDetections )
	}, 100)
})
