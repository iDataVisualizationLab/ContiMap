/**
 * Build the maximum path
 * @param data will have the format as [{'source': source, 'target': target, 'weight': similarity }, {}]
 */
function maximumPath(machines, links) {
    // Order the weights by ascending order.
    links.sort((a, b) => a.weight - b.weight);
    let sequence = oneWayOrdering(machines, links);
    return sequence;
}

function twoWayOrdering(machines, links) {
    let sequence = [];
    let topLink = links[0];
    let left = topLink.source;
    let right = topLink.target;
    sequence.unshift(left);
    sequence.push(right);
    //Todo: May drop this for better performance, in that case we need to copy the links to avoid modifying it.
    topLink.visited = true;
    let leftExpandValue = Number.POSITIVE_INFINITY;
    let rightExpandValue = Number.POSITIVE_INFINITY;
    let leftExpand = undefined;
    let rightExpand = undefined;
    while (true) {
        //TODO: Only calculate left expand value if it is positive infinity or the sequence already contains either source or target
        if (leftExpandValue === Number.POSITIVE_INFINITY || sequence.indexOf(leftExpand.source) >= 0 || sequence.indexOf(leftExpand.target) >= 0) {
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

        //TODO: Only calculate right expand value if it is positive infinity or the sequence already contains either source or target
        if (rightExpandValue === Number.POSITIVE_INFINITY || sequence.indexOf(rightExpand.source) >= 0 || sequence.indexOf(rightExpand.target) >= 0) {
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

        //Choose the expansion direction (left or right, with lower weight).
        if (leftExpandValue < rightExpandValue) {
            //Expand on the left
            let l = leftExpand;
            l.visited = true;//Mark this node as visited
            if (l.source === left) {
                left = l.target;
            } else {
                left = l.source;
            }
            sequence.unshift(left);//Put it to the left
            //We expanded on the left so we need to set its expanded value to positive infinity to trigger recalculation of left expand
            leftExpandValue = Number.POSITIVE_INFINITY;
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
            //We expanded on the right so we need to set its expanded value to positive infinity to trigger recalculation of right expand
            rightExpandValue = Number.POSITIVE_INFINITY;
        }

        //If all nodes are put then finish
        if (sequence.length === machines.length) {
            break;
        }
    }
    return sequence;
}

function nWayOrdering(machines, links){
    let sequence = {};
    //Initialize
    machines.forEach(mc=>sequence[mc] = {});
}

function oneWayOrdering(machines, links) {
    let machinesLength = machines.length;
    let sequence = [];
    let topLink = links[0];
    sequence.push(topLink.source);
    sequence.push(topLink.target);
    let prev = topLink.target;
    let expand;
    topLink.visited = true;
    while (sequence.length !== machinesLength) {
        expand = links.find(l =>
            !l.visited && (
                (l.source === prev && sequence.indexOf(l.target) < 0) ||
                (l.target === prev && sequence.indexOf(l.source) < 0)
            )
        );
        if (expand.source === prev) {
            sequence.push(expand.target);
            prev = expand.target;
        } else {
            sequence.push(expand.source);
            prev = expand.source;
        }
        expand.visited = true;
    }
    return sequence;
}
