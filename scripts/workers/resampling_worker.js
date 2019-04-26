const theVar = 'CPU1 Temp';
onmessage = function(e){
    let timeSteps = e.data.timeSteps;
    let part = e.data.part;
    let results = [];
    part.forEach(machineTimeSeries=>{
        let result = timeSteps.map((step)=>{
            let theStep = machineTimeSeries.find(d=>d.time_stamp===step);
            if(!theStep){
                theStep = Object.assign({}, machineTimeSeries[0]);
                theStep.time_stamp = step;
                theStep[theVar] = undefined;
            }
            return theStep;
        });
        results.push(result);
    });
    postMessage(results);
}