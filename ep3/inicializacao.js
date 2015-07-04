function interface(curva, num){
	var numPoints    = document.getElementById("numPoints"+num);
    var dgPolynomial = document.getElementById("degreePolynomial"+num);
    var stDeviation  = document.getElementById("standDeviation"+num);
    var btnSpline    = document.getElementById("btnRadioSpline"+num);
    var btnRag       = document.getElementById("btnRag"+num);
    var btnOk        = document.getElementById("btnOk"+num);

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
            curva.segmentos = parseInt(numPoints.value); 
            console.log(curva.segmentos);
    		
    		if(btnSpline.checked){
            	curva.grau = parseInt(dgPolynomial.value);
            	curva.rag = false;
            	console.log(curva.grau);
            }
            else if(btnRag.checked){
            	curva.sigma = parseInt(stDeviation.value);
            	curva.rag = true;
        		console.log(curva.sigma);
        	}
        	else{
        		alert("Coloque os parametros");
        		console.log(num);
        	}
            // main();
        }
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
		curva1.nPtsContr = 0;
    };
    document.getElementById("btnReset2").onclick = function(){
        g_points2 = [];
		curva2.nPtsContr = 0;
    };
    document.getElementById("trackBall").onclick = function(ev){
		console.log(ev);       
    };
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