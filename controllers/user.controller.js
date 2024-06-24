const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const index = async (req, res) => {
    try {
        const get = await prisma.user.findMany({
            include: { transaction: true }
        });
        res.json(get);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const show = async (req, res) => {
    try {
        const get = await prisma.user.findUnique({
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
        const store = await prisma.user.create({
            data: {
                email: req.body.email,
                name: req.body.name,
            },
        });
        res.status(201).json(store);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const update = async (req, res) => {
    try {
        const update = await prisma.user.update({
            where: { id: req.params.id },
            data: {
                email: req.body.email,
                name: req.body.name,
            },
        });
        res.status(201).json(update);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const drop = async (req, res) => {
    try {
        const drop = await prisma.user.delete({
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