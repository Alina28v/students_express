import express from 'express';
const router = express.Router();
import { getAllClothing, addClothingItem, deleteClothingItem } from '../controllers/clothingController.js';

router.get('/list', async (req, res) => {
    try {
        const items = await getAllClothing();
        res.render('clothes/clothing_page', { items });
    } catch (err) {
        console.error(err);
        res.status(500).send("Помилка бази даних");
    }
});

router.get('/create', (req, res) => {
    res.render('forms/clothing_form', { title: 'Додати товар' });
});

router.post('/create', async (req, res) => {
    await addClothingItem(req.body);
    res.redirect('/clothing/list');
});

router.post('/delete/:id', async (req, res) => {
    await deleteClothingItem(req.params.id);
    res.redirect('/clothing/list');
});

export default router;