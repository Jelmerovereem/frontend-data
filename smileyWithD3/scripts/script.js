const svg = d3.select("svg");
const arc = d3.arc();


const height = +svg.attr("height");
const width = +svg.attr("width");

const g = svg
	.append("g")
		.attr("transform", `translate(${width / 2}, ${height / 2})`)

const circle = g
	.append("circle")
		.attr("r", height / 2)
		.attr("fill", "yellow")
		.attr("stroke", "black");

const eyeSpacing = 100;
const eyeYOffSet = -70;
const eyeRadius = 30;
const eyebrowWidth = 70;
const eyebrowHeight = 15;
const eyebrowYOffset = -70;

const eyesG = g
	.append("g")
		.attr("transform", `translate(0, ${eyeYOffSet})`)
		.attr("fill", "black");

const leftEye = eyesG
	.append("circle")
		.attr("r", eyeRadius)
		.attr("cx", -eyeSpacing);

const rightEye = eyesG
	.append("circle")
		.attr("r", eyeRadius)
		.attr("cx", eyeSpacing);

const eyeBrowsG = eyesG
	.append("g")
		.attr("transform", `translate(0, ${eyebrowYOffset})`);

eyeBrowsG
	.transition().duration(2000)
		.attr("transform", `translate(0, ${eyebrowYOffset - 50})`)
	.transition().duration(2000)
		.attr("transform", `translate(0, ${eyebrowYOffset})`);

const leftEyeBrow = eyeBrowsG
	.append("rect")
		.attr("x", -eyeSpacing - eyebrowWidth / 2)
		.attr("width", eyebrowWidth)
		.attr("height", eyebrowHeight);

const rightEyeBrow = eyeBrowsG
	.append("rect")
		.attr("x", eyeSpacing - eyebrowWidth / 2)
		.attr("width", eyebrowWidth)
		.attr("height", eyebrowHeight)

const mouth = g.append("path")
	.attr("d", arc({
		innerRadius: 0,
		outerRadius: 150,
		startAngle: Math.PI / 2,
		endAngle: Math.PI * 3 / 2
}))