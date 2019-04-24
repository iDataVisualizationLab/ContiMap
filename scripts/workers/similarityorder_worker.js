importScripts("similarityorder_calc.js");
onmessage = function(e){
    let results = maximumPath(e.data.machines, e.data.links);
    postMessage(results);
}
