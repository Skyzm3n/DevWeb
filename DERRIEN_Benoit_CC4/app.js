const { customAlphabet } = require('nanoid');
const express = require('express');
const cors = require('cors');
const db = require('./models/Urls');
const path = require('path');
const favicon = require('serve-favicon'); // Import favicon middleware
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

let nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", 7);
const PORT = process.env.PORT || 3000;
const link = "http://localhost:3000";

const app = express();


//Conf swagger
const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "API pour le site Reducteur-URL",
            version: "1.0.0",
            description: "API pour le site Reducteur-URL",
        },
    },
    apis: ["./app.js", "./index/*.js"],

};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));


/**
 * @swagger
 * /api/link/{id}:
 *   get:
 *     summary: Afficher un liesn (API)
 *     description: Afficher un lien raccourci avec son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du lien à afficher
 *     responses:
 *       200:
 *         description: Lien trouvé avec succès
 *       404:
 *         description: Lien non trouvé
 *   delete:
 *     summary: Supprimer un lien (API)
 *     description: Supprimer un lien raccourci avec son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du lien à supprimer
 *     responses:
 *       200:
 *         description: Lien supprimé avec succès
 *       404:
 *         description: Lien non trouvé
 */


// Fonction pour exécuter les requêtes SQL
function executeQuery(query, data, callback) {
    try {
        db.serialize(() => {
            db.all(query, data, (err, lignes) => {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, lignes);
                }
            });
        });
    } catch (error) {
        console.error("Error:", error);
        callback(error, null);
    }
}


app.use(favicon(path.join(__dirname, 'dist', 'favicon.ico'))); // Serve the favicon
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(express.json());
app.use(express.static("dist")); // Serve static files

/**
 * @swagger
 * /api/shorten:
 *   post:
 *     summary: Raccourcir une URL
 *     description: Raccourcir une URL donnée
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 description: L'URL à raccourcir
 *                 example: "https://example.com"
 *     responses:
 *       200:
 *         description: URL raccourcie avec succès
 *       400:
 *         description: Erreur lors de la création de l'URL raccourcie
 */


// Endpoint pour raccourcir une URL
app.post("/api/shorten", async (req, res, next) => {
    if (req.body.url) {
        try {
            const generateUniqueshortURL = () => {
                const shortURL = nanoid();
                const shortURLCheckQuery = `SELECT * FROM urls WHERE short_url = ?`;

                executeQuery(shortURLCheckQuery, [shortURL], (err, lignes) => {
                    if (err) {
                        return res.status(400).json({ message: err });
                    }
                    if (lignes.length === 0) {
                        const insertQuery = `INSERT INTO urls (original_url, short_url) VALUES (?, ?)`;

                        executeQuery(insertQuery, [req.body.url, shortURL], (err) => {
                            if (err) {
                                return res.status(400).json({ message: err });
                            }
                            res.status(200).json({ lien_raccourci: `${link}/${shortURL}` });
                        });
                    } else {
                        generateUniqueshortURL(); // Generate a new short URL if collision occurs
                    }
                });
            };

            generateUniqueshortURL();
        } catch (err) {
            next(err);
        }
    } else {
        const error = new Error("URL is required");
        return next(error);
    }
});

// Endpoint pour supprimer un lien
app.delete("/api/link/:id", async (req, res, next) => {
    const linkId = req.params.id;
  
    const deleteQuery = "DELETE FROM urls WHERE id = ?";
    db.run(deleteQuery, [linkId], function(err) {
        if (err) {
            return next(err);
        }

        
        if (this.changes > 0) {
            return res.status(200).json({ status: "SUCCESS", message: "Lien supprimé avec succès." });
        } else {
            return res.status(404).json({ status: "FAILURE", message: "Lien non trouvé." });
        }
    });
});

/**
 * @swagger
 * /:shortURL:
 *   get:
 *     summary: Rediriger vers l'URL originale
 *     description: Rediriger vers l'URL originale
 *     parameters:
 *       - in: path
 *         name: shortURL
 *         schema:
 *           type: string
 *         required: true
 *         description: Lien raccourci
 *     responses:
 *       301:
 *         description: Redirection vers l'URL originale
 */

// Endpoint pour rediriger vers l'URL originale
app.get("/:shortURL", async (req, res, next) => {
    try {
        const shortURL = req.params.shortURL;
        const shortURLCheckQuery = "SELECT original_url FROM urls WHERE short_url = ?";

        executeQuery(shortURLCheckQuery, [shortURL], (err, lignes) => {
            if (err) {
                return next(err);
            }
            if (lignes.length > 0) {
                const originalUrl = lignes[0].original_url; 
                res.status(301).redirect(originalUrl);
            } else {
                next(); // Pass to the next route for 404
            }
        });
    } catch (err) {
        next(err);
    }
});

/** 
 * @swagger
 * /my_links:
 *   get:
 *     summary: Afficher le contenu du fichier my_links.html
 *     description: Afficher le contenu du fichier my_links.html
 */

// Endpoint pour servir le fichier my_links.html
app.get("/my_links", (req, res, next) => {
    res.sendFile(path.join(__dirname, "dist", "my_links.html"));
});

/**
 * @swagger
 * /api/my_links:
 *   get:
 *     summary: Afficher tous les liens (API)
 *     description: Afficher tous les liens
 */

// Endpoint pour récupérer tous les liens (API)
app.get("/api/my_links", (req, res, next) => {
    const query = "SELECT * FROM urls";  

    executeQuery(query, [], (err, lignes) => {
        if (err) {
            console.error("Erreur lors de l'exécution de la requête:", err);
            return next(err);
        }
        return res.status(200).json({ status: "SUCCESS", links: lignes });
    });
});

// Middleware pour gérer les erreurs 404 (Not Found)
function notFound(req, res, next) {
    res.status(404);
    const error = new Error("Not found - " + req.originalUrl);
    return next(error);
}

// Middleware pour gérer les erreurs globales
function errorHandler(err, req, res, next) {
    console.error("Erreur détectée:", err.message);
    res.status(res.statusCode || 500);
    res.json({
        message: err.message,
        error: {
            status: res.statusCode,
            stack: process.env.ENV === "development" ? err.stack : undefined,
        },
    });
}

// Utilisation des middlewares d'erreurs
app.use(notFound);
app.use(errorHandler);

// Démarrage du serveur
app.listen(PORT, () => console.log(`Listening on port ${PORT}... in mode ${process.env.NODE_ENV}. Go to http://localhost:${PORT} if connected in local mode or to ${link} if deployed.`));
