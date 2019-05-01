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
function addInfo(theTbl, key, value, unit, options){
    let row = theTbl.insertRow();
    let keyCell = row.insertCell();
    keyCell.innerHTML = key;
    let valueCell = row.insertCell();
    valueCell.style.textAlign = 'right';
    if(unit===0 || unit){
        let unitCell = row.insertCell();
        unitCell.innerHTML = unit;
    }
    valueCell.innerHTML = value;
}