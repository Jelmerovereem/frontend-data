const svg = d3.select("svg"); // select the svg in the DOM

const url = "https://cartomap.github.io/nl/wgs84/gemeente_2020.topojson";

fetch(url)
.then(response => response.json())
.then((data) => {
	var stadData = topojson.feature(data, data.objects.gemeente_2020);
	document.querySelector(".loading").innerText = "";
	renderMap(stadData);
});

const width = +svg.attr("width");
const height = +svg.attr("height");

const projection = d3.geoMercator()
	.center([5.116667, 52.17])
	.scale(6000)
	.translate([width/2, height/2]);
const pathGenerator = d3.geoPath().projection(projection);

const group = svg.append("g");

svg.call(d3.zoom().on("zoom", ({transform}) => {
	group.attr("transform", transform);
}))

function renderMap(data) {
	console.log(data);
	group.selectAll("path")
	.data(data.features)
	.enter().append("path")
	.attr("d", pathGenerator)
	.append("title")
		.text(obj => obj.properties.statnaam)	
}



		//obj => obj.properties.statnaam

group.append("text")
		.attr("y", -10)
		.text("What is the best way to park in the city throughout the Netherlands?");

fetch('https://opendata.rdw.nl/resource/adw6-9hsg.json?$$app_token=zI34snM8XBhNRzxL50vrTeOLA')
.then(response => response.json())
.then((data) => {
	console.log(data);
});

let coordinatesArray = [];

fetch('https://opendata.rdw.nl/resource/nsk3-v9n7.json?$$app_token=zI34snM8XBhNRzxL50vrTeOLA')
.then(response => response.json())
.then((data) => {
	console.log(data);
	data.forEach((garage) => {
		//console.log(getCenterCoord(garage.areageometryastext))
		let coordinateObj;
		if (!Number.isNaN(getCenterCoord(garage.areageometryastext)[0]) || !Number.isNaN(getCenterCoord(garage.areageometryastext)[1])) {
			coordinateObj = {
				long: getCenterCoord(garage.areageometryastext)[0],
				lat: getCenterCoord(garage.areageometryastext)[1]
			}
			coordinatesArray.push(coordinateObj)
		} else if (getCenterCoord(garage.areageometryastext)[0] != undefined || getCenterCoord(garage.areageometryastext)[1] != undefined) {
			coordinateObj = {
				long: getCenterCoord(garage.areageometryastext)[0],
				lat: getCenterCoord(garage.areageometryastext)[1]
			}
			coordinatesArray.push(coordinateObj)
		}

		
				
	});
		
		renderPoints(coordinatesArray);
});

function renderPoints(coordinates) {
	console.log(coordinates)
/*	coordinates.forEach((coordinate) => {

	})*/
	/*group.selectAll("circle")
	.data(coordinates)
	.enter()
	.append("circle")
	.attr("r", 5)
	.attr("transform", (obj) => {
		console.log(obj.lat)
		return `translate(${projection([obj.long, obj.lat])})`;
	});*/
}

// from Stan Brankras  https://github.com/StanBankras/functional-programming/blob/56585a9b63601b68de3bcc3b26050b85ca05cf5e/utils.js#L36-L54

function replaceOccurences(string, replace, replaceBy) {
  return string.split(replace).join(replaceBy);
}

function replaceMultipleOccurences(string, replaceArray, replaceBy) {
  let replaceString = string;
  replaceArray.forEach((r) => replaceString = replaceOccurences(replaceString, r, replaceBy));
  return replaceString;
}

function isCoordInPolygon(centerCoord, polygons) {
  let zone = undefined;
  for(let i = 0;i < polygons.length;i++) {
    if(inside(centerCoord, polygons[i].polygon)) {
      zone = polygons[i].municipality; 
      break;
    }
  }
  return zone;
}

function getCenterCoord(coordinates) { 
  const type = coordinates.split(' ')[0];
  let longLat = replaceMultipleOccurences(coordinates, [type + ' (', '(', ')', ','], '').split(' ');
  if(type === 'POINT') {
    longLat = [ Number(longLat[0]), Number(longLat[1]) ];
  } else {
    let latTotal = 0;
    let longTotal = 0;

    longLat.forEach((x, index) => {
      if(index === 0 || index % 2 === 0) return longTotal += Number(x);
      return latTotal += Number(x);
    });

    longLat = [ longTotal / (longLat.length / 2), latTotal / (longLat.length / 2) ];
  }

  return longLat;
}