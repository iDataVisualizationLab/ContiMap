function plotHeatmap(theGroup, heatmapData, width, height, onPlotHeatmapComplete) {

    let timeSteps = heatmapData.timeSteps,
        machines = heatmapData.machines,
        data = heatmapData.data,
        colorScale = heatmapData.colorScale,
        thresholds = heatmapData.thresholds;
    let cellWidth = width / timeSteps.length,
        cellHeight = height / machines.length;

    //Draw the cells.
    machines.forEach((machine, mcI) => {
        timeSteps.forEach((timeStep, tsI) => {
            let value = data[mcI][tsI];
            if (value !== undefined && value !== null) {
                debugger
                theGroup.append('rect')
                    .attr("x", tsI * cellWidth)
                    .attr("y", mcI * cellHeight)
                    .attr("width", cellWidth)
                    .attr("height", cellHeight)
                    .attr("stroke", 'black')
                    .attr('stroke-width', 0.1)
                    .attr("fill", colorScale(valueToThreshold(value)));
            }
        });
    });

    // drawYAxis(theGroup, machines, width, height);

    function valueToThreshold(value) {
        return thresholds[d3.bisectLeft(thresholds, value) - 1];
    }
}

function plotContour(theGroup, data, width, height, onPlotContourComplete, fisheyeX, fisheyeY) {

    let scaleX = data.scaleX;
    let scaleY = data.scaleY;
    let colorScale = data.colorScale;
    let contours = data.contours;

    //Building the path
    // var path = d3.geoPath().projection(scale(scaleX, scaleY, fisheyeX, fisheyeY));
    var path = d3.geoPath().projection(scale(scaleX, scaleY, fisheyeX, fisheyeY));
    theGroup.selectAll("path").data(contours).join("path").attr("d", path)
        .attr("fill", d => colorScale(d.value));

    //Draw the y axis
    drawYAxis(theGroup, data.y, width, height, fisheyeY);
    //Draw one line at the end.
    // //Todo: This might overwrite the first element of the next variable
    // theGroup.append('line').attr('x1', 0).attr("y1", height).attr("x2", width).attr('y2', height)
    //     .attr("stroke-width", 1).attr("stroke", 'black');
    onPlotContourComplete(data.variable);
}

function scale(scaleX, scaleY, fisheyeX, fisheyeY) {
    return d3.geoTransform({
        point: function (x, y) {
            if (fisheyeX && fisheyeY) {
                this.stream.point(fisheyeX(x * scaleX), fisheyeY(y * scaleY));
            } else {
                this.stream.point(x * scaleX, y * scaleY);
            }
        }
    });
}

function drawTimeLine(timeSteps, timeLineWidth, timeLineHeight, fisheyeX) {
    let xScale = d3.scaleLinear().domain(d3.extent(timeSteps)).range([0, timeLineWidth - margins.left - margins.right]);
    let timeStepData = [];
    let minDistance = 60;
    let prevX = 0;
    let x;
    //Todo: We may need to spread from the center to two other ways=> since using this may not guarantee the one in the current mouse is displayed.
    timeSteps.forEach(ts => {
        x = fisheyeX ? fisheyeX(xScale(ts)) : xScale(ts);
        if (x - prevX >= minDistance) {
            timeStepData.push({x: x, tick: ts});
            prevX = x;
        }
    });
    let timeLineG = d3.select("#timeLineG");
    let tickSelection = timeLineG.selectAll('.tickG').data(timeStepData, d => d.tick);
    let enterGroups = tickSelection.enter().append('g').attr('class', 'tickG');
    enterGroups.append('line').attr('stroke', 'black').attr("stroke-width", 1).attr('y2', -9);
    enterGroups.append('text').text(d => {
        if(typeof (START_DATE) === 'undefined' || typeof (FORMAT_STR)==='undefined' || typeof (STEP) === 'undefined'){
            return d.tick;
        }else{
            return timeStampToDate(d.tick);
        }
    }).attr("text-anchor", 'middle').attr('y', '-1em');
    tickSelection.exit().remove();
    //Merge then Update
    tickSelection.merge(enterGroups).attr("transform", d => `translate(${d.x}, 0)`);
}

function drawYAxis(theGroup, machines, contourWidth, yAxisHeight, fisheyeY) {
    let yScale = d3.scaleBand().domain(machines).range([0, yAxisHeight]).paddingInner(0);
    let machineData = [];
    let minDistance = 30;
    let prevY = 0;
    let y;
    machines.forEach(mc => {
        y = fisheyeY ? fisheyeY(yScale(mc)) : yScale(mc);
        if (y - prevY >= minDistance) {
            machineData.push({y: y, tick: mc});
            prevY = y;
        }
    });

    let yAxisG = theGroup.selectAll('.yAxis').data([true]).join('g').attr('class', 'yAxis').attr("transform", `translate(0, 0)`);
    let tickSelection = yAxisG.selectAll('.tickG').data(machineData, d => d.tick);
    let enterGroups = tickSelection.enter().append('g').attr('class', 'tickG');
    enterGroups.append('line').attr('stroke', 'black').attr("stroke-width", 1).attr('x2', -9);
    enterGroups.append('text').text(d => d.tick).attr('text-anchor', 'end').attr('alignment-baseline', 'middle').attr("x", -12);
    tickSelection.exit().remove();
    //Merge then update
    tickSelection.merge(enterGroups).attr('transform', d => `translate(0, ${d.y})`);
}