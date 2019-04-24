function rSquared(x1, x2){
    //TODO: May need to deal with missing data here.
    let sse = ss.sum(x2.map((x2v, i) => (x1[i] - x2v) * (x1[i] - x2v)));
    let mx1 = ss.mean(x1);
    let sst = ss.sum(x1.map((x1v) => (x1v - mx1) * (x1v - mx1)));
    let result = 1 - (sse / sst);
    return result;
}