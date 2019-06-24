//Contains some constants for the whole program
const FIELD_MACHINE_ID = 'machine_id';
const FIELD_TIME_STAMP = 'time_stamp';
/**HPCC**/
// const VARIABLES = ["CPU1 Temp", "Fan1 speed", "Power consumption"];
/**Alibaba**/
const VARIABLES = ["cpu_util_percent", "mem_util_percent", "disk_io_percent"];

/**Configuration**/
const oneWay = true;
const smooth = false;
const stepPenalty = false;
/**Sizes**/
let margins = {left: 110, top: 0, right: 10, bottom: 0};
let width;
let height;
let timeLineHeight = 30;
let svgWidth;
let svgHeight;
let pixelsPerColumn;
let pixelsPerRow;

/**Fisheye**/
let fisheyeX;
let fisheyeY;
/**Contours**/
const allContours = [];
let allColorScales = {};

function addInfoHTML(theDiv, htmlStr) {
    theDiv.innerHTML += htmlStr;
}

/**
 * @param theTbl
 * @param rowDt should be in the format of []
 */
function addInfoRow(theTbl, rowDt) {
    let row = theTbl.insertRow();
    rowDt.forEach(cellDt => {
        let cell = row.insertCell();
        cell.innerHTML = cellDt.innerHTML;
        //Apply options if there is.
        if (cellDt.styles) {
            cellDt.styles.forEach(style => {
                cell.style[style.key] = style.value;
            });
        }
        if (cellDt.attributes) {
            cellDt.attributes.forEach(att => {
                cell.setAttribute(att.key, att.value);
            });
        }
    });
}

function createTableStr(rows) {
    let tbl = document.createElement('table');
    rows.forEach(rowDt => {
        let row = tbl.insertRow();
        rowDt.forEach(cellDt => {
            let cell = row.insertCell();
            cell.innerHTML = cellDt.innerHTML;
        });
    });
    let tmp = document.createElement("div");
    tmp.appendChild(tbl);
    return tmp.innerHTML;
}