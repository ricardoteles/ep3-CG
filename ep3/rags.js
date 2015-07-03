var V=[[3,2],[4,3],[5,7]];
var t = [1,2,3];

function Rag (u){
    var point = [0.0,0.0];

    for (var i = 0; i < V.length; i++) {
        point[0] += V[i][0] * g(i, u);
        point[1] += V[i][1] * g(i, u);
    }
    return vec4(point[0], point[1], 0.0, 1.0);
}

function g(i, u) {
    var den = 0;
    
    for (var j = 0; j < V.length; j++) {
        den += G(j, u);
    }

    return (G(i, u))/den;
}

function G (i, u) {
  return Math.exp(-(u-t[i])*(u-t[i])/(2*sigma*sigma));
}

function main(){
    var result = 0;
    for (var u = 0; u <= 1 ; u+=0.125){
        result = Rag(u);
        console.log(result);
    }
}