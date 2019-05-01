importScripts('../../lib/d3.js');
/**
 *
 * @param e e.data will have this format:{ variable: data.variable, layerIndex: i, coordinates: ct.coordinates}
 */
onmessage = function(e){

    let theVar = e.data.variable;
    let layerIndex = e.data.layerIndex;
    let coordinates = e.data.coordinates;
    let results = [];
    coordinates.forEach(polygons=>{
       polygons.forEach(polygon=>{
          results.push(d3.polygonArea(polygon));
       });
    });
    postMessage({variable: theVar, layerIndex: layerIndex, 'areas': results});
}