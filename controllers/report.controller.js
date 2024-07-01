const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const _ = require('lodash');

const index = async (req, res) => {
    try {

        // #1 Data document
        let param;
        if(req.params.id === 'all'){
            param = {
                include: { transaction: true },
                orderBy: {
                    year: 'asc',
                }
            };
        }else{
            param = {
                include: { transaction: true },
                where: {year: req.params.id},
                orderBy: {
                    year: 'asc',
                }
            };
        }

        const getDoc = await prisma.document.findMany(param);
        const filterDoc = getDoc.filter((item) => item.sheet.length > 1);

        const allData = filterDoc.map((doc) =>{
            const trans = doc.transaction.map((item) =>{
                const date = new Date(item.date);
                return {
                    year: doc.year,
                    month: date.getMonth(),
                    category: item.category,
                    amount: item.amount
                }
            });
            return trans;
        });
        const flatData = _.orderBy(allData.flat(), ['year', 'month'], ['asc', 'asc']);

        let labelCategory = [];
        let labelMonth = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        const groupedData = flatData.reduce((acc, item) => {
            const key = `${item.year}-${item.month}`;
            
            if (!acc[key]) {
                acc[key] = {
                    year:item.year,
                    month:item.month,
                    category: {}
                };
            }
            
            if(acc[key].category[item.category] === undefined){
                acc[key].category[item.category] = item.amount;
            }else{
                acc[key].category[item.category] += item.amount;
            }

            const find = labelCategory.find((val) => val === item.category);
            if(!find){
                labelCategory.push(item.category);
            }

            return acc;
        }, {});

        const finalData = Object.keys(groupedData).map((key) => {
            return groupedData[key];
        });

        const series = labelCategory.map((category) => {
            const data = finalData.map( (item) => {
                return item.category[category] ?? 0;
            });

            return {
                name: category,
                type: 'line',
                data: data
            }
        });

        let options = {
            tooltip: {
                trigger: 'axis'
              },
              legend: {
                data: labelCategory
              },
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
              toolbox: {
                feature: {
                  saveAsImage: {}
                }
              },
              xAxis: {
                type: 'category',
                boundaryGap: false,
                data: finalData.map( (item) => {
                    return item.year + ' ' + labelMonth[item.month];
                })
              },
              yAxis: {
                type: 'value'
              },
              series: series
        };

        res.json(options);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const rumah = async (req, res) => {
    try {

        // #1 Data document
        let param = {
                include: { transaction: true },
                orderBy: {
                    year: 'asc',
                }
            };

        const getDoc = await prisma.document.findMany(param);
        const filterDoc = getDoc.filter((item) => item.sheet.length === 1);

        const allData = filterDoc.map((doc) =>{
            const trans = doc.transaction.map((item) =>{
                const date = new Date(item.date);
                return {
                    year: date.getFullYear(),
                    month: date.getMonth(),
                    category: item.category,
                    amount: item.amount
                }
            });
            return trans;
        });
        let flatData = _.orderBy(allData.flat(), ['year', 'month'], ['asc', 'asc']);

        if(req.params.id !== 'all'){
            flatData = _.filter(flatData, transaction => {
                return transaction.year === parseInt(req.params.id);
            });
        }


        let labelCategory = [];
        let labelMonth = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        const groupedData = flatData.reduce((acc, item) => {
            const key = `${item.year}-${item.month}`;
            
            if (!acc[key]) {
                acc[key] = {
                    year:item.year,
                    month:item.month,
                    category: {}
                };
            }
            
            if(acc[key].category[item.category] === undefined){
                acc[key].category[item.category] = item.amount;
            }else{
                acc[key].category[item.category] += item.amount;
            }

            const find = labelCategory.find((val) => val === item.category);
            if(!find){
                labelCategory.push(item.category);
            }

            return acc;
        }, {});

        const finalData = Object.keys(groupedData).map((key) => {
            return groupedData[key];
        });

        const series = labelCategory.map((category) => {
            const data = finalData.map( (item) => {
                return item.category[category] ?? 0;
            });

            return {
                name: category,
                type: 'line',
                data: data
            }
        });

        let options = {
            tooltip: {
                trigger: 'axis'
              },
              legend: {
                data: labelCategory
              },
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
              toolbox: {
                feature: {
                  saveAsImage: {}
                }
              },
              xAxis: {
                type: 'category',
                boundaryGap: false,
                data: finalData.map( (item) => {
                    return item.year + ' ' + labelMonth[item.month];
                })
              },
              yAxis: {
                type: 'value'
              },
              series: series
        };

        const groupCategory = _.groupBy(flatData, 'category');
        const sumCategory = _.map(groupCategory, (group, category) => {
            return {
                name: category,
                value: _.sumBy(group, 'amount')
            };
        });

        let optionsPie = {
            tooltip: {
              trigger: 'item'
            },
            legend: {
              orient: 'vertical',
              left: 'left'
            },
            series: [
              {
                name: 'Total',
                type: 'pie',
                radius: '50%',
                data: sumCategory,
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
        };

        res.json({line: options, pie: optionsPie});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    index,
    rumah
};