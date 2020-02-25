const HEAT_MAP = false;

const NULL_VALUE = null;
//Contains some constants for the whole program
const FIELD_MACHINE_ID = 'gene_id';
const FIELD_TIME_STAMP = 'treatment_counter';
const FILE_TYPE = 'genes';

const ORDER_AVERAGE_ONLY = false;

// const ORDER_AVERAGE_STEPS = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
// const SIMILARITY_STEPS = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
// const NUM_OF_NEIGHBORS = 1000;
// const FILE_NAME = 'processed_gene_data_normalized.json';
// const VARIABLES = ['GENE_VALUE_NORMALIZED'];

const ORDER_AVERAGE_STEPS = [6, 7, 8, 9, 10, 11];
const SIMILARITY_STEPS = [6, 7, 8, 9, 10, 11];
const NUM_OF_NEIGHBORS = 895;
const FILE_NAME = 'processed_gene_data_averaged_normalized.json';
const VARIABLES = ['GENE_VALUE_AVERAGED_NORMALIZED'];
const SEQUENCE_LABELS = ['wthp6', 'wtlp6', 'wthp5', 'wtlp5', 'wtal', 'wtfe', 'stop1hp6', 'stop1lp6', 'stop1hp5', 'stop1lp5', 'stop1al', 's1fe'];

function tickLabelFormatGene(d) {
    let idx = parseInt(d.tick);
    return idx < SEQUENCE_LABELS.length ? SEQUENCE_LABELS[idx] : "";
}

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

let orderWorkerPath = 'scripts/workers_genes/similarityorder_worker.js';
let areaWorkerPath = 'scripts/workers_genes/area_worker.js';
let resamplingWorkerPath = 'scripts/workers_genes/resampling_worker.js';
let similarityWorkerPath = 'scripts/workers_genes/similarity_worker.js';

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
