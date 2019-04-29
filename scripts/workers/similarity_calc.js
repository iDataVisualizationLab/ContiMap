let calculateSimilarity = sseNoPenalty;
if(stepPenalty){
    calculateSimilarity = sseStepPenalty;
}
function sseNoPenalty(x1, x2) {
    //TODO: Consider to normalize the values, the reason is that difference in a big scale => is very big => or this is sensitive to outlying values. => So it doesn't favor the large values?
    return ss.sum(x2.map((x2v, i) => (x1[i] - x2v) * (x1[i] - x2v)));
}

function sseStepPenalty(x1, x2) {
    let stepPenalty;
    let x1v;
    return ss.sum(x2.map((x2v, i) => {
        x1v = x1[i];
        stepPenalty = (x1v > x2v) ? x1v : x2v;
        stepPenalty = stepPenalty > 1 ? stepPenalty : 1;
        return (x1v - x2v) * (x1v - x2v)/(stepPenalty*stepPenalty);
    }));
}