/*d3.csv("data.csv").then(data => {
	console.log(data);
});*/

const svg = d3.select("svg"); // select the svg in the DOM

const width = +svg.attr("width");
const height = +svg.attr("height");

const render = data => {
	const xValue = obj => obj.population;
	const yValue = obj => obj.country;
	const margin = {
		top: 20,
		right: 40,
		bottom: 20,
		left: 100
	};
	const innerWidth = width - margin.left - margin.right;
	const innerHeight = height - margin.top - margin.bottom;

	const xScale = d3.scaleLinear()
		.domain([0, d3.max(data, xValue)])
		.range([0, innerWidth]);

	const yScale = d3.scaleBand()
		.domain(data.map(yValue))
		.range([0, innerHeight])
		.padding(0.2);

	const xAxis = d3.axisBottom(xScale);
	const yAxis = d3.axisLeft(yScale);

	const group = svg.append("g")
		.attr("transform", `translate(${margin.left}, ${margin.top})`);

/*	xAxis(group.append("g"));
	yAxis(group.append("g"));*/
	group.append("g").call(yAxis);
	group.append("g").call(xAxis)
		.attr("transform", `translate(0, ${innerHeight})`);

	group.selectAll("rect").data(data)
		.enter().append("rect")
			.attr("y", obj => yScale(yValue(obj)))
			.attr("width", obj => xScale(xValue(obj)))
			.attr("height", yScale.bandwidth())
};

data.forEach(obj => {
	obj.population = +obj.population * 1000;
})
render(data)