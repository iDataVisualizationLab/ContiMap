//Contains some constants for the whole program
const FIELD_MACHINE_ID = 'machine_id';
const FIELD_TIME_STAMP = 'time_stamp';
/**HPCC**/
const VARIABLES = ["CPU1 Temp", "Fan1 speed", "Power consumption"];
/**Alibaba**/
// const VARIABLES = ["cpu_util_percent"];

/**Configuration**/
const removeNull = false;
const stepPenalty = false;
const averagePenalty = false;
const oneWay = true;
const smooth = false;
function addInfo(theDiv, key, value){
    theDiv.innerHTML += `<br/>${key}: ${value}`;
}