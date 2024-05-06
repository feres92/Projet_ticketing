module.exports = function(db) {
    const express = require('express');
    const router = express.Router();

    // Middleware pour analyser le JSON des requêtes
    router.use(express.json());

    // Route pour créer un ticket
    router.post('/', (req, res) => {
        console.log("Reçu:", req.body); // Log des données reçues pour la création d'un ticket
        const { clientName, ticketReason, email, phone, ticketDate, ticketStatus } = req.body;
        const sql = "INSERT INTO tickets (client_name, ticket_reason, email, phone, ticket_date, ticket_status) VALUES (?, ?, ?, ?, ?, ?)";
        db.query(sql, [clientName, ticketReason, email, phone, ticketDate, ticketStatus], (err, result) => {
            if (err) {
                console.error('Erreur SQL lors de la création du ticket:', err.message);
                res.status(500).json({ error: 'Erreur lors de la création du ticket', details: err.message });
                return;
            }
            res.status(201).json({ message: 'Ticket créé avec succès' });
        });
    });

    // Route pour récupérer tous les tickets avec pagination, filtre de statut et tri
    router.get('/', (req, res) => {
        let { page, limit, status, orderBy } = req.query;
        page = parseInt(page, 10) || 1;
        limit = parseInt(limit, 10) || 30;
        const offset = (page - 1) * limit;

        let sql = "SELECT * FROM tickets";
        let countSql = "SELECT COUNT(*) AS total FROM tickets"; // Compter le nombre total de tickets
        let params = [];

        if (status) {
            sql += " WHERE ticket_status IN (?)";
            countSql += " WHERE ticket_status IN (?)"; // Utiliser la même condition pour le comptage
            params.push(status.split(','));
        }

        // Si aucun ordre spécifique n'est demandé, trier par date de création par défaut
        orderBy = orderBy || 'ticket_date DESC';
        sql += ` ORDER BY ${orderBy}`;

        sql += " LIMIT ?, ?";
        params.push(offset, limit);

        // Query pour récupérer les tickets
        db.query(sql, params, (err, tickets) => {
            if (err) {
                console.error('Erreur SQL lors de la récupération des tickets:', err.message);
                res.status(500).json({ error: 'Erreur lors de la récupération des tickets', details: err.message });
                return;
            }
            // Query pour compter le nombre total de tickets
            db.query(countSql, params.slice(0, 1), (err, results) => {
                if (err) {
                    console.error('Erreur SQL lors du comptage des tickets:', err.message);
                    res.status(500).json({ error: 'Erreur lors du comptage des tickets', details: err.message });
                    return;
                }
                const totalPages = Math.ceil(results[0].total / limit);
                res.json({ tickets, totalPages });
            });
        });
    });

    // Route pour récupérer un ticket spécifique par son ID
    router.get('/:id', (req, res) => {
        const sql = "SELECT * FROM tickets WHERE id = ?";
        db.query(sql, [req.params.id], (err, result) => {
            if (err) {
                console.error('Erreur SQL lors de la récupération du ticket:', err.message);
                res.status(500).json({ error: 'Erreur lors de la récupération du ticket', details: err.message });
                return;
            }
            if (result.length === 0) {
                res.status(404).send('Ticket non trouvé');
                return;
            }
            res.json(result[0]);
        });
    });

    // Route pour mettre à jour un ticket
    router.put('/:id', (req, res) => {
        const { clientName, ticketReason, email, phone, ticketDate, ticketStatus } = req.body;
        const sql = "UPDATE tickets SET client_name = ?, ticket_reason = ?, email = ?, phone = ?, ticket_date = ?, ticket_status = ? WHERE id = ?";
        db.query(sql, [clientName, ticketReason, email, phone, ticketDate, ticketStatus, req.params.id], (err, result) => {
            if (err) {
                console.error('Erreur SQL lors de la mise à jour du ticket:', err.message);
                res.status(500).json({ error: 'Erreur lors de la mise à jour du ticket', details: err.message });
                return;
            }
            if (result.affectedRows === 0) {
                res.status(404).send('Ticket non trouvé pour la mise à jour');
                return;
            }
            res.send('Ticket mis à jour avec succès');
        });
    });

    // Route pour supprimer un ticket
    router.delete('/:id', (req, res) => {
        const sql = "DELETE FROM tickets WHERE id = ?";
        db.query(sql, [req.params.id], (err, result) => {
            if (err) {
                console.error('Erreur SQL lors de la suppression du ticket:', err.message);
                res.status(500).json({ error: 'Erreur lors de la suppression du ticket', details: err.message });
                return;
            }
            if (result.affectedRows === 0) {
                res.status(404).send('Ticket non trouvé pour la suppression');
                return;
            }
            res.send('Ticket supprimé avec succès');
        });
    });

    return router;
};
