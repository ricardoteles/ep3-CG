function funcaoBase(grau, k, nos, t) {
	if (grau == 0) {
		if (nos[k] <= t && t < nos[k+1]) 
			return 1.0;
		else 
			return 0.0;
	}

	if((k+grau+1) < nos.length){
		var frac1 = (t - nos[k]) / (nos[k+grau] - nos[k]);
		var frac2 = (nos[k+grau+1]-t) / (nos[k+grau+1] - nos[k+1]);

		return soma = frac1*funcaoBase(grau-1,k,nos,t) + frac2*funcaoBase(grau-1,k+1,nos,t);			
	}
	else{
		return 0.0;
	}
}

function bSpline(pontosControle, grau, segmentos) {	
 	var nos = [];

 	var qtdadeNos = grau + pontosControle.length;

 	// cria nos
	for (var j = 0; j <= qtdadeNos; j++) {
		nos.push(j);
	}
	
	var passo = (nos[qtdadeNos-1] - nos[0])/segmentos;
		
	for(var t = nos[0]; t < nos[qtdadeNos-1]; t+= passo){
		var p = [0.0, 0.0];

		for(var k = 0; k < pontosControle.length; k++){
			p[0] += pontosControle[k][0]*funcaoBase(grau, k, nos, t);
			p[1] += pontosControle[k][1]*funcaoBase(grau, k, nos, t);
			// console.log(pontosControle[k][0]);
		}

		pontosControle.push(vec4(p[0], p[1], 0.0, 1.0));
	}
}