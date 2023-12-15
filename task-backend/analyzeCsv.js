const fs = require('fs');
const csv = require('csv-parser');
const { list } = require('postcss');


const pathFile = process.argv[2];
const records = [];


fs.createReadStream(pathFile)
    .pipe(csv())
    .on('data', (data) => {

        data['Unit price'] = parseFloat(data['Unit price']);
        data.Quantity = parseInt(data.Quantity, 10);
        data['Percentage discount'] = parseFloat(data['Percentage discount']);

        data.TotalPrice = data['Unit price'] * data.Quantity;
        data.DifferentDiscount = data.TotalPrice - (data.TotalPrice * (1 - (data['Percentage discount'] / 100)));

        records.push(data);
    })
    .on('end', () => {

        let maxTotalPrice = 0;
        let maxQuantity = 0;
        let maxDifferentDiscount = 0;
        let indexMaxTotalPrice = 0;
        let indexMaxQuantity = 0;
        let indexMaxDifferentDiscount = 0;

        for (let i = 0; i < records.length; i++) {
            if (records[i].TotalPrice >= maxTotalPrice) {
                maxTotalPrice = records[i].TotalPrice;
                indexMaxTotalPrice = i;
            }
            if (records[i].Quantity >= maxQuantity) {
                maxQuantity = records[i].Quantity;
                indexMaxQuantity = i;
            }
            if (records[i].DifferentDiscount >= maxDifferentDiscount) {
                maxDifferentDiscount = records[i].DifferentDiscount;
                indexMaxDifferentDiscount = i;
            }

        }

        console.log(`Il valore massimo di total è ${maxTotalPrice}\n`);
        console.log(`Il record con il valore massimo di total è: ${JSON.stringify(records[indexMaxTotalPrice])}\n`);
        console.log(`Il valore massimo di quantity è ${maxQuantity}`);
        console.log(`Il record con il valore massimo di quantity è: ${JSON.stringify(records[indexMaxQuantity])}\n`);
        console.log(`la differenza massima di prezzo con lo sconto è: ${maxDifferentDiscount}\n`);
        console.log(`Il record con la differenza massima di prezzo con lo sconto è: ${JSON.stringify(records[indexMaxDifferentDiscount])}`);
    });