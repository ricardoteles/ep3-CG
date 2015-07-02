var canvas1, canvas2, canvas3;
var gl1, gl2, gl3;
var program1, program2, program3;
var g_points1 = [];
var g_points2 = []; 
var g_points3 = []; 


window.onload = function init() {

	initializeCanvas(canvas1, 1, gl1, program1, g_points1);		// initialize canvas1
	initializeCanvas(canvas2, 2, gl2, program2, g_points2);		// initialize canvas2
	initializeCanvas(canvas3, 3, gl3, program3, g_points3);		// initialize canvas3
	// bSpline(canvas1, g_points1);	

}

function initializeCanvas (canvas, numCanvas, gl, program, g_points){
	canvas 		= document.getElementById( "gl-canvas"+numCanvas );
	btnClear 	= document.getElementById("btnReset"+numCanvas);	

	gl = WebGLUtils.setupWebGL( canvas );
	if ( !gl ) { alert( "WebGL isn't available" ); }

	gl.viewport( 0, 0, canvas.width, canvas.height );

	gl.enable(gl.DEPTH_TEST);

	program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );

	if(numCanvas <= 2){
		var a_Position = gl.getAttribLocation(program, "a_Position");
		if (a_Position < 0) {
			console.log('Failed to get the storage location of a_Position');
			return;
		}

		canvas.onclick = function(ev){ 
			console.log(g_points);
			click(ev, gl, canvas, a_Position, g_points); 
		};

		btnClear.onclick = function(ev){

			g_points = [];
			gl.clear(gl.COLOR_BUFFER_BIT);

		}
	}

	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	gl.clear(gl.COLOR_BUFFER_BIT);
}

function click(ev, gl, canvas, a_Position, g_points) {
	var x = ev.clientX;
	var y = ev.clientY;
	var rect = ev.target.getBoundingClientRect() ;

	x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
	y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
	
	g_points.push([x, y]); 
	
	gl.clear(gl.COLOR_BUFFER_BIT);

	var len = g_points.length;
	for(var i = 0; i < len; i ++ ) {
		gl.vertexAttrib3f(a_Position, g_points[i][0], g_points[i][1], 0.0);

		gl.drawArrays(gl.POINTS, 0, 1);	
	}
}

//Precisa arrumar a funao bSpline
function bSpline(gl, p) {

  for (var t = 0; t < 1; t += 0.1) {
	var ax = (-p[0].x + 3*p[1].x - 3*p[2].x + p[3].x) / 6;
	var ay = (-p[0].y + 3*p[1].y - 3*p[2].y + p[3].y) / 6;
	var bx = (p[0].x - 2*p[1].x + p[2].x) / 2;
	var by = (p[0].y - 2*p[1].y + p[2].y) / 2;
	var cx = (-p[0].x +p[2].x) / 2;
	var cy = (-p[0].y +p[2].y) / 2;
	var dx = (p[0].x + 4*p[1].x + p[2].x) / 6;
	var dy = (p[0].y + 4*p[1].y + p[2].y) / 6;

	ax*Math.pow(t, 3) + bx*Math.pow(t, 2) + cx*t + dx;
	ay*Math.pow(t, 3) + by*Math.pow(t, 2) + cy*t + dy;
	ax*Math.pow(t+0.1, 3) + bx*Math.pow(t+0.1, 2) + cx*(t+0.1) + dx;
	ay*Math.pow(t+0.1, 3) + by*Math.pow(t+0.1, 2) + cy*(t+0.1) + dy;
  }

  // desenhar os pontos
}


