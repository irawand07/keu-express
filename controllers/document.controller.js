const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const index = async (req, res) => {
    try {
        const get = await prisma.document.findMany({
            include: { transaction: false }
        });
        res.json(get);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const show = async (req, res) => {
    try {
        const get = await prisma.document.findUnique({
            where: { id: req.params.id },
        });
        if (get) {
            res.json(get);
        } else {
            res.status(404).send('Data not found');
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const store = async (req, res) => {
    try {
        const store = await prisma.document.create({
            data: {
                spreadsheetId: req.body.spreadsheetId,
                name: req.body.name,
                year: req.body.year,
                isActive: req.body.isActive,
                sheet: req.body.sheet,
            },
        });
        res.status(201).json(store);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const update = async (req, res) => {
    try {
        const update = await prisma.document.update({
            where: { id: req.params.id },
            data: {
                spreadsheetId: req.body.spreadsheetId,
                name: req.body.name,
                year: req.body.year,
                isActive: req.body.isActive,
                sheet: req.body.sheet,
            },
        });
        res.status(201).json(update);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const drop = async (req, res) => {
    try {
        const drop = await prisma.document.delete({
            where: { id: req.params.id },
        });
        res.json();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    index,
    show,
    store,
    update,
    drop,
};