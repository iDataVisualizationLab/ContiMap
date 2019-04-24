function plotContoursFromData(group, grid, colorFunction) {
    let gridData = grid.map(g => g.value);
    let thresholds = processThresholds(d3.extent(gridData));
    let g = group.append("g");
    let contourData = d3.contours().smooth(true)
        .size(grid.size)
        .thresholds(thresholds)
        (gridData);
    // const interpolate = d3.line()
    //     .x(d => d[0] )
    //     .y(d => d[1] )
    //     .curve(d3.curveCardinalClosed);
    // const smoothPath = (pstr) => {
    //     var polygons = pstr.split("ZM");
    //     let result = "";
    //     polygons.forEach(plg =>{
    //         let sp = plg.replace(/M/, "").replace(/Z/, "").split("L").map(d=>d.split(","));
    //         result = result + interpolate(sp) + "Z";
    //     });
    //     return result;
    // }
    g.selectAll("path")
        .data(contourData)
        .enter().append("path")
        .attr("d", d => {
            let path = d3.geoPath(d3.geoIdentity().scale(grid.scale))(d);
            // return smoothPath(path);
            return path;
        })
        .attr("fill", colorFunction)
        .attr("stroke", "#000")
        .attr("stroke-width", contourStrokeWidth)
        .attr("class", "marker")
        .attr("opacity", contourOpacity)
        .attr("stroke-linejoin", "round");
}