import express from 'express';
const router = express.Router();
import { getAllArtifacts, addArtifact, deleteArtifact, updateArtifact } from '../controllers/artifactController.js';
import db from '../db/connector.js';

// Твій дизайн підтягується з папки views/artifact/layout.hbs
const renderOptions = { layout: 'artifact/layout' };

// 1. Список артефактів (localhost:3000/artifacts/inventory)
router.get('/inventory', async (req, res) => {
    try {
        const items = await getAllArtifacts();
        // Файл лежить у views/artifact/inventory_page.hbs
        res.render('artifact/inventory_page', { 
            ...renderOptions, 
            items 
        });
    } catch (err) {
        console.error("Помилка списку:", err);
        res.status(500).send("Помилка при завантаженні інвентаря");
    }
});

// 2. Сторінка створення (localhost:3000/artifacts/create)
router.get('/create', (req, res) => {
    // Файл лежить у views/forms/artifact_form.hbs
    res.render('forms/artifact_form', { 
        ...renderOptions, 
        title: 'Новий хабар',
        isEdit: false 
    });
});

// 3. Збереження нового об'єкта
router.post('/create', async (req, res) => {
    try {
        await addArtifact(req.body);
        res.redirect('/artifacts/inventory');
    } catch (err) {
        console.error("Помилка збереження:", err);
        res.status(500).send("Не вдалося зберегти артефакт");
    }
});

// 4. Сторінка редагування (localhost:3000/artifacts/edit/ID)
router.get('/edit/:id', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM artifacts WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) return res.status(404).send("Артефакт не знайдено");
        
        // Файл лежить у views/forms/artifact_form.hbs
        res.render('forms/artifact_form', { 
            ...renderOptions, 
            item: result.rows[0], 
            isEdit: true, 
            title: 'Редагування хабаря' 
        });
    } catch (err) {
        console.error("Помилка БД:", err);
        res.status(500).send("Помилка доступу до бази даних");
    }
});

// 5. Оновлення існуючого
router.post('/edit/:id', async (req, res) => {
    try {
        await updateArtifact(req.params.id, req.body);
        res.redirect('/artifacts/inventory');
    } catch (err) {
        console.error("Помилка оновлення:", err);
        res.status(500).send("Не вдалося оновити дані");
    }
});

// 6. Видалення
router.post('/delete/:id', async (req, res) => {
    try {
        await deleteArtifact(req.params.id);
        res.redirect('/artifacts/inventory');
    } catch (err) {
        console.error("Помилка видалення:", err);
        res.status(500).send("Помилка при видаленні");
    }
});

export default router;