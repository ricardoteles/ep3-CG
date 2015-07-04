function funcaoBase(k, i, u, t) {

	if (k == 1) {
		if (u[i] <= t && t < u[i+1]) 
			return 1.0;
		else 
			return 0.0;
	}

	var den1 = u[i+k-1] - u[i];
	var den2 = u[i+k] - u[i+1];
	var fator1 = 0;
	var fator2 = 0;

	if (den1 > 0) {
		fator1 = ((t - u[i]) / den1) * funcaoBase(k-1, i, u, t);
	}
	if (den2 > 0) {
		fator2 = ((u[i+k] - t) / den2) * funcaoBase(k-1, i+1, u, t);
	}
	return fator1 + fator2;
}

function curvaBspline(pontosControle, grau, t, u) {
	var ponto = [0.0, 0.0];
	
	for(var i = 0; i < pontosControle.length; i++) {
		var b = funcaoBase(grau+1, i, u, t);
		ponto[0] += b * pontosControle[i][0];
		ponto[1] += b * pontosControle[i][1];			
	}

	return vec4(ponto[0], ponto[1], 0.0, 1.0);	
}

function bspline_points(pontosControle, grau, segmentos) {	
 	var u = [];

 	var m = grau + pontosControle.length;

	for (var i = 0; i <= m; i++) {
		u.push(i/m);
	}
		
	for (var i = 0; i <= segmentos; i++) {
		var t = i/segmentos;
		var p = curvaBspline(pontosControle, grau, t, u);
		pontosControle.push(p);
	}
 }