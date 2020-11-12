const svg = d3.select("svg"); // select the svg in the DOM

const width = +svg.attr("width");
const height = +svg.attr("height");

const render = data => {
	const xValue = obj => obj.population;
	const yValue = obj => obj.country;
	const margin = {
		top: 50,
		right: 40,
		bottom: 70,
		left: 150
	};
	const innerWidth = width - margin.left - margin.right;
	const innerHeight = height - margin.top - margin.bottom;

	const xScale = d3.scaleLinear()
		.domain([0, d3.max(data, xValue)])
		.range([0, innerWidth])
		.nice();

	const yScale = d3.scalePoint()
		.domain(data.map(yValue))
		.range([0, innerHeight])
		.padding(0.5);

	const xAxisTickFormat = number => d3.format(".3s")(number)
		.replace("G", "B"); 

	const xAxis = d3.axisBottom(xScale)
		.tickFormat(xAxisTickFormat)
		.tickSize(-innerHeight);

	const yAxis = d3.axisLeft(yScale)
		.tickSize(-innerWidth);

	const group = svg.append("g")
		.attr("transform", `translate(${margin.left}, ${margin.top})`);

	group.append("g").call(yAxis)
		d3.selectAll(".domain")
		.remove();
	const xAxisGroup = group.append("g").call(xAxis)
		.attr("transform", `translate(0, ${innerHeight})`);

	xAxisGroup
		d3.select(".domain")
		.remove();

	xAxisGroup.append("text")
		.attr("fill", "#635F5D")
		.attr("y", 60)
		.attr("x", innerWidth / 2)
		.text("Population in numbers")

	group.selectAll("circle").data(data)
		.enter().append("circle")
			.attr("cy", obj => yScale(yValue(obj)))
			.attr("cx", obj => xScale(xValue(obj)))
			.attr("r", 20);

	group.append("text")
		.attr("y", -10)
		.text("Top 10 most populated countries");
};

data.forEach(obj => {
	obj.population = +obj.population * 1000;
})
render(data)