const { PrismaClient } = require('@prisma/client');
const { google } = require('googleapis');
const prisma = new PrismaClient();
const credentials = require('../credentials.json');
const scopes = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const auth = new google.auth.GoogleAuth({
    credentials,
    scopes
});
const sheets = google.sheets({ version: 'v4', auth });

const index = async (req, res) => {
    let result = [];
    let bulkInsert = [];
    try {

        // #1 Data document
        const getDoc = await prisma.document.findMany({
            where: { isActive: true },
            orderBy: {
                year: 'asc',
            },
        });

        const promises = getDoc.map(async (doc) =>{

            // #2 collect google sheet
            const spreadsheetId = doc.spreadsheetId;

            const sheetPromises = doc.sheet.map(async (range, index) =>{
                const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });
                let lastDate = new Date();
                let data;

                if(range.includes('Transaksi')){
                    const rows = response.data.values.filter((item) => item[5] !== undefined && item[5] !== '');
                    data = rows.map((item) => {
                        if(!isNaN(new Date(item[1]))){
                            lastDate = new Date(item[1]);
                        }
                        return {
                            date: lastDate,
                            category: item[5].toLowerCase().trim(),
                            amount: parseFloat(item[6].replace(/[^0-9]/g, '')),
                            description: item[2],
                            documentId: doc.id
                        };
                    });
                }else{
                    lastDate = doc.year + '-' + ((index+1) < 10 ? '0'+ (index+1) : (index+1)) + '-01'
                    lastDate = new Date(lastDate);
                    const rows = response.data.values.filter((item) => item[3] !== undefined && item[3] !== '');
                    data = rows.map((item) => {
                        if(!isNaN(new Date(item[1]))){
                            lastDate = new Date(item[1]);
                        }
                        return {
                            date: lastDate,
                            category: item[3].toLowerCase().trim(),
                            amount: parseFloat(item[4].replace(/[^0-9]/g, '')),
                            description: item[2],
                            documentId: doc.id
                        };
                    });
                }
                return data;
            });
            // await Promise.all(sheetPromises);
            const allData = await Promise.all(sheetPromises);
            const mergeData = allData.flat();
            result.push({
                id: spreadsheetId,
                name: doc.name,
                data: mergeData.length,
            });

            // #3 insert mongodb
            await prisma.$transaction(async (prisma) => {
                await prisma.transaction.deleteMany({
                    where: { documentId: doc.id },
                });
                await prisma.transaction.createMany({
                    data: mergeData,
                });
            });
        });

        await Promise.all(promises);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    index
};