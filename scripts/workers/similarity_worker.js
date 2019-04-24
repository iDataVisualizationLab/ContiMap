importScripts('../../lib/simple-statistics.min.js');
importScripts('similarity_calc.js');
onmessage = function(e){
    let results = [];
    let part = e.data;
    part.forEach(sd=>{
        let x1 = sd.x1;
        let x2 = sd.x2;
        let source = x1[0].machine_id;
        let target = x2[0].machine_id;
        x1 = x1.map(d=>d.cpu_util_percent);
        x2 = x2.map(d=>d.cpu_util_percent);
        let similarity = rSquared(x1, x2);
        results.push({'source': source, 'target': target, 'weight': similarity });
    });
    postMessage(results);
}