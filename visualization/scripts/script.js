const svg = d3.select("svg"); // select the svg in the DOM

const dropdown = document.querySelector(".variable-dropdown");

const url = "https://cartomap.github.io/nl/wgs84/gemeente_2020.topojson"; // the geodata for the map

fetch(url)
.then(response => response.json())
.then((data) => {
	var stadData = topojson.feature(data, data.objects.gemeente_2020); // Curran dataviz https://www.youtube.com/watch?v=Qw6uAg3EO64&list=PL9yYRbwpkykvOXrZumtZWbuaXWHvjD8gi&index=15
	document.querySelector(".loading").innerText = "";
	renderMap(stadData);
});

const width = +svg.attr("width");
const height = +svg.attr("height");

const projection = d3.geoMercator()
	.center([5.116667, 52.17]) // https://github.com/mbergevoet/frontend-data/blob/master/frontend-data/index.js#L61
	.scale(6000)
	.translate([width/2, height/2]); // center the map based on the width and height from the svg element
const pathGenerator = d3.geoPath().projection(projection);

const group = svg.append("g");

svg.call(d3.zoom().on("zoom", ({transform}) => {
	group.attr("transform", transform);
	if (transform.k <= 2) {
		group.selectAll("circle")
		.transition()
			.duration(500)
			.attr("r", 4)
	} else if (transform.k >2 && transform.k <= 4) {
		group.selectAll("circle")
		.transition()
			.duration(500)
			.attr("r", 2)
	} else if (transform.k > 4 && transform.k <= 10) {
		group.selectAll("circle")
		.transition()
			.duration(500)
			.attr("r", 0.5)	
	} else if (transform.k > 10 && transform.k <= 30) {
		group.selectAll("circle")
		.transition()
			.duration(500)
			.attr("r", 0.3)
	} else if (transform.k > 30 ) {
		group.selectAll("circle")
		.transition()
			.duration(500)
			.attr("r", 0.1)
	}
}))

function renderMap(data) {
	/* Create the base map */
	group.selectAll("path")
	.data(data.features)
	.enter()
	.append("path")
	.attr("d", pathGenerator)
	
	/* Add the "gemeente" names */
	group.selectAll("text") //https://stackoverflow.com/questions/13897534/add-names-of-the-states-to-a-map-in-d3-js
	.data(data.features)
	.enter()
	.append("svg:text")
		.text(obj => obj.properties.statnaam)
		.attr("fill", "white")
		.attr("x", (d) => {return pathGenerator.centroid(d)[0]})
		.attr("y", (d) => {return pathGenerator.centroid(d)[1]})
		.attr("text-anchor", "middle")
		.attr("font-size", "1pt")

	/* Add title tooltip */
	group.selectAll("path")
	.append("title")
		.text(obj => obj.properties.statnaam)	
}


let garageData;

fetch('https://opendata.rdw.nl/resource/adw6-9hsg.json?$limit=8352&$$app_token=zI34snM8XBhNRzxL50vrTeOLA')
.then(response => response.json())
.then((data) => {
	garageData = data;
});

let capacityData;

fetch('https://opendata.rdw.nl/resource/b3us-f26s.json?$limit=1567&$$app_token=zI34snM8XBhNRzxL50vrTeOLA')
.then(response => response.json())
.then((data) => {
	capacityData = data;
})

let coordinatesArray = [];

let garageLocatieData;

fetch('https://opendata.rdw.nl/resource/nsk3-v9n7.json?$limit=6101&$$app_token=zI34snM8XBhNRzxL50vrTeOLA')
.then(response => response.json())
.then((data) => {
	data.forEach((garage) => {
		let coordinateObj;
		if (garage.areageometryastext != "" && garage.areageometryastext != undefined) {
			if (!Number.isNaN(getCenterCoord(garage.areageometryastext)[0]) || !Number.isNaN(getCenterCoord(garage.areageometryastext)[1])) {
			coordinateObj = {
				areaId: garage.areaid,
				long: getCenterCoord(garage.areageometryastext)[0],
				lat: getCenterCoord(garage.areageometryastext)[1]
			}
			coordinatesArray.push(coordinateObj)
		}
		}			
	});
});

setTimeout(() => {
	combineData(garageData, coordinatesArray, capacityData);
}, 3000)

function checkOption(variableData, garagesData) {
	if (variableData.length > 2000) {
		//paid/free dropdown chosen
		garagesData.forEach((garage) => {
			var paidObj = variableData.find(obj => {
				return obj.areaid === garage.areaId;
			})
			if (paidObj === undefined || paidObj.usageid === undefined) {
				garage.paid = "onbekend";
			} else {
				garage.paid = paidObj.usageid;
			}
		})
	} else {
		//capacity dropdown chosen
		garagesData.forEach((garage) => {
			var capacityObj = variableData.find(obj => {
				return obj.areaid === garage.areaId
			})
			if (capacityObj === undefined || capacityObj.capacity === undefined) {
				garage.capacity = "onbekend";	
			} else {
				garage.capacity = capacityObj.capacity;
			}			
		})
	}

	return garagesData;
}

function combineData(garageData, garageLocatieData, variableData) {
	let outcomeData = [];
	// add garage names to objects
		garageLocatieData.forEach((garage) => {
			var result = garageData.find(obj => {
				return obj.areaid === garage.areaId;
			});
			if (result === undefined ) {
				var garageObj = {
					areaId: garage.areaId,
					long: garage.long,
					lat: garage.lat,
					areaDesc: "onbekend"
				}
			} else {
				var garageObj = {
					areaId: garage.areaId,
					long: garage.long,
					lat: garage.lat,
					areaDesc: result.areadesc
				}
			}
			outcomeData.push(garageObj);
		});

	outcomeData = checkOption(variableData, outcomeData);
	
	renderPoints(outcomeData)
}

const tooltip = document.querySelector(".tooltip");

function renderPoints(coordinates) {
	let circle = group.selectAll("circle");

	circle
		.data(coordinates, d => d.areaId)
		.join(
			enter => enter.append("circle")
				.attr("r", 4)
				.attr("transform", (obj) => {
					return `translate(${projection([obj.long, obj.lat])})`
				})
				.attr("fill", (obj) => {
					if (dropdown.value === "paid/free") {
						if (/VERGUNNING|VERGUNP|VERGUN-ALG|VERGUN-MV/.test(obj.paid)) {
							return "red"
						} else if (/BETAALDP|GARAGEP/.test(obj.paid)) {
							return "orange"
						} else if (/onbekend/.test(obj.paid)) {
							return "grey"
						} else {
							return "green"
						}
					} else if (dropdown.value === "capacity") {
						if (obj.capacity <= 600) {
							return "red"
						} else if (obj.capacity > 600 && obj.capacity <= 1000) {
							return "orange"
						} else if (obj.capacity > 1000) {
							return "green"
						} else {
							return "grey"
						}
					}
				})
				.attr("opacity", (d) => {
					if (dropdown.value === "paid/free") {
						if (/onbekend/.test(d.paid)) {
							return .1
						} else {
							return 1
						}
					} else if (dropdown.value === "capacity") {
						if (d.capacity === "onbekend") {
							return .1
						} else {
							return 1
						}
					}
				}),
				exit => exit
					.attr("fill", "white")
					.call(exit => exit.transition().duration(500)
						.attr("opacity", 0)
						.remove())			
			)
		addTooltip()
	
}

function addTooltip() {
	group.selectAll("circle").on("mouseover", (event, obj) => {
		tooltip.innerHTML = obj.areaDesc + "<br>";
		if (obj.paid === undefined) {
			tooltip.innerHTML += "capacity: " + obj.capacity;	
		} else {
			tooltip.innerHTML += "Paid/free: " + obj.paid;	
		}
		tooltip.style.left = (event.pageX) + "px";
		tooltip.style.top = (event.pageY + 10) + "px";
		tooltip.classList.add("focus");
		tooltip.style.opacity = "1";		
	})
	.on("mouseout", () => {
		tooltip.style.opacity = "0";
	});
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

function updateData() {
	const variable = this.value;
	if (variable === "capacity") {
		document.querySelector(".first").innerText = "0";
		document.querySelector(".last").innerText = "1700";
		combineData(garageData, coordinatesArray, capacityData);
	} else if (variable === "paid/free") {
		document.querySelector(".first").innerText = "Betalen";
		document.querySelector(".last").innerText = "Gratis";
		fetch('https://opendata.rdw.nl/resource/adw6-9hsg.json?$limit=8352&$$app_token=zI34snM8XBhNRzxL50vrTeOLA')
		.then(response => response.json())
		.then((paidData) => {
			combineData(garageData, coordinatesArray, paidData)
		})
	}
}

dropdown.addEventListener("change", updateData);