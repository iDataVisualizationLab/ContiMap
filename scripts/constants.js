//Contains some constants for the whole program
const FIELD_MACHINE_ID = 'machine_id';
const FIELD_TIME_STAMP = 'time_stamp';
/**HPCC**/
const VARIABLES = ["CPU1 Temp", "Fan1 speed", "Power consumption"];
/**Alibaba**/
// const VARIABLES = ["cpu_util_percent"];

/**Configuration**/
const oneWay = true;
const smooth = false;
const stepPenalty = false;
/**Sizes**/
let margins = {left: 110, top: 0, right: 10, bottom: 0};
let width;
let height;
let svgWidth;
let svgHeight;
let pixelsPerColumn;
let pixelsPerRow;

/**Fisheye**/
let fisheyeX;
let fisheyeY;

function addInfoHTML(theDiv, htmlStr) {
    theDiv.innerHTML += htmlStr;
}

/**
 *
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
        if(cellDt.attributes){
            cellDt.attributes.forEach(att=>{
               cell.setAttribute(att.key, att.value);
            });
        }
    });

    // //Process options.
    // let bgcolor = options ? options.bgcolor : undefined;
    // let keyColspan = options ? options.keyColspan : 1;
    // let row = theTbl.insertRow();
    // let keyCell = row.insertCell();
    // keyCell.colSpan = keyColspan;
    // keyCell.innerHTML = key;
    // if (value) {
    //     let valueCell = row.insertCell();
    //     if (options && options.valueAlignment) {
    //         valueCell.style.textAlign = options.valueAlignment;
    //     } else {
    //         valueCell.style.textAlign = 'right';
    //     }
    //
    //     valueCell.innerHTML = value;
    //     if (bgcolor) {
    //         keyCell.style.backgroundColor = bgcolor;
    //     }
    // }
    // theDiv.appendChild(theTable);
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