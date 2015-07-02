var program;
var canvas;
var gl;
var numPontos = 4;

var pointsArray = [];

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas1" );
  
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
            
    if(pointsArray.length < 4){
        gl.drawArrays( gl.POINTS, 0, pointsArray.length );
    }
    
    // console.log(pointsArray);

    if (pointsArray.length >= 4) {
        gl.drawArrays( gl.POINTS, 0, 4 );
        gl.drawArrays( gl.LINE_STRIP, 4, pointsArray.length-4 );
        // console.log(pointsArray);
    }

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

    // console.log("("+x+", "+y+")");

    selecionaPonto(x, y);
     
    if(pointsArray.length == 4){
        bspline_points(pointsArray, 3, 10);
        console.log(pointsArray);
    }

    createBuffers();
}

function selecionaPonto(x, y){
    var selecionou = false;

    for(var i = 0; i < pointsArray.length; i++){
        if((x >= pointsArray[i][0]-0.02 && x <= pointsArray[i][0]+0.02) && 
            (y >= pointsArray[i][1]-0.02 && y <= pointsArray[i][1]+0.02)){
            alert("Clicou em cima");
            selecionou = true;
            pointsArray.splice(i, 1);   // tira o ponto do pointsArray
        }
    }

    if(!selecionou){
        pointsArray.push(vec4(x, y, 0.0, 1.0));
        // console.log(pointsArray); 
    }
}


/**********************************************************************/

// function BasisFunction(k, i, u, t){
//     if(k == 0){
//         if((u[i]<=t) && (t<=u[i+1]))
//             return 1;
//         else
//             return 0;
//     }
//     else{
//         var memb1, memb2;

//         if(u[i+k]==u[i]) 
//              memb1 = 0;
//         else
//             memb1 = ((t-u[i])/(u[i+k]-u[i]))*BasisFunction(k-1, i, u, t);
//         if(u[i+k+1]==u[i+1])
//             memb2 = 0;
//         else
//             memb2 = ((u[i+k+1]-t)/(u[i+k+1]-u[i+1]))*BasisFunction(k-1, i+1, u, t);
        
//         return memb1+memb2;
//     }
// }

// u = [0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8];

// var point=[0,0]; 

// function bSpline(grau, t){
//     m = pointsArray.length - 5;

//     var basisVal;

//     for(var i = 0; i < m; i++){
//         basisVal = BasisFunction(grau, i, u, t);

//         point[0] += pointsArray[i][0]*basisVal;
//         point[1] += pointsArray[i][1]*basisVal;
//     }

//     pointsArray.push([point[0], point[1], 0.0, 1.0]);
// }

// /**********************************************************************/


// function bSpline(){
//     p = pointsArray;

//     for (var t = 0; t < 1; t += 0.1) {
//         var ax = (-p[0][0] + 3*p[1][0] - 3*p[2][0] + p[3][0]) / 6;
//         var ay = (-p[0][1] + 3*p[1][1] - 3*p[2][1] + p[3][1]) / 6;
//         var bx = (p[0][0] - 2*p[1][0] + p[2][0]) / 2;
//         var by = (p[0][1] - 2*p[1][1] + p[2][1]) / 2;
//         var cx = (-p[0][0] +p[2][0]) / 2;
//         var cy = (-p[0][1] +p[2][1]) / 2;
//         var dx = (p[0][0] + 4*p[1][0] + p[2][0]) / 6;
//         var dy = (p[0][1] + 4*p[1][1] + p[2][1]) / 6;

//         var x = ax*Math.pow(t, 3) + bx*Math.pow(t, 2) + cx*t + dx;
//         var y = ay*Math.pow(t, 3) + by*Math.pow(t, 2) + cy*t + dy;
    
//         pointsArray.push(vec4(x, y, 0.0, 1.0));
//     }

//     console.log(pointsArray);    
//     // gl.drawArrays( gl.TRIANGLES, 4, 11 );
// }

// function bSpline(){
//     p = pointsArray;
//     var q = [];

//     for(var j = 0; j < N; j++){
//         for(var i = 0; i < p.length; i++){
//             q[2*i] = p[i];
//             q[2*i+1] = (p[i]+p[i+1])/2;
//         }

//         for(var i = 0; i < q.length; i++){
//             p[i] = (q[i] + q[i+1])/2;
//         }
//     }


    // for(var i = 0; i < N; i++){
    //     q[2*i] = p[i];
    //     q[2*i+1] = (p[i]+p[i+1])/2;

    //     for(var j = 0; j < M; j++){

    //     }
    // }
// }