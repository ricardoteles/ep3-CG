var program;
var canvas;
var gl;

var pointsArray = [];

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas2" );
  
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.5, 0.5, 0.5, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    createBuffers();

    canvas.onclick = function(ev){ click(ev, canvas, pointsArray); };

    document.getElementById("limparTudo").onclick = function(){
        pointsArray = [];
    };
    
    render();

}

var render = function() {   
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            
    gl.drawArrays( gl.POINTS, 0, pointsArray.length );
    gl.drawArrays( gl.LINE_STRIP, 0, pointsArray.length );
    requestAnimFrame(render);
}

function createBuffers(points, normals) {
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
    
    var a_Position = gl.getAttribLocation(program, "a_Position");
    gl.vertexAttribPointer(a_Position, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
}

function click(ev, canvas, pointsArray) {
    var x = ev.clientX;
    var y = ev.clientY;
    var rect = ev.target.getBoundingClientRect() ;

    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
    
    pointsArray.push(vec4(x, y, 0.0, 1.0)); 
    
    createBuffers();
}