const fs = require('fs');

function naiveKnapsack(items, capacity) {
    // what is the value we have when we don't pick up any tiems
    // value[0, c] = 0;
    // value[i, w] = value[i-1, w] if W[i] > w
    
    //recursive solution 
    function recurse(i, size) {
        
        //base case
        if (i == 0) {
            return {
                value:0,
                size:0,
                chosen:[]
            };
        } else if(items[i].size > size) {
            return recurse(i - 1, size);
        }

        // item does fit
        //might not be worth as much as much as the sum of values of items we currently
        // have in our bag
        else {
            // the max value we've accumulated so far
            const r0 = recurse(i - 1, size);
            // the max value we could have if we added the new item we picked
            // but evicted some others
            const r1 = recurse(i - 1, size - items[i].size);
            r1.value += items[i].value;

            if (r0.value > r1.value) {
                return r0;
            } else {
                r1.size += items[i].size;
                r1.chosen = r1.chosen.concat(i);
                return r1;
            }
        }

    }
    return recurse(items.length - 1, capacity);
}

function firstTry(items, capacity) {
    //calculates the worth (value/size) or each item and adds it to each object
    items = items.map(item => {
        return { ...item, worth: item.value/item.size }
    });
    //sorts the arrary in descending order by worth
    items = items.sort((a, b) => {
        if (a.worth < b.worth)
            return 1;
        if (a.worth > b.worth)
            return -1
        return 0;
    });
    
    items.pop();

    let totalSize = 0;
    totalValue = 0;
    let working = true;
    let bag = [];
    let last = 0;
    for (let i = 0; i < items.length; i++) {
        if (totalSize + items[i].size <= capacity) {
            bag.push(items[i].index);
            totalSize += items[i].size;
            totalValue += items[i].value;
            last = { i, size: items[i].size, value: items[i].value }
            
        }
    }

    // if (capacity - totalSize !== 0){
    //     bag.pop();
    //     totalSize -= last.size;
    //     totalValue -= last.value;
    //     console.log(last);
    //     for (let i = last.i + 1; i < items.length; i++) {
    //         if (totalSize + items[i].size <= capacity) {
    //             bag.push(items[i].index);
    //             totalSize += items[i].size;
    //             totalValue += items[i].value;
    //             last = i + 1;
    //         }
    //     }
    // }
    return { totalSize, totalValue, bag };
    
    
}
const argv = process.argv.slice(2);

if (argv.length != 2) {
    console.error('usage: [filename] [capicity]');
    process.exit(1);
}

const filename = argv[0];
const capicity = argv[1];

// read the file
const filedata = fs.readFileSync(filename, 'utf8');

const lines = filedata.trim().split(/[\r\n]+/g);


const items = [];

for (let l of lines) {
    const [index, size, value] = l.split(' ').map(n => parseInt(n));

    items[index] = { 
        index,
        size,
        value,
    };
}

//console.log(naiveKnapsack(items, capicity));
console.log(firstTry(items, capicity));