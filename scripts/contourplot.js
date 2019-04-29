function plotContour(theDiv, data, width, height) {
    let thresholds = data.thresholds;
    let colors = data.colors;
    let colorScale = d3.scaleOrdinal().domain(thresholds).range(colors);
    let contours = d3.contours().thresholds(thresholds).size([data.z[0].length, data.z.length]).smooth(smooth)(data.z.flat());

    function scale(scaleX, scaleY) {
        return d3.geoTransform({
            point: function (x, y) {
                this.stream.point(x * scaleX, y * scaleY);
            }
        });
    }
    let scaleX = width / data.z[0].length;
    let scaleY = height / data.z.length;
    //Buidling the path
    var path = d3.geoPath().projection(scale(scaleX, scaleY, width, height));

    let svg = d3.select(`#${theDiv}`).append("svg").attr("width", width).attr("height", height);
    let g = svg.append("g");
    let ctPaths = g.selectAll("path").data(contours).enter().append("path").attr("d", path)
        .attr("fill", d => colorScale(d.value));
}