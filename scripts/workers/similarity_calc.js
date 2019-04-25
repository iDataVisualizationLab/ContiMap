function rSquared(x1, x2){
    // //TODO: May need to deal with missing data here.
    // let x1C = [];
    // let x2C = [];
    // let x2v;
    // x1.forEach((x1v, i)=>{
    //    if(x1v){
    //        x2v = x2[i];
    //        if(x2v){
    //            //Only push if both of the values are not null at that time step
    //            x1C.push(x1v);
    //            x2C.push(x2v);
    //        }
    //    }
    // });
    // if(x1C.length === 0){
    //     return Number.NEGATIVE_INFINITY+1;//+1 to make it different from re-calculation threshold of ordering step.
    // }
    // let sse = ss.sum(x2C.map((x2v, i) => (x1C[i] - x2v) * (x1C[i] - x2v)));
    // let mx1 = ss.mean(x1C);
    // let sst = ss.sum(x1C.map((x1v) => (x1v - mx1) * (x1v - mx1)));
    // let result = 1 - (sse / sst);
    // return result;
    let sse = ss.sum(x2.map((x2v, i) => (x1[i] - x2v) * (x1[i] - x2v)));
    let mx1 = ss.mean(x1);
    let sst = ss.sum(x1.map((x1v) => (x1v - mx1) * (x1v - mx1)));
    let result = 1 - (sse / sst);
    return result;
}