var program1, program2, program3;
var canvas1, canvas2, canvas3;
var gl1, gl2, gl3;
var g_points1 = [];
var g_points2 = [];
// var g_points3 = [];

var curva1 = {
	nPtsContr: 0,
	segmentos: 5,
	grau: 3,
	sigma: 0.01,
	rag: false	
};
var curva2 = {
	nPtsContr: 0,
	segmentos: 5,
	grau: 3,
	sigma: 0.01,
	rag: false
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

    interface(curva1, 1);
    interface(curva2, 2);


	canvas1.onmousedown = function(ev){ click(ev, canvas1, g_points1, curva1); };
	canvas2.onmousedown = function(ev){ click(ev, canvas2, g_points2, curva2); };
	
	render();
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

    gl1.drawArrays( gl1.POINTS, 0, curva1.nPtsContr);
    gl1.drawArrays( gl1.LINE_STRIP, curva1.nPtsContr, g_points1.length - curva1.nPtsContr);

    gl2.drawArrays( gl2.POINTS, 0, curva2.nPtsContr);
    gl2.drawArrays( gl2.LINE_STRIP, curva2.nPtsContr, g_points2.length - curva2.nPtsContr);

    gl3.drawArrays(gl3.TRIANGLES, 0, g_points3.length);


    requestAnimFrame(render);            
}

function click(ev, canvas, g_points, curva) {
	var x = ev.clientX;
	var y = ev.clientY;
	var rect = ev.target.getBoundingClientRect() ;

	x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
	y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

 	selecionaPonto(x,y,g_points, curva, ev, canvas);

	if(curva.nPtsContr == (curva.grau + 1) && !curva.rag){
	    bSpline(g_points, curva.grau, curva.segmentos);
	}
	if (curva.nPtsContr == (curva.grau + 1) && curva.rag){
		alert("Sou rag");
	}

	createBuffers();
}

function selecionaPonto(x, y, g_points, curva, ev,canvas){
    var selecionou = false;

    for(var i = 0; i < g_points.length; i++){
        if((x >= g_points[i][0]-0.03 && x <= g_points[i][0]+0.03) && 
            (y >= g_points[i][1]-0.03 && y <= g_points[i][1]+0.03)){
            console.log("Clicou em cima");
            selecionou = true;
            moverPonto(i, g_points, curva, ev, canvas);
            //g_points.splice(i, 1);   // tira o ponto do g_points
        	break;
        }
    }

    if(!selecionou){
		g_points.splice(curva.nPtsContr, 0, vec4(x, y, 0.0, 1.0));
	    curva.nPtsContr++;
    }
}

function moverPonto(i, g_points, curva, evento, canvas){
	canvas.onmousemove = function(ev){
		var x = ev.clientX;
		var y = ev.clientY;
		var rect = ev.target.getBoundingClientRect() ;

		x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
		y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);


		g_points[i][0] = x;
		g_points[i][1] = y;

		createBuffers();

		canvas.onmouseup = function(){
			ev.target.onmousemove = null;
		}
	}
}