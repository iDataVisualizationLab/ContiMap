let marginBottom = 50;

/**Read the notes for the architecture of this main**/
const colorSchemes = {
    "CPU1 Temp": d3.interpolateReds,
    // "CPU1 Temp": d3.interpolateSpectral,
    "Fan1 speed": d3.interpolateBlues,
    "Power consumption": d3.interpolateGreens,
    "Memory usage": d3.interpolateGreens,
    // "cpu_util_percent": d3.interpolateReds,
    "cpu_util_percent": d3.interpolateSpectral,
    "mem_util_percent": d3.interpolateBlues,
    "disk_io_percent": d3.interpolateGreens,
    "-1": d3.interpolateReds,
    "-2": d3.interpolateBlues,
    "1": d3.interpolateGreens,

    /*Color scheme for solar flare*/
    'TOTUSJH': d3.interpolateSpectral,
    'TOTUSJZ': d3.interpolateSpectral,
    'USFLUX': d3.interpolateSpectral,
    'R_VALUE': d3.interpolateSpectral,
    'TOTBSQ': d3.interpolateSpectral,
    'MEANJZH': d3.interpolateSpectral,
    'MEANALP': d3.interpolateSpectral,
    'SAVNCPP': d3.interpolateSpectral,
    'EPSX': d3.interpolateSpectral,
    'EPSY': d3.interpolateSpectral,
    'TOTPOT': d3.interpolateSpectral,
    'EPSZ': d3.interpolateSpectral,
    'GENE_FOLD_LOG2': d3.interpolateSpectral,
    'GENE_FOLD': d3.interpolateSpectral,
    'GENE_VALUE_NORMALIZED': d3.interpolateSpectral,
    'GENE_VALUE_AVERAGED_NORMALIZED': d3.interpolateSpectral,
};
//Info div
let settingDiv = document.getElementById('settingDiv');
let calculationTbl = document.getElementById('calculationTbl');
let settingTblStr = createTableStr([[{innerHTML: 'Number of neighbors (k)'}, {innerHTML: NUM_OF_NEIGHBORS}]]);
addInfoHTML(settingDiv, settingTblStr);

//Time records
let startTime = new Date(),
    donePreprocess, doneResampling, doneSimilarityCalc, doneOrdering;

/**
 * data should be in the format of {machine_id: , time_stamp: , variable1: , variable2: ...}
 * Should go to constant.js to change these field names correspondingly.
 */
let labelFormat = function (d) {
    if (typeof (START_DATE) === 'undefined' || typeof (FORMAT_STR) === 'undefined' || typeof (STEP) === 'undefined') {
        return d.tick;
    } else {
        return timeStampToDate(d.tick);
    }
};
let timeLineSettings = {
    'tickLabelFormat': labelFormat,
    minDistance: 60,
};

function drawHeatMap(div, data, settings) {

}

async function main() {
    let targets;
    let upregulated;
    let downregulated;
    let updownregulated;

    if (FILE_TYPE === "genes") {
        timeLineSettings.tickLabelFormat = tickLabelFormatGene;
        timeLineSettings.minDistance = 0;
        timeLineSettings.textAnchor = "start";
        timeLineSettings.labelMarginBottom = -10;
        timeLineSettings.labelMarginLeft = 10;
        await d3.csv('data/STOP1_targets.csv').then(data => {
            targets = data.map(d => d['target.at_id']);
        });
        await d3.csv('data/Targets_differentially_expressed.csv').then(data => {
            upregulated = data.map(d => d['TARGETS|upregulated']).filter(d => d !== "");
            downregulated = data.map(d => d['TARGETS|downregulated']).filter(d => d !== "");
            updownregulated = data.map(d => d['TARGETS|up|down']).filter(d => d !== "");
        });
    }

    d3.json('data/' + FILE_NAME).then(data => {
        if (FILE_TYPE === "genes") {
            //Filter zero base or treatment
            // data = data.filter(d => d.base_value !== 0 && d.treatment_value !== 0);

            // Filter for the target only.
            if (targets) {
                data = data.filter(d => targets.indexOf(d[FIELD_MACHINE_ID]) >= 0);
            }

            // //Filter upregulated
            // if (upregulated) {
            //     data = data.filter(d => upregulated.indexOf(d[FIELD_MACHINE_ID]) >= 0);
            // }

            // //Filter downregulated
            // if (downregulated) {
            //     data = data.filter(d => downregulated.indexOf(d[FIELD_MACHINE_ID]) >= 0);
            // }

            // //Filter downregulated
            // if (updownregulated) {
            //     data = data.filter(d => updownregulated.indexOf(d[FIELD_MACHINE_ID]) >= 0);
            // }
        }

        const nestedByMachines = d3.nest().key(d => d[FIELD_MACHINE_ID]).entries(data);

        if (FILE_TYPE === "alibaba") {
            //Calculate the max cpu usage
            nestedByMachines.forEach(mc => {
                mc.values.max_cpu_util_percent = d3.max(mc.values.map(d => d[VARIABLES[0]]));
            });
            //TODO: Should do this filer out currently disable for time measurement
            let filteredOutMachines = nestedByMachines.filter(m => m.values.max_cpu_util_percent <= 60).map(m => m.key);
            //Filter the data
            data = data.filter(d => filteredOutMachines.indexOf(d[FIELD_MACHINE_ID]) < 0);
        }

        //Sort the data by time_stamp
        data.sort((a, b) => a[FIELD_TIME_STAMP] - b[FIELD_TIME_STAMP]);
        const timeSteps = Array.from(new Set(data.map(d => d[FIELD_TIME_STAMP])));
        const machines = Array.from(new Set(data.map(d => "" + d[FIELD_MACHINE_ID])));//Convert to string to use the autocomplete search box.
        //Add autocomplete box to search for
        // //This section is to set the autocomplete word
        autocomplete(document.getElementById("theWord"), machines, (theTextField) => {
            //TODO
        });

        let orders = [];

        //Get the size and set the sizes

        // width = Math.max(Math.round(window.innerWidth * 1 / 3), timeSteps.length);
        width = document.getElementById("main-part").getBoundingClientRect().width - margins.left - margins.right;
        // width = 300;

        height = (Math.min(window.innerHeight, machines.length * VARIABLES.length) - timeLineHeight - marginBottom) / (VARIABLES.length); //-10 is for bottom margin.
        if (FILE_TYPE === "alibaba") {
            height = machines.length * 2;
        } else if (FILE_TYPE === "solarflares") {
            height = machines.length;
        } else if (FILE_TYPE === "genes") {
            height = machines.length * 2;
        }


        pixelsPerColumn = Math.ceil(width / timeSteps.length);
        //TODO: Note: This is used for sampling of the ticks => may need to check this. When we change the number of rows to be smaller than number of machines (less than a pixel per row)
        // pixelsPerRow = Math.ceil(height / machines.length);


        //We need to make sure that the width is divisible by the timeSteps, and height is divisible by machines
        // width = pixelsPerColumn * timeSteps.length;
        // height = pixelsPerRow * machines.length;


        fisheyeX = fisheye.scale(d3.scaleIdentity).domain([0, width]).focus(width / 2);
        fisheyeY = fisheye.scale(d3.scaleIdentity).domain([0, height]).focus(height / 2);

        svgWidth = width + margins.left + margins.right;
        svgHeight = VARIABLES.length * height + margins.top + margins.bottom;
        //Now we can draw the timeLine.

        let timeLineWidth = svgWidth;
        //Add the SVG for the timeline
        let timeLineSvg = d3.select('#timeLineDiv').append("svg").attr('width', timeLineWidth).attr('height', timeLineHeight);
        //Add a rect for the background
        timeLineSvg.append("rect").attr("x", 0).attr("y", 0).attr("width", timeLineWidth).attr("height", timeLineHeight).attr("fill", "white");
        //Add a line at the bottom
        timeLineSvg.append('line').attr('x1', 0).attr('y1', timeLineHeight - 1).attr('x2', timeLineWidth).attr('y2', timeLineHeight - 1)
            .attr('stroke', 'black').attr('stroke-width', 1);
        //Add a group to display the timeline to
        timeLineSvg.append("g").attr("id", "timeLineG").attr("transform", `translate(${margins.left}, ${timeLineHeight - 1})`);//-1 is for the bottom line
        timeLineSettings.timeLineWidth = timeLineWidth;
        timeLineSettings.timeLineHeight = timeLineHeight;
        timeLineSettings.fisheyeX = undefined;
        drawTimeLine(timeSteps, timeLineSettings);


        //Add svg and the groups for the contour plots of the variables.
        let mainSvg = d3.select(`#contourDiv`).append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight);
        let mainGroup = mainSvg
            .append("g").attr("transform", `translate(${margins.left},${margins.top})`);
        //Add the groups
        mainGroup.selectAll('.contourPlot').data(VARIABLES).enter().append("g")
            .attr('class', 'contourPlot').attr('id', (d, i) => `contourPlot${i}`)
            .attr("transform", (d, i) => `translate(0, ${i * height})`);
        //Add labels for the groups
        mainGroup.selectAll('.contourPlotVariable').data(VARIABLES).enter().append("g")
            .attr('class', 'contourPlotVariable').attr('id', (d, i) => `contourPlotVariable${i}`)
            .attr("transform", (d, i) => `translate(0, ${i * height})`).append('text').text(d => d).attr("dy", '1.2em').attr('dx', '0.5em');
        //Display number of machines
        addInfoRow(calculationTbl, [{innerHTML: 'Machines'}, {
            innerHTML: machines.length,
            styles: [{key: 'textAlign', value: 'right'}]
        }]);
        //Display number of time-steps
        addInfoRow(calculationTbl, [{innerHTML: 'Time-steps'}, {
            innerHTML: timeSteps.length,
            styles: [{key: 'textAlign', value: 'right'}]
        }]);
        //Sort the machines so we can gurantee the naming order from source to target (source always < target)
        machines.sort();


        //Convert into object for faster accessing.
        const machineTimeObject = _.object(nestedByMachines.map(d => [d.key, d.values]));

        //For time logging purpose.
        donePreprocess = new Date();
        addInfoRow(calculationTbl, [{innerHTML: 'Pre-processing'}, {
            innerHTML: (donePreprocess - startTime) + "ms",
            styles: [{key: 'textAlign', value: 'right'}]
        }]);

        //TODO: This section skip resampling since heavy data sending back and forth data to worker is slow.
        if (FILE_TYPE === "genes" || FILE_TYPE === "solarflares") {
            onCompleteResampling(machineTimeObject);
        } else {
            //Resample the data.
            let resampleParts = [];
            for (let i = 0; i < maxWorkers; i++) {
                resampleParts.push([]);
            }

            let resampleCounter = 0;
            //Split the data
            for (let i = 0; i < machines.length; i++) {
                //For the other just resample without having to check the condition.
                resampleParts[resampleCounter % maxWorkers].push(machineTimeObject[machines[i]]);
                resampleCounter++;
            }

            //Start workers
            let resampleResultCounter = 0;
            resampleParts.forEach((part, i) => {
                startWorker(resamplingWorkerPath, {
                    'timeSteps': timeSteps,
                    'part': part
                }, onResamplingResult, i);
            });

            function onResamplingResult(results) {
                resampleResultCounter += 1;
                results.forEach(machineTs => {
                    machineTimeObject[machineTs[0][FIELD_MACHINE_ID]] = machineTs;
                });
                if (resampleResultCounter === resampleParts.length) {
                    resetWorkers();
                    onCompleteResampling(machineTimeObject);
                    //Done re-sampling
                    doneResampling = new Date();
                    addInfoRow(calculationTbl, [{innerHTML: 'Done resampling'}, {
                        innerHTML: numberWithCommas(doneResampling - donePreprocess) + 'ms',
                        styles: [{key: 'textAlign', value: 'right'}]
                    }]);
                }
            }

        }


        function onCompleteResampling(machineTimeObject) {
            //Process all the rSqared
            let similarityResults = [];
            let similarityParts = [];
            for (let i = 0; i < maxWorkers; i++) {
                similarityParts.push([]);
            }
            let similarityCounter = 0;

            /**This is one to n others**/
            //<editor-fold desc="This is one to n others">
            //Add average value to the machineTimeObj
            orders = VARIABLES.map(v => {
                //Avg variable name
                let avgV = 'avg' + v;
                //Add average value
                debugger
                d3.keys(machineTimeObject).forEach(mc => {
                    if (typeof ORDER_AVERAGE_STEPS !== "undefined" && ORDER_AVERAGE_STEPS.length > 0) {
                        let theStepValues = ORDER_AVERAGE_STEPS.map(step => {
                            return machineTimeObject[mc][step][v];
                        });
                        machineTimeObject[mc][avgV] = d3.mean(theStepValues);
                    } else {
                        machineTimeObject[mc][avgV] = d3.mean(machineTimeObject[mc].map(d => d[v]));
                    }
                });
                //Copy
                let vOrder = machines.slice();
                vOrder.sort((a, b) => machineTimeObject[a][avgV] - machineTimeObject[b][avgV]);
                return vOrder;
            });

            if (typeof ORDER_AVERAGE_ONLY !== "undefined" && ORDER_AVERAGE_ONLY) {
                //Skip calculation for links to be calculated
                //Skip similarity calculation
                //Skip ordering
                let totalDraws = VARIABLES.length;
                let drawingResultCounter = 0;
                orders.forEach((order, i) => {
                    let orderResults = {
                        variable: VARIABLES[i],
                        order: order,
                    }
                    processOrder(orderResults, drawingResultCounter, totalDraws);
                });
                return;//Skip all the rest
            }


            //Get the links to be calculated
            let linksToBeCalculated = {};
            VARIABLES.forEach((v, i) => {
                //For all prev => add its next n.
                let mcLength = orders[i].length;
                for (let j = 0; j < mcLength; j++) {
                    let keyJ = orders[i][j];
                    let valuesJ = machineTimeObject[keyJ];
                    for (let k = 1; k <= NUM_OF_NEIGHBORS; k++) {
                        if (j + k < mcLength) {
                            let keyK = orders[i][j + k];
                            let key = (keyJ < keyK) ? keyJ + "," + keyK : keyK + "," + keyJ;
                            //If not exists yet in the links to be calculated then add
                            if (!linksToBeCalculated[key]) {
                                linksToBeCalculated[key] = {};//This is just a dummy object to check if exists or not condition => we don't need to store value for this.
                                let valuesK = machineTimeObject[keyK];
                                let sd = {x1: valuesJ, x2: valuesK};
                                similarityParts[similarityCounter % maxWorkers].push(sd);
                                similarityCounter++;
                            }
                        }
                    }
                }
            });
            //</editor-fold>
            /**End of n others section**/

            let similarityResultCounter = 0;
            //Now start a worker for each of the part
            similarityParts.forEach((part, i) => {
                startWorker(similarityWorkerPath, part, onSimilarityResult, i);
            });

            function onSimilarityResult(evt) {
                similarityResultCounter += 1;
                similarityResults = similarityResults.concat(evt);
                if (similarityResultCounter === similarityParts.length) {
                    resetWorkers();
                    onCompleteSimilarityCal(similarityResults);

                    doneSimilarityCalc = new Date();
                    addInfoRow(calculationTbl, [{innerHTML: 'Done similarity calculation'}, {
                        innerHTML: numberWithCommas(doneSimilarityCalc - doneResampling) + 'ms',
                        styles: [{key: 'textAlign', value: 'right'}]
                    }]);
                }
            }

        }

        function processOrder(orderResults, drawingResultCounter, totalDraws) {
            let theVar = orderResults.variable;
            let startDrawing = new Date();

            let theGroup = d3.select(`#contourPlot${VARIABLES.indexOf(theVar)}`);
            let order = orderResults.order;
            // // TODO: Shuffle => to generate graphics for the paper only.
            // function shuffle(array) {
            //     array.sort(() => Math.random() - 0.5);
            // }
            // shuffle(order);

            //Building the data
            let y = order;
            let z = [];
            order.forEach(machine => {
                z.push(machineTimeObject[machine].map(st => st[theVar]));
            });
            let flatZ = z.flat();
            let x = flatZ.map(d => (d === NULL_VALUE) ? undefined : d);
            let min = d3.min(x);
            let max = d3.max(x);
            let numOfRanges = 5;
            let range = (max - min) / numOfRanges;
            // //TODO: This is specific for HPCC.
            // //["CPU1 Temp", "Fan1 speed", "Power consumption"]
            // //CPU usage [3 corresponds to 0 and 98 corresponds to 1.0] => Celcius
            // //Fan speed min max [1050 corresponds to 0 and 17850 corresponds to 1.0] => rpm
            // //Power consumption  [0 corresponds to , 200] => Watts
            //
            // let thesholdRange = [];
            // if (theVar === "CPU1 Temp") {
            //     thesholdRange = [0, 85];
            // } else if (theVar === "Fan1 speed") {
            //     thesholdRange = [1050, 14000];
            // } else if (theVar === "Power consumption") {
            //     thesholdRange = [0, 110];
            // }
            // let percents = [0, .25, .5, .75, 1.0];
            // let thresholScale = d3.scaleLinear().domain([0, 1]).range(thesholdRange).clamp(false);
            // let thresholds = percents.map(p => thresholScale(p));


            //TODO: Enable the following lines for other cases.
            let thresholds = [];
            for (let i = 0; i < numOfRanges; i++) {
                thresholds.push(min + i * range);
            }

            let colors = thresholds.map(v => colorSchemes[theVar](v / max));
            if (FILE_TYPE === "solarflares") { //TODO: Make this generalize instead.
                colors = thresholds.map(v => colorSchemes[theVar](v));//We use the value here since the data for this set already scaled down to 0, 1
                colors.reverse();
            } else if (FILE_TYPE === "alibaba" || FILE_TYPE === "genes") {
                colors.reverse();
            }

            // let colors = ['#3368FF', '#33F0FF', '#33FF39', '#FFBE33', '#FF3F33'];
            let colorScale = d3.scaleOrdinal().domain(thresholds).range(colors);

            allColorScales[theVar] = colorScale;
            //Keep null so that it is considered as 0 in calculation => so it will bring the absent points together, but convert back to undefined so will not plot it (if not undefined it will plot as 0).

            let contours = d3.contours().thresholds(thresholds).size([z[0].length, z.length]).smooth(smooth)(x);

            //This section store the contours for area calculation later-on.
            contours.forEach((ct, i) => {
                    let dt = {
                        variable: theVar,
                        layerIndex: i,
                        coordinates: ct.coordinates,
                        layerValue: ct.value
                    }
                    allContours.push(dt);
                }
            );
            let scaleX = width / z[0].length;
            let scaleY = height / z.length;

            let contourData = {
                contours: contours,
                scaleX: scaleX,
                scaleY: scaleY,
                colorScale: colorScale,
                variable: theVar,
                y: y
            };
            //Save it to use later when mouseover.
            theGroup.node().contourData = contourData;
            if (!HEAT_MAP) {
                plotContour(theGroup, contourData, width, height, onDrawingCompleted);
            } else {
                let heatmapData = {
                    timeSteps: timeSteps,
                    machines: y,
                    data: z,
                    colorScale: colorScale,
                    thresholds: thresholds
                };
                plotHeatmap(theGroup, heatmapData, width, height, () => {
                });
            }


            let doneDrawing = new Date();
            //Hide the loader
            hideLoader();
            addInfoRow(calculationTbl, [{innerHTML: `Done drawing ${theVar}`}, {
                innerHTML: numberWithCommas(doneDrawing - startDrawing) + 'ms',
                styles: [{key: 'textAlign', value: 'right'}]
            }]);

            //After all, process the sticky now here (since once done display we will have the offset information.
            setupScrollStickyTimeLine();

            function onDrawingCompleted(theVar) {
                //Done all drawing, start processing the contour area calculation.
                let totalPolygonLayerCount = allContours.length;
                let polygonLayerResultCounter = 0;
                let allContourAreas = [];
                if (totalDraws === drawingResultCounter + 1) {//Still + 1 here in the local (since the global is 1 step late)
                    //Start calculating from here
                    allContours.forEach((cl, i) => {
                        startWorker(areaWorkerPath, cl, onLayerAreaResult, i);
                    });
                    //Also we only setup the svg mouse move when all the drawings are done
                    if (fisheyeEnabled) {
                        setupMouseMove();
                    }
                }

                /**
                 *
                 * @param result result will have this format {variable: theVar, layerIndex: layerIndex, 'areas': results, layerValue: layerValue}
                 */
                function onLayerAreaResult(result) {
                    allContourAreas.push(result);
                    polygonLayerResultCounter += 1;
                    if (polygonLayerResultCounter === totalPolygonLayerCount) {
                        resetWorkers();
                        //Display contour info area.
                        displayContourAreasInfo(allContourAreas);
                    }
                }
            }
        }

        function onCompleteSimilarityCal(similarityResults) {
            let orderParts = VARIABLES.map((theVar) => {
                return similarityResults.map(similarity => {
                    return {
                        source: similarity.source,
                        target: similarity.target,
                        weight: similarity.weights[theVar]
                    }
                });
            });

            orderParts.forEach((part, i) => {
                //Build the best order.
                startWorker(orderWorkerPath, {
                    theVar: VARIABLES[i],
                    machines: orders[i],
                    links: part
                }, onOrderResult, i);
            });

            let orderingResultCounter = 0;
            let totalDraws = VARIABLES.length;
            let drawingResultCounter = 0;

            function onOrderResult(orderResults) {
                debugger
                orderingResultCounter += 1;
                if (orderingResultCounter === orderParts.length) {
                    doneOrdering = new Date();
                    addInfoRow(calculationTbl, [{innerHTML: 'Done ordering'}, {
                        innerHTML: numberWithCommas(doneOrdering - doneSimilarityCalc) + 'ms',
                        styles: [{key: 'textAlign', value: 'right'}]
                    }]);
                    resetWorkers();
                }
                processOrderResults(orderResults);
            }

            function processOrderResults(orderResults) {
                processOrder(orderResults, drawingResultCounter, totalDraws);
                drawingResultCounter += 1;
            }
        }

        function setupMouseMove() {
            function setFocus(groupIndex, fisheyeX, fisheyeY) {
                let contourPlot = d3.select(`#contourPlot${groupIndex}`);
                plotContour(contourPlot, contourPlot.node().contourData, width, height, () => {
                }, fisheyeX, fisheyeY);
                //Redraw timeline
                timeLineSettings.fisheyeX = fisheyeX;
                drawTimeLine(timeSteps, timeLineSettings);
            }

            //Setup mouseover on the svg.
            mainSvg.on("mousemove", function () {
                let mouse = d3.mouse(this);
                let mouseX = mouse[0] - margins.left;
                let mouseY = mouse[1] - margins.top;
                //If out of bound simply reset
                if (mouseX <= 0 || mouseX >= width || mouseY <= 0 || mouseY >= VARIABLES.length * height) {
                    return;
                }

                //Check which group
                let groupIndex = Math.floor(mouseY / height);
                mouseY = mouseY - groupIndex * height;
                fisheyeX.focus(mouseX);
                fisheyeY.focus(mouseY);
                //First element
                setFocus(groupIndex, fisheyeX, fisheyeY);
            });
            mainSvg.on("mouseout", function () {
                //Rest the contour (without having fish eye.
                VARIABLES.forEach((v, i) => {
                    setFocus(i, undefined, undefined);
                });
            });
        }
    });
};
main();


function displayContourAreasInfo(allContourAreas) {
    let theTbl = document.getElementById('contourTbl');
    allContourAreas.sort((a, b) => {
        return a.variable !== b.variable ? a.variable.localeCompare(b.variable) : a.layerIndex - b.layerIndex;
    });
    let nestedByVariable = d3.nest().key(d => d.variable).entries(allContourAreas);

    nestedByVariable.forEach(variable => {
        variable.values.forEach((vl, i) => {
            let row = [];
            if (i === 0) {
                //Variable name is expanded in all rows + 1 for the total
                row.push({
                    innerHTML: vl.variable,
                    attributes: [{key: 'rowspan', value: variable.values.length + 1}]
                });
                //Label is extended in all rows
                row.push({
                    innerHTML: 'Layer value',
                    attributes: [{key: 'rowspan', value: variable.values.length}]
                });
            }
            row.push({
                innerHTML: numberWithCommas(Math.round(vl.layerValue)),
                styles: [{
                    key: 'backgroundColor',
                    value: allColorScales[vl.variable](vl.layerValue)
                }, {key: 'textAlign', value: 'right'}]
            })
            if (i == 0) {
                //Label is extended in all rows
                row.push({
                    innerHTML: 'Blob count',
                    attributes: [{key: 'rowspan', value: variable.values.length}]
                });
            }
            row.push({
                innerHTML: vl.areas.length,
                styles: [{
                    key: 'backgroundColor',
                    value: allColorScales[vl.variable](vl.layerValue)
                }, {key: 'textAlign', value: 'right'}]
            });
            if (i == 0) {
                //Label is extended in all rows
                row.push({
                    innerHTML: 'Area subtotal',
                    attributes: [{key: 'rowspan', value: variable.values.length}]
                });
            }
            row.push({
                innerHTML: numberWithCommas(Math.round(d3.sum(vl.areas))),
                styles: [{
                    key: 'backgroundColor',
                    value: allColorScales[vl.variable](vl.layerValue)
                }, {key: 'textAlign', value: 'right'}]
            });
            addInfoRow(theTbl, row);
        });
        //Add row for the total
        let totalR = [];
        //Total layers
        totalR.push({innerHTML: 'Ranges count', styles: [{key: 'font-weight', value: 'bold'}]});
        totalR.push({innerHTML: variable.values.length, styles: [{key: 'textAlign', value: 'right'}]});
        //Total Area count
        totalR.push({innerHTML: 'Total', styles: [{key: 'font-weight', value: 'bold'}]});
        totalR.push({
            innerHTML: d3.sum(variable.values.map(vl => vl.areas.length)),
            styles: [{key: 'textAlign', value: 'right'}]
        });
        //Total Area count
        totalR.push({innerHTML: 'Total', styles: [{key: 'font-weight', value: 'bold'}]});
        totalR.push({
            innerHTML: numberWithCommas(d3.sum(variable.values.map(vl => Math.round(d3.sum(vl.areas))))),
            styles: [{key: 'textAlign', value: 'right'}]
        });
        addInfoRow(theTbl, totalR);
    });
}

function setupScrollStickyTimeLine() {
    window.onscroll = processScroll;
    let timeLine = document.getElementById("timeLineDiv");
    let sticky = timeLine.offsetTop;

    function processScroll() {
        if (window.pageYOffset >= sticky) {
            timeLine.classList.add("sticky")
        } else {
            timeLine.classList.remove("sticky");
        }
    }
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function timeStampToDate(timeStamp) {
    return d3.timeFormat(FORMAT_STR)(new Date(START_DATE.getTime() + STEP * timeStamp));
}
