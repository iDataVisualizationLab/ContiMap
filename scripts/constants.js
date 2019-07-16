const HEAT_MAP = false;

const NULL_VALUE = null;
//Contains some constants for the whole program
const NUM_OF_NEIGHBORS = 400;
const FIELD_MACHINE_ID = 'machine_id';
const FIELD_TIME_STAMP = 'time_stamp';

/**HPCC**/
// const FILE_NAME = 'HPCC_21Mar2019_5min.json';
// const VARIABLES = ["CPU1 Temp", "Fan1 speed", "Power consumption"];
// // const VARIABLES = ["CPU1 Temp"];

/**HPCC 2**/
// const FILE_NAME = 'HPCC_2019031824.json';
// const VARIABLES = ["CPU1 Temp", "Fan1 speed", "Memory usage"];
// // const VARIABLES = ["CPU1 Temp"];

/**HPCC 2**/
const FILE_NAME = 'HPCC_20190625_2min_1day.json';
const VARIABLES = ["CPU1 Temp", "Fan1 speed", "Power consumption"];
// const VARIABLES = ["CPU1 Temp"];

/**Alibaba**/
// const FILE_NAME = 'albb3600s.json';
// const VARIABLES = ["cpu_util_percent", "mem_util_percent", "disk_io_percent"];
// const VARIABLES = ["cpu_util_percent"];

/**Honeynet**/
// const FILE_NAME = 'honeynet2015.json';
// const VARIABLES = ["-1", "-2"];

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