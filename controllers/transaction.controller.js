const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const index = async (req, res) => {
    try {
        const get = await prisma.transaction.findMany({
            include: { user: true }
        });
        res.json(get);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const show = async (req, res) => {
    try {
        const get = await prisma.transaction.findUnique({
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
        const store = await prisma.transaction.create({
            data: {
                date: new Date(req.body.date),
                category: req.body.category,
                description: req.body.description,
                amount: req.body.amount,
                userId: req.body.userId,
            },
        });
        res.status(201).json(store);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const update = async (req, res) => {
    try {
        const update = await prisma.transaction.update({
            where: { id: req.params.id },
            data: {
                date: new Date(req.body.date),
                category: req.body.category,
                description: req.body.description,
                amount: req.body.amount,
            },
        });
        res.status(201).json(update);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const drop = async (req, res) => {
    try {
        const drop = await prisma.transaction.delete({
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