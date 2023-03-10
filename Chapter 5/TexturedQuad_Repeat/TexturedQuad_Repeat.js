//Textured Quad_Repeat
//Author: Sasidharan Mahalingam
//Vertex Shader Program
var VSHADER_SOURCE =
	'attribute vec4 a_Position;\n' +
	'attribute vec2 a_TexCoord;\n' +
	'varying vec2 v_TexCoord;\n' +
	'void main() {\n' +
	'	gl_Position = a_Position;\n' +
	'	v_TexCoord = a_TexCoord;\n' +
	'}\n';

//Fragment Shader Program
var FSHADER_SOURCE = 
	'precision mediump float;\n' +
	'uniform sampler2D u_Sampler;\n' +
	'varying vec2 v_TexCoord;\n' +
	'void main() {\n' +
	'  gl_FragColor = texture2D(u_Sampler, v_TexCoord);\n' +
	'}\n';

function main() {
	//Retrieve the canvas element
	var canvas = document.getElementById('webgl');
	
	//Get the rendering context for WebGL
	var gl = getWebGLContext(canvas);
	if(!gl) {
		console.log('Failed to get the rendering context for WebGL');
	}

	//Initialize shaders
	if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
		console.log('Failed to initialize shaders');
		return;
	}

	//Set the vertex information
	var n = initVertexBuffers(gl);
	if(n < 0) {
		console.log('Failed to set the vertex information');
	}

	//Specify the color for clearing the canvas
	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	//Set texture
	if(!initTextures(gl, n)) {
		console.log('Failed to initialize the texture');
		return;
	}
}

function initVertexBuffers(gl) {
	var verticesTexCoords = new Float32Array([
		//Vertex coordinates and texture coordinates
		-0.5, 0.5,  -0.3, 1.7,
		-0.5,-0.5,	-0.3,-0.2,
		 0.5, 0.5,	 1.7, 1.7,
		 0.5,-0.5,	 1.7,-0.2
	]);
	var n = 4;

	//Create the buffer object
	var vertexTexCoordBuffer = gl.createBuffer();
	if(!vertexTexCoordBuffer) {
		console.log('Failed to create the buffer object');
		return -1;
	}

	//Bind the buffer to target
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

	var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;
	//Get the storage location of a_Position
	var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	if(a_Position < 0) {
		console.log('Failed to get the storage location of a_Position');
		return -1;
	}
	//Assign the buffer object to a_Position variable
	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
	gl.enableVertexAttribArray(a_Position);

	//Get the location of a_TexCoord
	var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
	if(a_TexCoord < 0) {
		console.log('Failed to get the storage location of a_TexCoord');
		return -1;
	}
	//Assign the buffer object to the a_TexCoord variable
	gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
	gl.enableVertexAttribArray(a_TexCoord);

	return n;
}

function initTextures(gl, n) {
	var texture = gl.createTexture();
	if(!texture) {
	console.log('Failed to create the texture object');
		return false;
	}

	//Get the storage location of u_Sampler
	var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
	if (!u_Sampler) {
		console.log('Failed to get the storage location of u_Sampler');
		return false;
	}
	var image = new Image();  // Create the image object
	if (!image) {
		console.log('Failed to create the image object');
		return false;
	}
	//Register the event handler to be called on loading an image
	image.onload = function(){ loadTexture(gl, n, texture, u_Sampler, image); };
	//Tell the browser to load an image
	image.src = '../../resources/sky.jpg';

	return true;
}


function loadTexture(gl, n, texture, u_Sampler, image) {
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
	//Enable texture unit0
	gl.activeTexture(gl.TEXTURE0);
	//Bind texture object to target
	//Bind the texture object to the target
	gl.bindTexture(gl.TEXTURE_2D, texture);

	//Set the texture parameters
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	//Set the texture image
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

	//Set the texture unit 0 to the sampler
	gl.uniform1i(u_Sampler, 0);

	gl.clear(gl.COLOR_BUFFER_BIT);   //Clear <canvas>

	gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); //Draw the rectangle
}