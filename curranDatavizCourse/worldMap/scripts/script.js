const svg = d3.select("svg"); // select the svg in the DOM

const width = +svg.attr("width");
const height = +svg.attr("height");

const projection = d3.geoMercator()
	.center([5.116667, 52.17])
	.scale(6000)
	.translate([width/2, height/2]);
const pathGenerator = d3.geoPath().projection(projection);

const g = svg.append("g");
console.log(gemeenteData)
const provincies = topojson.feature(provinciedata, provinciedata.objects.provincie_2020);
const gemeentes = topojson.feature(gemeenteData, gemeenteData.objects.gemeente_2020);

renderMap(gemeentes)

svg.call(d3.zoom().on("zoom", ({transform}) => {
	
	g.attr("transform", transform)
}));

function renderMap(data) {
	g.selectAll("path")
	.data(data.features)
	.enter().append("path")
	.attr("d", pathGenerator)
	.append("title")
		.text(obj => obj.properties.statnaam)
}

