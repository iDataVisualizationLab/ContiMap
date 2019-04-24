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
                theStep.cpu_util_percent = null;
            }
            return theStep;
        });
        results.push(result);
    });
    postMessage(results);
}