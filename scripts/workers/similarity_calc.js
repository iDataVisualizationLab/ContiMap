function rSquared(x1, x2) {
    // //TODO: May need to deal with missing data here.
    let x1C = [];
    let x2C = [];
    let x2v;
    x1.forEach((x1v, i) => {
        if (x1v === 0 || x1v) {
            x2v = x2[i];
            if (x2v === 0 || x2v) {
                //Only push if both of the values are not null at that time step
                x1C.push(x1v);
                x2C.push(x2v);
            }
        }
    });
    if (x1C.length === 0) {
        return Number.MIN_SAFE_INTEGER + 1;
    }

    /**Calculation without penalty**/
    // let sse = ss.sum(x2C.map((x2v, i) => (x1C[i] - x2v) * (x1C[i] - x2v)));
    // let mx1 = ss.mean(x1C);
    // let sst = ss.sum(x1C.map((x1v) => (x1v - mx1) * (x1v - mx1)));
    // let result = 1 - (sse / sst);

    /**Calculation with penalty for average and also each step**/
        //TODO: may consider zero values and negative values
    let stepPenalty;
    let sse = ss.sum(x2C.map((x2v, i) => {
        stepPenalty = (x1C[i] > x2v ? x1C[i] : x2v);
        stepPenalty = stepPenalty > 0 ? stepPenalty : 1;
        return (x1C[i] - x2v) * (x1C[i] - x2v) / stepPenalty;
    }));
    let mx1 = ss.mean(x1C);
    let sst = ss.sum(x1C.map((x1v) => (x1v - mx1) * (x1v - mx1)));
    let result = (1 - (sse / sst));//Penalty by the average values too.
    let mx2 = ss.mean(x2C);
    let penalty = (mx1 + mx2);
    penalty = penalty * penalty;
    penalty = penalty > 1 ? penalty : 1;//If it is < 1, divided by it make the result bigger => that is what we don't want
    result = result > 0 ? result * penalty : result / penalty;


    ///**Care also about the missing data**/
    // let sse = ss.sum(x2.map((x2v, i) => (x1[i] - x2v) * (x1[i] - x2v)));
    // let mx1 = ss.mean(x1);
    // let sst = ss.sum(x1.map((x1v) => (x1v - mx1) * (x1v - mx1)));
    // let result = 1 - (sse / sst);

    return result;
}