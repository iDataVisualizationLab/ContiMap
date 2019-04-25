/**
 * Build the maximum path
 * @param data will have the format as [{'source': source, 'target': target, 'weight': similarity }, {}]
 */
function maximumPath(machines, links) {
    let numberOfMachines = machines.length;
    //Order the weights by descending order.
    links.sort((a, b) => b.weight - a.weight);

    //Initialize node degree (node degree must be <=1).
    let degreeCount = {};
    for (let i = 0; i < numberOfMachines; ++i) {
        degreeCount[machines[i]] = 0;//We haven't added.
    }
    let sequence = [];
    let topLink = links[0];
    let left = topLink.source;
    let right = topLink.target;
    sequence.unshift(left);
    sequence.push(right);
    //Todo: May drop this for better performance, in that case we need to copy the links to avoid modifying it.
    topLink.visited = true;
    let leftExpandValue = Number.NEGATIVE_INFINITY;
    let rightExpandValue = Number.NEGATIVE_INFINITY;
    let leftExpand = undefined;
    let rightExpand = undefined;
    while (true) {
        //Only calculate left expand value if it is negative infinity
        if (leftExpandValue === Number.NEGATIVE_INFINITY) {
            leftExpand = links.find(//Take the first element only since this is the highest
                l => !l.visited //must not be visited
                    && (
                        (l.source === left && sequence.indexOf(l.target) < 0) //continue from left as source and target is not in the sequence to avoid circle
                        || (l.target === left && sequence.indexOf(l.source) < 0) //continue from left as target and source is not in the sequence to avoid circle
                    ));
            if (leftExpand) {//If it is possible to expand on the left, check the weight of the first one (the one on top will be the highest one)
                leftExpandValue = leftExpand.weight;
            }
        }

        //Only calculate right expand value if it is negative infinity
        if (rightExpandValue === Number.NEGATIVE_INFINITY) {
            rightExpand = links.find(
                l => !l.visited //must not be visited
                    && (
                        (l.source === right && sequence.indexOf(l.target) < 0) //continue from right as source and target is not in the sequence to avoid circle
                        || (l.target === right && sequence.indexOf(l.source) < 0) //continue from right as target and source is not in the sequence to avoid circle
                    ));
            if (rightExpand) {//If it is possible to expand on the right, check the weight of the first one (the one on top will be the highest one)
                rightExpandValue = rightExpand.weight;
            }
        }

        //Choose the expansion direction (left or right, with higher weight).
        if (leftExpandValue > rightExpandValue) {
            //Expand on the left
            let l = leftExpand;
            l.visited = true;//Mark this node as visited
            if (l.source === left) {
                left = l.target;
            } else {
                left = l.source;
            }
            sequence.unshift(left);//Put it to the left
            //We expanded on the left so we need to set its expanded value to negative infinity to trigger recalculation of left expand
            leftExpandValue = Number.NEGATIVE_INFINITY;
        } else {
            //Expand on the right
            let l = rightExpand;
            l.visited = true;//Mark this node as visited
            if (l.source === right) {
                right = l.target;
            } else {
                right = l.source;
            }
            sequence.push(right);//Put it to the right
            //We expanded on the right so we need to set its expanded value to negative infinity to trigger recalculation of right expand
            rightExpandValue = Number.NEGATIVE_INFINITY;
        }
        //If all nodes are put then finish
        if (sequence.length === machines.length) {
            return sequence;
        }
    }
}