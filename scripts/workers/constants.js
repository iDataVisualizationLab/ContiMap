const HEAT_MAP = false;

const NULL_VALUE = null;
//Contains some constants for the whole program

const FIELD_MACHINE_ID = 'machine_id';
const FIELD_TIME_STAMP = 'time_stamp';
FILE_TYPE = 'hpcc'
/**HPCC**/
// const FILE_NAME = 'HPCC_21Mar2019_5min.json';
// // const VARIABLES = ["CPU1 Temp", "Fan1 speed", "Power consumption"];
// const VARIABLES = ["CPU1 Temp"];

/**HPCC 2**/
// const FILE_NAME = 'HPCC_2019031824.json';
// const VARIABLES = ["CPU1 Temp", "Fan1 speed", "Memory usage"];
// // const VARIABLES = ["CPU1 Temp"];

/**HPCC 3**/
// const FILE_NAME = 'HPCC_20190625_2min_1day.json';
// const VARIABLES = ["CPU1 Temp", "Fan1 speed", "Power consumption"];
// const FORMAT_STR = '%H:%M',
//     START_DATE = new Date('2019/06/25'),
//     STEP = 1000 * 60 * 2;
/**HPCC 4**/
// const FILE_NAME = 'HPCC_week_18_24_March2019_full_3Vars.json';
// const VARIABLES = ["CPU1 Temp", "Fan1 speed", "Power consumption"];
// // const VARIABLES = ["CPU1 Temp"];
/**HPCC 4**/
// const FILE_NAME = 'HPCC_21_March2019_3Vars.json';
// const VARIABLES = ["CPU1 Temp", "Fan1 speed", "Power consumption"];
// const FORMAT_STR = '%H:%M',
//     START_DATE = new Date('2019/03/21'),
//     STEP = 1000 * 60 * 2;
/**HPCC 5 --- currently used for HPCC dataset**/
const NUM_OF_NEIGHBORS = 466;
const FILE_NAME = 'HPCC_2018_03_21_2min_wholeday.json';
const VARIABLES = ["CPU1 Temp", "Fan1 speed", "Power consumption"];
// const VARIABLES = ["CPU1 Temp"];
const FORMAT_STR = '%H:%M',
    START_DATE = new Date('2019/03/21'),
    STEP = 1000 * 60 * 2;

// /**Alibaba --- currently used for Alibaba dataset**/
// const FILE_NAME = 'albb3600s.json';
// const VARIABLES = ["cpu_util_percent", "mem_util_percent", "disk_io_percent"];
// // const VARIABLES = ["cpu_util_percent"];
// const FORMAT_STR = '%H:%M',
//     START_DATE = new Date('2018/01/01'),
//     STEP = 1000;

// /**Honeynet**/
// const FILE_NAME = 'honeynet2015.json';
// const VARIABLES = ["-1", "-2"];

/**Solar flare**/
// const FILE_NAME = 'cls0sample.json';
// const VARIABLES = ['TOTUSJH', 'TOTUSJZ', 'USFLUX', 'R_VALUE'];
// /**Solar flare**/
// const FILE_NAME = 'cls1sample.json';
// const VARIABLES = ['TOTUSJH', 'TOTUSJZ', 'USFLUX', 'R_VALUE'];
// /**Solar flare**/
// const FILE_NAME = 'cls0sample_6v.json';
// const VARIABLES = ['TOTUSJH', 'TOTUSJZ', 'USFLUX', 'R_VALUE', 'TOTBSQ', 'SAVNCPP'];
// /**Solar flare**/
// const FILE_NAME = 'cls1sample_6v.json';
// const VARIABLES = ['TOTUSJH', 'TOTUSJZ', 'USFLUX', 'R_VALUE' , 'TOTBSQ', 'SAVNCPP'];
// /**Solar flare**/
// const FILE_NAME = 'cls0sample_6v_1.json';
// const VARIABLES = ['TOTUSJH', 'TOTUSJZ', 'USFLUX', 'R_VALUE', 'SAVNCPP', 'MEANJZH'];
// /**Solar flare**/
// const FILE_NAME = 'cls1sample_6v_1.json';
// const VARIABLES = ['TOTUSJH', 'TOTUSJZ', 'USFLUX', 'R_VALUE', 'SAVNCPP', 'MEANJZH'];

/**Solar flare**/
// const FILE_NAME = 'class_0_sample_1.json';
// const VARIABLES = ['TOTUSJH', 'TOTUSJZ', 'USFLUX', 'R_VALUE', 'SAVNCPP', 'MEANJZH'];
/**Solar flare**/
// const FILE_NAME = 'class_1_sample_1.json';
// const VARIABLES = ['TOTUSJH', 'TOTUSJZ', 'USFLUX', 'R_VALUE', 'SAVNCPP', 'MEANJZH'];

/**Solar flare**/
// const FILE_NAME = 'class_0_sample_1.json';
// const VARIABLES = ['TOTUSJH', 'TOTUSJZ', 'USFLUX', 'R_VALUE', 'MEANALP', 'MEANJZH'];
/**Solar flare**/
// const FILE_NAME = 'class_1_sample_1.json';
// const VARIABLES = ['TOTUSJH', 'TOTUSJZ', 'USFLUX', 'R_VALUE', 'MEANALP', 'MEANJZH'];

// /**Solar flare**/
// const FILE_NAME = 'class_0_sample_9v.json';
// const VARIABLES = ['TOTUSJH', 'TOTUSJZ', 'USFLUX', 'R_VALUE', 'MEANJZH', 'EPSX', 'EPSY', 'TOTPOT', 'EPSZ'];
/**Solar flare**/
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
let fisheyeX;
let fisheyeY;
/**Contours**/
const allContours = [];
let allColorScales = {};

let orderWorkerPath = 'scripts/workers/similarityorder_worker.js';
let areaWorkerPath = 'scripts/workers/area_worker.js';
let resamplingWorkerPath = 'scripts/workers/resampling_worker.js';
let similarityWorkerPath = 'scripts/workers/similarity_worker.js';

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
