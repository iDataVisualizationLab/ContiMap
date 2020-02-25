const HEAT_MAP = false;

const NULL_VALUE = null;
//Contains some constants for the whole program
// const NUM_OF_NEIGHBORS = 466;
const FIELD_MACHINE_ID = 'machine_id';
const FIELD_TIME_STAMP = 'time_stamp';
const FILE_TYPE = 'solarflares'

// /**Solar flare**/
// const NUM_OF_NEIGHBORS = 999;//Total number of machines are 1000
const NUM_OF_NEIGHBORS = 300;
const FILE_NAME = 'class_0_sample_9v.json';
const VARIABLES = ['TOTUSJH', 'TOTUSJZ', 'USFLUX', 'R_VALUE', 'MEANJZH', 'EPSX', 'EPSY', 'TOTPOT', 'EPSZ'];
/**Solar flare -- currently used**/
// const NUM_OF_NEIGHBORS = 999;
// const FILE_NAME = 'class_1_sample_9v.json';
// const VARIABLES = ['TOTUSJH', 'TOTUSJZ', 'USFLUX', 'R_VALUE', 'MEANJZH', 'EPSX', 'EPSY', 'TOTPOT', 'EPSZ'];

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
let fisheyeEnabled = true;
let fisheyeX;
let fisheyeY;
/**Contours**/
const allContours = [];
let allColorScales = {};

let orderWorkerPath = 'scripts/workers_solarflares/similarityorder_worker.js';
let areaWorkerPath = 'scripts/workers_solarflares/area_worker.js';
let resamplingWorkerPath = 'scripts/workers_solarflares/resampling_worker.js';
let similarityWorkerPath = 'scripts/workers_solarflares/similarity_worker.js';

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
