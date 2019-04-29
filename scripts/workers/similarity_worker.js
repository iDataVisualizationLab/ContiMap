importScripts('../constants.js','../../lib/simple-statistics.min.js', 'similarity_calc.js');

onmessage = function(e){
    let results = [];
    let part = e.data;
    part.forEach(sd=>{
        let x1 = sd.x1;
        let x2 = sd.x2;
        let source = x1[0][FIELD_MACHINE_ID];
        let target = x2[0][FIELD_MACHINE_ID];
        let similarities = {}
        VARIABLES.forEach(theVar=>{
            let x = x1.map(d=>d[theVar]);
            let y = x2.map(d=>d[theVar]);
            let similarity = calculateSimilarity(x, y);
            similarities[theVar] = similarity;
        });
        results.push({'source': source, 'target': target, 'weights': similarities });
    });
    postMessage(results);
}