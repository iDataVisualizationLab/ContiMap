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
let margins = {left: 10, top: 0, right: 80, bottom: 0};
let width;
let height;
let svgWidth;
let svgHeight;
let pixelsPerColumn;
let pixelsPerRow;

/**Fisheye**/
let fisheyeX;
let fisheyeY;
function addInfo(theTbl, key, value, options){
    //Process options.
    let bgcolor = options?options.bgcolor:undefined;
    let row = theTbl.insertRow();
    let keyCell = row.insertCell();
    keyCell.innerHTML = key;
    let valueCell = row.insertCell();
    if(options && options.valueAlignment){
        valueCell.style.textAlign = options.valueAlignment;
    }else{
        valueCell.style.textAlign = 'right';
    }

    valueCell.innerHTML = value;
    if(bgcolor){
        keyCell.style.backgroundColor = bgcolor;
    }
}