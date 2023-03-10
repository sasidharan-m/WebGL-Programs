//RotatedTriangle.js
//Author: Sasidharan Mahalingam
//Vertex shader program
var VSHADER_SOURCE = 
	// x' = x cos b - y sin b
	// y' = x sin b + y cos b
	// z' = z
  'attribute vec4 a_Position;\n' +
  'uniform float u_CosB, u_SinB;\n' +
  'void main() {\n' +
  ' gl_Position.x = a_Position.x * u_CosB - a_Position.y * u_SinB;\n' +
  '	gl_Position.y = a_Position.x * u_SinB + a_Position.y * u_CosB;\n' +
  '	gl_Position.z = a_Position.z;\n' +
  '	gl_Position.w = 1.0;\n' +
  '}\n';

//Fragment shader program
var FSHADER_SOURCE =
  'void main()  {\n' +
  ' gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
  '}\n';

//Rotation angle
var ANGLE = 90;

function main() {
//Retrieve canvas element
var canvas = document.getElementById('webgl');

//Get the rendering context for WebGL
var gl = getWebGLContext(canvas);
if(!gl) {
  console.log('Failed to get the rendering context for WebGL');
  return;
}

//Initialize shaders
if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
  console.log('Failed to initialize shaders.');
  return;
}

//Set positions of vertices
var n = initVertexBuffers(gl);
if(n < 0) {
	console.log('Failed to set the positions of the vertices');
	return;
}

//Pass the required data to rotate the shape to the vertex shader
var radian = Math.PI * ANGLE / 180;
var cosB = Math.cos(radian);
var sinB = Math.sin(radian);

//Get storage location of the uniform variables
var u_CosB = gl.getUniformLocation(gl.program, 'u_CosB');
if(!u_CosB) {
	console.log('Failed to get the storage location of u_CosB');
	return;
}
var u_SinB = gl.getUniformLocation(gl.program, 'u_SinB');
if(!u_SinB) {
	console.log('Failed to get the storage location of u_SinB');
	return;
}

//Pass the sin and cos values to u_CosB and u_SinB
gl.uniform1f(u_CosB, cosB);
gl.uniform1f(u_SinB, sinB);

//Set the color for clearing the <canvas>
gl.clearColor(0.0, 0.0, 0.0, 1.0);

//Clear canvas
gl.clear(gl.COLOR_BUFFER_BIT);

gl.drawArrays(gl.TRIANGLES, 0, n);

}


function initVertexBuffers(gl)
{
	var vertices = new Float32Array([
		0.0, 0.5,	-0.5,-0.5,	0.5,-0.5
	]);
	var n = 3;
	//Create a buffer object
	var vertexBuffer = gl.createBuffer();
	if(!vertexBuffer) {
		console.log('Failed to create the buffer object');
		return -1;
	}

	//Bind the buffer object to target
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	//Write data into the buffer object
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

	//Get storage location of the atribute variables
	var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	if(a_Position < 0) {
	  console.log('Failed to get the storage location of a_Position');
	  return;
	}

	//Assign the buffer object to a_Position variable
	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

	//Enable the assignment to a_Position variable
	gl.enableVertexAttribArray(a_Position);

	return n;
}

