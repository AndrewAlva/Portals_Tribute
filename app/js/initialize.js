var song;
/* Valor de suavizado. smooth es palabra reservada,
 * _ es una buena práctica para renombrar variables que tienen nombre similar a otros sin causar conflictos */
var _smooth = 0.83; // Suavizado
var samples = 1024; // Número de muestras a analizar
/* FFT: Fast Fourier Transform (Transformada rápida de Fourier) */
var fft = new p5.FFT(_smooth, samples);

// Andrew's vars
var cFrame = 0;
const PI2 = Math.PI * 2;

var canvasContainer = document.getElementById('canvas-container');
var canvasSize = {
	x: canvasContainer.getBoundingClientRect().width, 
	y: canvasContainer.getBoundingClientRect().height
};
var halfWidth = canvasSize.x / 2;
var halfHeight = canvasSize.y / 2;

var lines_angle;
var lines_weight = 1;
var spiral_turns = 1;
var spiral_factor = 1.4 * spiral_turns;


function preload() {
	song = loadSound('./music/beer.mp3');
}

function setCanvasSize() {
	canvasSize.x = canvasContainer.getBoundingClientRect().width;
	canvasSize.y = canvasContainer.getBoundingClientRect().height;
}

function setup() {
	setCanvasSize();
	var canvas = createCanvas(canvasSize.x, canvasSize.y);
	canvas.parent('canvas-container');
	colorMode(HSB, 255);

	canvas.mousePressed(playSong);
	fft.setInput(song);
	noFill();
	stroke(255);
	strokeWeight(lines_weight);

	lines_angle = PI2 / samples;
}

function windowResized() {
	setCanvasSize();
	halfWidth = canvasSize.x / 2;
	halfHeight = canvasSize.y / 2;
	resizeCanvas(canvasSize.x, canvasSize.y);
	background(0);
}

function playSong() {
	if (song.isPlaying()) {
		song.pause();
	} else {
		song.loop();
	}
}

function draw() {
	/* CLEANER */
	background(0, 250);
	/* Actualizamos el análisis de ondas */
	var spectrum = fft.analyze();
	// Iteramos el total de muestras
	// Calculamos el espacio entre cada muestra
	var x_space = width / samples;
	// Iteramos el total de muestras
	for (var i = 0; i < spectrum.length; i+= 1) {
		var x = x_space * i;
		var value = spectrum[i];
		var _height = map(value, 0, 255, 0, halfHeight);

		// stroke(value, 255,255, Math.floor(255 / spiral_turns) );
		stroke(value, 255, 255, 150);
		
		//rect(x, 0, x_space, _height);

		brush(i, _height);
	}

	cFrame++;
}

function brush(i,h) {
	push();
		translate(halfWidth, halfHeight);
		// rotate(radians(cFrame % 360) );
		// rotate( (cFrame/100) + ((lines_angle * i) * spiral_factor) );
		rotate((lines_angle * i) * spiral_factor );
		drawing(h);
	pop();
}

function drawing(h) {
	beginShape();
		vertex(0, 0);
		//bezierVertex(width, 0,    -width, 0,    0, h);
		bezierVertex(0, 0,    0, 0,    0, h);
		// bezierVertex(h, 0,    h, 0,    0, h);
	endShape();
}


function keyPressed() {
	if (keyCode == 38) {
		// UP
		spiral_turns+= 0.5;
	} else if (keyCode == 40) {
		// DOWN
		spiral_turns-= 0.5;
	}

	spiral_factor = 1.4 * spiral_turns;
}






// Trigger functions when the initial HTML document
// has been completely loaded and parsed,
// without waiting for stylesheets, images, and
// subframes to finish loading
document.addEventListener('DOMContentLoaded', function() {
	// Do something
});


// Trigger functions after page is completely loaded
window.onload = function() {
	// Do something, remove preloader perhaps
	console.log("Page fully loaded.");
	console.log("Initialize.js");

	document.querySelector('.artist-logo').classList.add('show');

	document.querySelector('.title-container').classList.add('show');

	document.querySelector('.artwork-img').classList.add('show');
	
}