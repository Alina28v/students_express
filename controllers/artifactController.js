import pool from '../db/connector.js';

// 1. Отримати всі артефакти (READ)
export const getAllArtifacts = async () => {
    try {
        const res = await pool.query("SELECT * FROM artifacts ORDER BY id ASC");
        return res.rows;
    } catch (err) {
        console.error("Помилка при отриманні списку:", err.message);
        throw err;
    }
};

// 2. Додати новий артефакт (CREATE)
export const addArtifact = async (data) => {
    try {
        const query = `
            INSERT INTO artifacts 
            (name, origin_anomaly, rarity, radiation_level, weight, market_value, stalker_owner, properties_notes)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
            RETURNING *`;
        
        // ВАЖЛИВО: Назви зліва (data.xxx) мають ТОЧНО збігатися з name="..." у твоїй формі hbs
        const values = [
            data.name, 
            data.origin_anomaly, // було data.anomaly
            data.rarity || 'Common', 
            parseFloat(data.radiation_level) || 0, // було data.rad
            parseFloat(data.weight) || 0, 
            parseInt(data.market_value) || 0, // було data.value
            data.stalker_owner, // було data.owner
            data.properties_notes // було data.notes
        ];

        const res = await pool.query(query, values);
        return res.rows[0];
    } catch (err) {
        console.error("Помилка при додаванні:", err.message);
        throw err;
    }
};

// 3. Оновити дані артефакту (UPDATE)
export const updateArtifact = async (id, updateData) => {
    try {
        const query = `
            UPDATE artifacts 
            SET market_value = $1, stalker_owner = $2, properties_notes = $3
            WHERE id = $4 
            RETURNING *`;
        
        const values = [
            parseInt(updateData.market_value) || 0, 
            updateData.stalker_owner, 
            updateData.properties_notes, 
            id
        ];
        const res = await pool.query(query, values);
        
        if (res.rows.length === 0) throw new Error("Артефакт не знайдено");
        return res.rows[0];
    } catch (err) {
        console.error("Помилка при оновленні:", err.message);
        throw err;
    }
};

// 4. Видалити артефакт (DELETE)
export const deleteArtifact = async (id) => {
    try {
        const res = await pool.query("DELETE FROM artifacts WHERE id = $1 RETURNING *", [id]);
        if (res.rows.length === 0) throw new Error("Об'єкт для видалення не знайдено");
        return res.rows[0];
    } catch (err) {
        console.error("Помилка при видаленні:", err.message);
        throw err;
    }
};