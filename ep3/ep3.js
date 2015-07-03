var canvas1, canvas2, canvas3;
var gl1, gl2, gl3;
var program1, program2, program3;
var g_points1 = [];
var g_points2 = [];
var sigma = 0; 
// var g_points3 = [];

var bsInfo1 = {
	grau: 3,
	nPtsContr: 0,
	numSeg: 5
};
var bsInfo2 = {
	grau: 3,
	nPtsContr: 0,
	numSeg: 5
};

/********************* testes ******************/

var g_points3 = [
        vec4( -0.2, -0.2,  0.2, 1.0 ),
        vec4( -0.2,  0.2,  0.2, 1.0 ),
        vec4( 0.2,  0.2,  0.2, 1.0 ),
        vec4( 0.2, -0.2,  0.2, 1.0 ),
        vec4( -0.2, -0.2, -0.2, 1.0 ),
        vec4( -0.2,  0.2, -0.2, 1.0 ),
        vec4( 0.2,  0.2, -0.2, 1.0 ),
        vec4( 0.2, -0.2, -0.2, 1.0 )
];


/***********************************************/


// transformation and projection matrices
var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;

// camera definitions
var eye = vec3(1.0, 0.0, 0.0);
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);

var cradius = 1.0;
var ctheta = 0.0;
var cphi = 0.0;

// our universe
var xleft = -1.0;
var xright = 1.0;
var ybottom = -1.0;
var ytop = 1.0;
var znear = -100.0;
var zfar = 100.0;
var z = 0.0;

var cameraRotationMatrix = mat4();

var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;

window.onload = function init() {

	initializeCanvas();		

    dgPolynomial = document.getElementById("degreePolynomial");
    stDeviation  = document.getElementById("standDeviation");
    btnSpline    = document.getElementById("btnRadioSpline");
    btnRag       = document.getElementById("btnRag");
    btnOk       = document.getElementById("btnOk");

    stDeviation.style.display = "none";
    dgPolynomial.style.display = "block";

    btnSpline.onclick = function(){
        dgPolynomial.style.display = "block";
        stDeviation.style.display = "none";
    };

    btnRag.onclick = function(){
        dgPolynomial.style.display = "none";
        stDeviation.style.display = "block";
    };

    btnOk.onclick = function(ev) {
            //RaG(canvas1, g_points1);
            sigma = stDeviation.value;
            bsInfo1.grau = dgPolynomial.value;
            console.log(bsInfo1.grau);
            // console.log(sigma);
            // main();
        }

	canvas1.onclick = function(ev){ click(ev, canvas1, g_points1, 1); };
	canvas2.onclick = function(ev){ click(ev, canvas2, g_points2, 2); };
	
	render();
}

function initializeCanvas (){
	canvas1 = document.getElementById( "gl-canvas1");
	canvas2 = document.getElementById( "gl-canvas2");
	canvas3 = document.getElementById( "gl-canvas3");

	gl1 = WebGLUtils.setupWebGL( canvas1 );
	if ( !gl1 ) { alert( "WebGL isn't available" ); }
	gl2 = WebGLUtils.setupWebGL( canvas2 );
	if ( !gl2 ) { alert( "WebGL isn't available" ); }
	gl3 = WebGLUtils.setupWebGL( canvas3 );
	if ( !gl3 ) { alert( "WebGL isn't available" ); }

	gl1.viewport( 0, 0, canvas1.width, canvas1.height );
	gl1.clearColor(0.0, 0.0, 0.0, 1.0);
	gl2.viewport( 0, 0, canvas2.width, canvas2.height );
	gl2.clearColor(0.0, 0.0, 0.0, 1.0);
	gl3.viewport( 0, 0, canvas3.width, canvas3.height );
	gl3.clearColor(0.0, 0.0, 0.0, 1.0);

	gl1.enable(gl1.DEPTH_TEST);
	gl2.enable(gl2.DEPTH_TEST);
	gl3.enable(gl3.DEPTH_TEST);

	program1 = initShaders( gl1, "vertex-shader", "fragment-shader" );
	gl1.useProgram( program1 );
	program2 = initShaders( gl2, "vertex-shader", "fragment-shader" );
	gl2.useProgram( program2 );
	program3 = initShaders( gl3, "vertex-shader", "fragment-shader" );
	gl3.useProgram( program3 );

	gl1.clear(gl1.COLOR_BUFFER_BIT);
	gl2.clear(gl2.COLOR_BUFFER_BIT);
	gl3.clear(gl3.COLOR_BUFFER_BIT);

	createBuffers();

	document.getElementById("btnReset1").onclick = function(){
        g_points1 = [];
		bsInfo1.nPtsContr = 0;
    };
    document.getElementById("btnReset2").onclick = function(){
        g_points2 = [];
		bsInfo2.nPtsContr = 0;
    };
    document.getElementById("trackBall").onclick = function(ev){
		console.log(ev);       
    };
}

function handleMouseDown(event) {
    mouseDown = true;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
}

function RotationCamera(event) {
    if (!mouseDown) {
      return;
    }

    var newX = event.clientX;
    var newY = event.clientY;

    var deltaX = newX - lastMouseX;
    
    var newRotationMatrix = mat4();
    newRotationMatrix = mult(newRotationMatrix, quaternToMatrix(quatern((deltaX / 400)%360, [0, 1, 0])));

    var deltaY = newY - lastMouseY;
    newRotationMatrix = mult(newRotationMatrix, quaternToMatrix(quatern((deltaY / 400)%360, [1, 0, 0])));

    cameraRotationMatrix = mult(newRotationMatrix, cameraRotationMatrix);
	
    lastMouseX = newX
    lastMouseY = newY;
}

function createBuffers() {
    var vBuffer = gl1.createBuffer();
    gl1.bindBuffer( gl1.ARRAY_BUFFER, vBuffer );
    gl1.bufferData( gl1.ARRAY_BUFFER, flatten(g_points1), gl1.STATIC_DRAW );
    
    var vPosition = gl1.getAttribLocation(program1, "vPosition");
    gl1.vertexAttribPointer(vPosition, 4, gl1.FLOAT, false, 0, 0);
    gl1.enableVertexAttribArray(vPosition);

    var vBuffer = gl2.createBuffer();
    gl2.bindBuffer( gl2.ARRAY_BUFFER, vBuffer );
    gl2.bufferData( gl2.ARRAY_BUFFER, flatten(g_points2), gl2.STATIC_DRAW );
    
    var vPosition = gl2.getAttribLocation(program2, "vPosition");
    gl2.vertexAttribPointer(vPosition, 4, gl2.FLOAT, false, 0, 0);
    gl2.enableVertexAttribArray(vPosition);

    var vBuffer = gl3.createBuffer();
    gl3.bindBuffer( gl3.ARRAY_BUFFER, vBuffer );
    gl3.bufferData( gl3.ARRAY_BUFFER, flatten(g_points3), gl3.STATIC_DRAW );
    
    var vPosition = gl3.getAttribLocation(program3, "vPosition");
    gl3.vertexAttribPointer(vPosition, 4, gl3.FLOAT, false, 0, 0);
    gl3.enableVertexAttribArray(vPosition);
}

var render = function() {
    gl1.clear( gl1.COLOR_BUFFER_BIT | gl1.DEPTH_BUFFER_BIT);        
    gl2.clear( gl2.COLOR_BUFFER_BIT | gl2.DEPTH_BUFFER_BIT);        
    gl3.clear( gl3.COLOR_BUFFER_BIT | gl3.DEPTH_BUFFER_BIT);        

    /***************************/
    eye = vec3(cradius * Math.sin(ctheta) * Math.cos(cphi),
               cradius * Math.sin(ctheta) * Math.sin(cphi), 
               cradius * Math.cos(ctheta));

    modelViewMatrix = lookAt(eye, at, up);
    modelViewMatrix = mult(modelViewMatrix, cameraRotationMatrix);
                     
    projectionMatrix = ortho(xleft, xright, ybottom, ytop, znear, zfar);

    gl3.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    /***************************/

    // if(g_points1.length < bsInfo1.grau + 1){
    // 	gl1.drawArrays(gl1.POINTS, 0, g_points1.length);
    // }

    gl2.drawArrays(gl2.POINTS, 0, g_points2.length);
    gl3.drawArrays(gl3.TRIANGLES, 0, g_points3.length);

    // if (g_points1.length >= bsInfo1.grau + 1) {
    gl1.drawArrays( gl1.POINTS, 0, bsInfo1.nPtsContr);
    gl1.drawArrays( gl1.LINE_STRIP, bsInfo1.nPtsContr, g_points1.length - bsInfo1.nPtsContr);
    // }

    requestAnimFrame(render);            
}

function click(ev, canvas, g_points, num) {
	var x = ev.clientX;
	var y = ev.clientY;
	var rect = ev.target.getBoundingClientRect() ;

	x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
	y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

	if(num == 1){
		g_points.splice(bsInfo1.nPtsContr, 0, vec4(x, y, 0.0, 1.0));
        bsInfo1.nPtsContr++;
		// console.log(g_points);
		// console.log(bsInfo1.grau);
		if(bsInfo1.nPtsContr == bsInfo1.grau + 1){
		    bspline_points(g_points, bsInfo1.grau, 10);
		}
    }
	else{
		g_points.splice(bsInfo2.nPtsContr, 0, vec4(x, y, 0.0, 1.0));
        bsInfo2.nPtsContr ++;
    }

	createBuffers();
}