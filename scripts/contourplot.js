const allContours = [];
let allColorScales = {};

function plotContour(theGroup, data, width, height, onPlotContourComplete) {
    let thresholds = data.thresholds;
    let colors = data.colors;
    let colorScale = d3.scaleOrdinal().domain(thresholds).range(colors);
    allColorScales[data.variable] = colorScale;
    let contours = d3.contours().thresholds(thresholds).size([data.z[0].length, data.z.length]).smooth(smooth)(data.z.flat());
    //This section store the contours for area calculation later-on.
    contours.forEach((ct, i) => {
            let dt = {
                variable: data.variable,
                layerIndex: i,
                coordinates: ct.coordinates,
                layerValue: ct.value
            }
            allContours.push(dt);
        }
    );

    function scale(scaleX, scaleY) {
        return d3.geoTransform({
            point: function (x, y) {
                this.stream.point(x * scaleX, y * scaleY);
            }
        });
    }

    let scaleX = width / data.z[0].length;
    let scaleY = height / data.z.length;
    //Buidling the path
    var path = d3.geoPath().projection(scale(scaleX, scaleY, width, height));

    theGroup.selectAll("path").data(contours).enter().append("path").attr("d", path)
        .attr("fill", d => colorScale(d.value));
    //Draw the y axis
    drawYAxis(theGroup, data.y, width, height);
    //Draw one line at the end.
    //Todo: This might overwrite the first element of the next variable
    theGroup.append('line').attr('x1', 0).attr("y1", height).attr("x2", width).attr('y2', height)
        .attr("stroke-width", 1).attr("stroke", 'black');
    onPlotContourComplete(data.theVar);
}

function drawTimeLine(theDiv, timeSteps, timeLineWidth, timeLineHeight) {
    let svg = d3.select(`#${theDiv}`).append("svg").attr('width', timeLineWidth).attr('height', timeLineHeight);
    //Add a rect for the background
    svg.append("rect").attr("x", 0).attr("y", 0).attr("width", timeLineWidth).attr("height", timeLineHeight).attr("fill", "white");
    let mainSvg = svg.append('g').attr("transform", `translate(${margins.left}, ${timeLineHeight - 1})`);
    let xScale = d3.scaleLinear().domain(d3.extent(timeSteps)).range([0, timeLineWidth-margins.left - margins.right]);
    let xAxis = d3.axisTop().scale(xScale);
    mainSvg.call(xAxis);
}

function drawYAxis(theGroup, order, contourWidth, yAxisHeight) {
    let yAxisGroup = theGroup.append("g").attr("transform", `translate(${contourWidth}, 0)`);
    //Re-sampling the nodes
    let tickHeight = 20;
    let jump = Math.ceil(tickHeight/pixelsPerRow);
    let sampledElements = [];
    for (let i = 0; i < order.length; i+=jump) {
        sampledElements.push(order[i]);
    }

    let yScale = d3.scaleBand().domain(sampledElements).range([0, yAxisHeight]).paddingInner(0);
    let yAxis = d3.axisRight().scale(yScale);
    yAxisGroup.call(yAxis);
}