const svg = d3.select("svg"); // select the svg in the DOM

fetch("https://geodata.nationaalgeoregister.nl/bag/wfs/v1_1?request=GetFeature&service=WFS&version=1.1.0&typeName=bag:woonplaats&outputFormat=application/json")
.then(response => response.json())
.then((data) => {
	var stadData = data;
	document.querySelector(".loading").innerText = "klaar, object in console";
	renderMap(stadData);
});

const width = +svg.attr("width");
const height = +svg.attr("height");

const projection = d3.geoMercator()
	.center([5.116667, 52.17])
	.scale(6000)
	.translate([width/2, height/2]);
const pathGenerator = d3.geoPath().projection(projection);

//const gemeentes = topojson.feature(gemeenteData, gemeenteData.objects.gemeente_2020);
//const provincies = topojson.feature(provinciedata, provinciedata.objects.provincie_2020);
//const steden = topojson.feature(stadData, stadData.objects.stadsgewest_2015);
//const wijken = topojson.feature(wijkData, wijkData.objects.wijk_2020);

//console.log(wijken.features[0].geometry.coordinates[0][0])

function renderMap(data) {
	console.log(data);
	/*svg.selectAll("path")
	.data(data.features)
	.enter().append("path")
	.attr("d", pathGenerator)
	.append("text")
		.text("hi")
		.attr("fill", "white")*/	
}



		//obj => obj.properties.statnaam

/*svg.selectAll("path")
	.data(gemeentes.features)
	.enter().append("path")
	.attr("d", pathGenerator)
	.append("text")
		.text(obj => obj.properties.statnaam)*/