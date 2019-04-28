importScripts("similarityorder_calc.js");
onmessage = function(e){
    let results = {
        variable: e.data.theVar,
        order: maximumPath(e.data.machines, e.data.links)
    };
    postMessage(results);
}
