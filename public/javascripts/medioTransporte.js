/*
################ FORMATOS ##################
-------------------------------------------
*/
	var formatAsPercentage = d3.format("%"),
		formatAsPercentage1Dec = d3.format(".1%"),
		formatAsInteger = d3.format(","),
		numFormat = d3.format("s"),
		fsec = d3.time.format("%S s"),
		fmin = d3.time.format("%M m"),
		fhou = d3.time.format("%H h"),
		fwee = d3.time.format("%a"),
		fdat = d3.time.format("%d d"),
		fmon = d3.time.format("%b");


// ############# TARTA ###################

	function dsPieChart7(){

		var margin = {top: 10, right: 0, bottom: 10, left: 0};
		var width = 200,
		height = 200,
		outerRadius = Math.min(width, height) / 2,
		innerRadius = outerRadius * .999, //999  
		// animación
		innerRadiusFinal = outerRadius * .10, //5
		innerRadiusFinal3 = outerRadius* .30, //45
		color = d3.scale.category20();    //gama de colores
			   
		d3.csv('https://raw.githubusercontent.com/crisspatri/dashboardturismoecuador/master/public/data/7.EntExt%20segun%20medio%20de%20transporte.csv', function(data) {

			data =d3.nest()
				.key(function(d) { return d.TRANSPORTE; })
				.rollup(function(v) { return {
	    			count: v.length,
	    			total: d3.sum(v, function(d) { return d.ENTRADAS; })
	    		};})
				.entries(data);
				//console.log(JSON.stringify(data));

			var refresh=d3.select("#idTransporte")				
				.on("mouseover", mouseoverRefresh)
				.on("mouseout", mouseoutRefresh)
				.on("click", up7Refresh);

			var vis = d3.select("#pieChart7")
				.append("svg:svg")              //crea el SVG dentro de <body>
				.data([data])                   
				.attr("width", width)          
				.attr("height", height)
				.append("svg:g")                //grupo para poner la tarta
				.attr("transform", "translate(" + outerRadius + "," + outerRadius + ")") ;

	   		var arc = d3.svg.arc()              //cra los elementos <path> para los arcos de los datos
	    		.outerRadius(outerRadius).innerRadius(innerRadius);
	   
			// para la animación
			var arcFinal = d3.svg.arc().innerRadius(innerRadiusFinal).outerRadius(outerRadius);
			var arcFinal3 = d3.svg.arc().innerRadius(innerRadiusFinal3).outerRadius(outerRadius);

			var pie = d3.layout.pie()  
				.value(function(d) { return d.values.total; });  //measure**  

			var arcs = vis.selectAll("g.slice")     
				.data(pie)                          
				.enter()                           
				.append("svg:g")               
				.attr("class", "slice")    
				.on("mouseover", mouseover)
				.on("mouseout", mouseout)
				.on("click", up7);
	    				
			arcs.append("svg:path")
				.attr("fill", function(d, i) { return color(i); } ) 
				.attr("d", arc)     
				.append("svg:title") 
				.text(function(d) { return d.data.key + ": " + numFormat(d.data.values.total); });			

			d3.selectAll("g.slice")
				.selectAll("path")
				.transition()
				.duration(750)
				.delay(10)
				.attr("d", arcFinal );

			// Añade una etiqueda a los arcos mayores, las traslada al centroide y las rota
			arcs.filter(function(d) { return d.endAngle - d.startAngle > .2; })
				.append("svg:text")
				.attr("dy", ".35em")
				.attr("text-anchor", "middle")
				.attr("transform", function(d) { return "translate(" + arcFinal.centroid(d) + ")rotate(" + angle(d) + ")"; })
				//.text(function(d) { return formatAsPercentage(d.value); })
				.text(function(d) { return d.data.key; });
		   
			// Calcula le angulo para la etiqueta comvirtiendo de radianes a grados
			function angle(d) {
				var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
				return a > 90 ? a - 180 : a;
			}   

			function mouseover() {
				d3.select(this).select("path").transition()
				.duration(750)
				.attr("d", arcFinal3);

				document.body.style.cursor = 'pointer';
			}
		
			function mouseout() {
				d3.select(this).select("path").transition()
				.duration(750)
				.attr("d", arcFinal);

				document.body.style.cursor = 'auto';
			}
		
			function up7(d, i) {
				updateBarChart7(d.data.key, color(i));
			} 

			function mouseoverRefresh() {
				document.body.style.cursor = 'pointer';
			}
		
			function mouseoutRefresh() {
				document.body.style.cursor = 'auto';
			}
		
			function up7Refresh(d, i) {
				d3.select("#pieChart7 svg").remove();
				d3.select("#barChart7 svg").remove();
				d3.select("#lineChart7 svg").remove();
				dsPieChart7();
				dsBarChart7();
				dsLineChart7();
			} 

		}); //FIN DE GRAFICO TARTA
	}

	dsPieChart7();
// ############# FIN TARTA ###################

// ############# BARRAS ###################
	var datasetBarChart7 = [];

	function datasetBarChosen7(anio) {
		var ds = [];
		datasetBarChart7.forEach(function(d,i){
			if (d.TRANSPORTE==anio)
				ds.push(datasetBarChart7[i]);			
		});

		return ds;
	}

	function dsBarChartBasics() {
		var margin = {top: 30, right: 0, bottom: 30, left: 0},
		width = 500 - margin.left - margin.right,
		height = 250 - margin.top - margin.bottom,
		colorBar = d3.scale.category20(),
		barPadding = 5;

		return {
			margin : margin, 
			width : width, 
			height : height, 
			colorBar : colorBar, 
			barPadding : barPadding
		};
	}

	function dsBarChart7() {

		var basics = dsBarChartBasics();
		
		var margin = basics.margin,
			width = basics.width,
		    height = basics.height,
			colorBar = basics.colorBar,
			barPadding = basics.barPadding;

		var firstDatasetBarChart=[];

		d3.csv('https://raw.githubusercontent.com/crisspatri/dashboardturismoecuador/master/public/data/7.EntExt%20segun%20medio%20de%20transporte.csv', function(dataBC) {

			datasetBarChart7=dataBC;
			
			dataBC =d3.nest()
				.key(function(d) { return d.CIUDAD; })
				.rollup(function(v) { return {
	    			count: v.length,
	    			total: d3.sum(v, function(d) { return d.ENTRADAS; })
	    		};})
				.entries(dataBC);
				//console.log(JSON.stringify(dataBC));
			
			dataBC.forEach(function(d,i){
				if (i<6)
					firstDatasetBarChart.push(dataBC[i]);
			});

			firstDatasetBarChart.sort (
				function(a, b) { 
					return d3.descending(a.values.total, b.values.total);
				});

			var xScale = d3.scale.linear()
				.domain([0, firstDatasetBarChart.length])
				.range([0, width]);
			  
			var yScale = d3.scale.linear()
				.domain([ 0 , d3.max(firstDatasetBarChart, function(d) { return d.values.total; })])
				.range([height, 0 ]);		//* 0.99
			
			var svg = d3.select("#barChart7")
				.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.attr("id","barChartPlot7");
		
			var plot = svg
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			plot.selectAll("rect")
				.data(firstDatasetBarChart)
				.enter()
				.append("rect")
				.attr("x", function(d, i) {
					return xScale(i);
				})
				.attr("width", width / firstDatasetBarChart.length - barPadding)   
				.attr("y", function(d) {
					return yScale
					(d.values.total);
				})  
				.attr("height", function(d) {
					return height-yScale(d.values.total);
				})
				.attr("fill", "lightgrey");				

			plot.selectAll("text")
				.data(firstDatasetBarChart)
				.enter()
				.append("text")
				.text(function(d) {
						return (numFormat(d.values.total));//formatAsInteger(d3.round(d.values.total));
				})
				.attr("text-anchor", "middle")
				.attr("x", function(d, i) {
						return (i * (width / firstDatasetBarChart.length)) + ((width / firstDatasetBarChart.length - barPadding) / 2);
				})
				.attr("y", function(d) {
						return yScale(d.values.total) - 3;
				})
				.attr("class", "yAxis");			

			var xLabels = svg
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + (margin.top + height)  + ")");
		
			xLabels.selectAll("text.xAxis")
				.data(firstDatasetBarChart)
				.enter()
				.append("text")
				.text(function(d) { return d.key;})
				.attr("text-anchor", "middle")
				.on("click", up7)
				.on("mouseover", mouseover)
				.on("mouseout", mouseout)
				// posicion x a partir del borde izquierdo más la mitad de la anchura de la barra
				.attr("x", function(d, i) {
					return (i * (width / firstDatasetBarChart.length)) + ((width / firstDatasetBarChart.length - barPadding) / 2);
				})
				.attr("y", 15)
				.attr("class", "xAxis");				
		 
			// Titulo
			
			svg.append("text")
				.attr("x", (width + margin.left + margin.right)/2)
				.attr("y", 25)
				//.attr("class","title")				
				.attr("id","lineChartTitle1")
				.text("Años 2011-2015");	

			function up7(d, i) {
				updateLineChart7(d.key, '#00FF5A');
			} 
	
			function mouseover() {
				document.body.style.cursor = 'pointer';
			}
		
			function mouseout() {
				document.body.style.cursor = 'auto';
			}			
		})		
	}

	dsBarChart7();
 
	function updateBarChart7(anio, colorChosen) {
		
		var currentDatasetBarChart1 = datasetBarChosen7(anio);
		var currentDatasetBarChart=[];
		
		var basics = dsBarChartBasics();

		var margin = basics.margin,
			width = basics.width,
		    height = basics.height,
			colorBar = basics.colorBar,
			barPadding = basics.barPadding;		

		currentDatasetBarChart1 =d3.nest()
			.key(function(d) { return d.CIUDAD; })
			.rollup(function(v) { return {
    			count: v.length,
    			total: d3.sum(v, function(d) { return d.ENTRADAS; })
    		};})
			.entries(currentDatasetBarChart1);
			//console.log(JSON.stringify(currentDatasetBarChart));
			
		currentDatasetBarChart1.sort (
			function(a, b) { 
				return d3.descending(a.values.total, b.values.total);
			});

		currentDatasetBarChart1.forEach(function(d,i){
				if (i<6)
					currentDatasetBarChart.push(currentDatasetBarChart1[i]);
			});

		var xScale = d3.scale.linear()
			.domain([0, currentDatasetBarChart.length])
			.range([0, width]);	

		var yScale = d3.scale.linear()
			.domain([0, d3.max(currentDatasetBarChart, function(d) { return d.values.total; })])
			.range([height , 0]);
	      
		var svg = d3.select("#barChart7 svg");
	      
		var plot = d3.select("#barChartPlot7")
			.datum(currentDatasetBarChart);

		plot.selectAll("rect")
			.data(currentDatasetBarChart)
			.transition()
			.duration(750)
			.attr("x", function(d, i) {
				return xScale(i);
			})
			.attr("width", width / currentDatasetBarChart.length - barPadding)   
			.attr("y", function(d) {
				return yScale(d.values.total);
			})  
			.attr("height", function(d) {
				return height-yScale(d.values.total);
			})
			.attr("fill", colorChosen);
		
		plot.selectAll("text.yAxis") 
			.data(currentDatasetBarChart)
			.transition()
			.duration(750)
			.attr("text-anchor", "middle")
			.attr("x", function(d, i) {
				return (i * (width / currentDatasetBarChart.length)) + ((width / currentDatasetBarChart.length - barPadding) / 2);
			})
			.attr("y", function(d) {
				return yScale(d.values.total) -3;
			})
			.text(function(d) {
				return numFormat(d.values.total);
			})
			.attr("class", "yAxis");

		svg.selectAll("text.xAxis").remove();

		var xLabels = svg
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + (margin.top + height)  + ")");
			
		xLabels.selectAll("text.xAxis")
			.data(currentDatasetBarChart)
			.enter()
			.append("text")
			.text(function(d) { return d.key;})
			.attr("text-anchor", "middle")
			.on("click", up7)
			.on("mouseover", mouseover)
			.on("mouseout", mouseout)
			// posicion x a partir del borde izquierdo más la mitad de la anchura de la barra
			.attr("x", function(d, i) {
				return (i * (width / currentDatasetBarChart.length)) + ((width / currentDatasetBarChart.length - barPadding) / 2);
			})
			.attr("y", 15)
			.attr("class", "xAxis");	

		svg.selectAll("#lineChartTitle1") 
			.attr("x", (width + margin.left + margin.right)/2)
			.attr("y", 25)
			.attr("id","lineChartTitle1")
			.text("" + anio);

		function up7(d, i) {
				updateLineChart7(d.key, '#00FF5A');
		} 
	
		function mouseover() {
			document.body.style.cursor = 'pointer';
		}
	
		function mouseout() {
			document.body.style.cursor = 'auto';
		}	
	}
// ############# FIN BARRAS ###################

// ############# LINE CHART ###################
	var datasetLineChart7 = [];

	function datasetLineChartChosen7(continente) {
		var ds = [];
		datasetLineChart7.forEach(function(d,i){
				if (d.CIUDAD==continente)
					ds.push(datasetLineChart7[i]);			
		});

		return ds;
	}

	function dsLineChartBasics() {
		var margin = {top: 70, right: 10, bottom: 0, left: 10},
		    width = 400 - margin.left - margin.right,
		    height = 250 - margin.top - margin.bottom;
		
		return {
			margin : margin, 
			width : width, 
			height : height
		};
	}

	function dsLineChart7() {

		var basics = dsLineChartBasics();
		
		var margin = basics.margin,
			width = basics.width,
		   	height = basics.height;

	   	var firstDatasetLineChart=[];

	   	d3.csv('https://raw.githubusercontent.com/crisspatri/dashboardturismoecuador/master/public/data/7.EntExt%20segun%20medio%20de%20transporte.csv', function(dataLC) {

			datasetLineChart7=dataLC;

			dataLC =d3.nest()
				//.key(function(d) { return d.CONTINENTE; })
				.key(function(d) { return d.ANIO; })
				.rollup(function(v) { return d3.sum(v, function(d) { return d.ENTRADAS; });
				})
				.entries(dataLC);
				console.log(JSON.stringify(dataLC));
			
			dataLC.forEach(function(d,i){
				firstDatasetLineChart.push(dataLC[i]);
			});

			var xScale = d3.scale.linear()
			    .domain([0, firstDatasetLineChart.length-1])
			    .range([0, width]);

			var yScale = d3.scale.linear()
			    .domain([0, d3.max(firstDatasetLineChart, function(d) { return d.values; })])
			    .range([height, 0]);
	
			var line = d3.svg.line()
			    .x(function(d, i) { return xScale(i); })
			    .y(function(d) { return yScale(d.values); });
	
			var svg = d3.select("#lineChart7")
				.append("svg")
			    .datum(firstDatasetLineChart)
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
			    // crear un grupo y moverlo para que se conserven los márgenes para los ejes y el título
			    
			var plot = svg
			    .append("g")
			    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
			    .attr("id", "lineChartPlot7");

				// titulos descriptivos - inicio 
			plot.append("text")
				.text(numFormat(firstDatasetLineChart[firstDatasetLineChart.length-1].values))
				.attr("id","lineChartTitle2")
				.attr("x",width/2)
				.attr("y",height/2);

			// titulos descriptivos - fin 			    
			plot.append("path")
			    .attr("class", "line")
			    .attr("d", line)	
			    // add color
				.attr("stroke", '#00FF5A');
	  
			plot.selectAll(".dot")
			    .data(firstDatasetLineChart)
			  	.enter()
			  	.append("circle")
			    .attr("class", "dot")
			    .attr("fill", function (d) { return d.values==d3.min(firstDatasetLineChart, function(d) { return d.values; }) ? "red" : (d.values==d3.max(firstDatasetLineChart, function(d) { return d.values; }) ? "green" : "white") } )
			    .attr("cx", line.x())
			    .attr("cy", line.y())
			    .attr("r", 3.5)
			    .attr("stroke", "lightgrey")
			    .append("title")
			    .text(function(d) { return d.key + ": " + numFormat(d.values); });

			svg.append("text")
				.text("Total entradas 2011-2015")
				.attr("id","lineChartTitle1")	
				.attr("x",margin.left + ((width + margin.right)/2))
				.attr("y", 25);
		});
	}

	dsLineChart7();

	function updateLineChart7(continente, colorChosen) {

		var currentDatasetLineChart = datasetLineChartChosen7(continente);   
		var basics = dsLineChartBasics();
		
		var margin = basics.margin,
			width = basics.width,
		   	height = basics.height;

	   	currentDatasetLineChart =d3.nest()
			.key(function(d) { return d.ANIO; })
			.rollup(function(v) { return {
    			count: v.length,
    			total: d3.sum(v, function(d) { return d.ENTRADAS; })
    		};})
			.entries(currentDatasetLineChart);
			console.log(JSON.stringify(currentDatasetLineChart));

		var xScale = d3.scale.linear()
		    .domain([0, currentDatasetLineChart.length-1])
		    .range([0, width]);

		var yScale = d3.scale.linear()
		    .domain([0, d3.max(currentDatasetLineChart, function(d) { return d.values.total; })])
		    .range([height, 0]);
		
		var line = d3.svg.line()
		    .x(function(d, i) { return xScale(i); })
		    .y(function(d) { return yScale(d.values.total); });

		var plot = d3.select("#lineChartPlot7")
	   		.datum(currentDatasetLineChart);
		   
		// titulos descriptivos - inicio 
		plot.select("text")
			.text(numFormat(currentDatasetLineChart[currentDatasetLineChart.length-1].values.total));
		// titulos descriptivos -  fin 
		   
		plot.select("path")
			.transition()
			.duration(750)			    
			.attr("class", "line")
			.attr("d", line)	
			// add color
			.attr("stroke", colorChosen);
		
		plot.selectAll(".dot").remove();
		plot.selectAll("title").remove();

		var path = plot
			.selectAll(".dot")
			.data(currentDatasetLineChart)
			.enter()
		  	.append("circle")
			// .transition()
			// .duration(750)
			.attr("class", "dot")
			.attr("fill", function (d) { return d.values.total==d3.min(currentDatasetLineChart, function(d) { return d.values.total; }) ? "red" : (d.values.total==d3.max(currentDatasetLineChart, function(d) { return d.values.total; }) ? "green" : "white") } )
			.attr("cx", line.x())
			.attr("cy", line.y())
			.attr("r", 3.5)
			// add color
			.attr("stroke", colorChosen)
			.append("title")
		    .text(function(d) { return d.key + ": " + numFormat(d.values.total); });  

	    var svg = d3.select("#lineChart7")
	    	.selectAll("#lineChartTitle1")
			.text(continente + " 2011-2015")
			.attr("id","lineChartTitle1")	
			.attr("x",margin.left + ((width + margin.right)/2))
			.attr("y", 25); 
	}

// ############# FIN LINE CHART ###################
