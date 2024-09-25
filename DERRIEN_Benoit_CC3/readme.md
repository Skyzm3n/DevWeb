devweb
Tutoriel HTTP/Express Node.js

    Tutoriel HTTP/Express Node.js
        Partie 1 : serveur HTTP natif Node.js
            Installation
            Servir différents types de contenus
            Mode développement
            Gestion manuelle des routes
        Partie 2 : framework Express
            Création du serveur
            Ajout de middlewares
            Rendu avec EJS
            Gestion d’erreurs
        Conclusion

Ce tutorial est inspiré de How To Create a Web Server in Node.js with the HTTP Module et compléter avec une partie sur Express.

Ce tutorial vous fait prendre en main l’environnement Node.js avec un petit projet de serveur web monté pas à pas, utilisant essentiellement les bilbiothèques standards de Node.js. Le framework http://expressjs.com/ sera introduit ensuite.

    installer Node.js https://nodejs.org/en/download/ pour votre environnement
    créer un dossier devweb-tp5

RENDU vous devrez remplir le fichier README.md avec les questions du sujet et commiter/pousser sur GitHub. Les différentes étapes à réaliser seront aussi committées.
Partie 1 : serveur HTTP natif Node.js
Installation

Exécuter la commande npm init dans le dossier devweb-tp5. Répondre avec les valeurs par défaut, sauf pour entry point: (index.js) où donner la valeur server-http.mjs À ce stade, un fichier package.json a du être créé à peu près comme suit.

{
  "name": "devweb-tp5",
  "version": "1.0.0",
  "description": "",
  "main": "server-http.mjs",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}

Toujours dans le dossier devweb-tp5 , crxéer le fichier server-http.mjs avec le contenu suivant :

import http from "node:http";

const host = "localhost";
const port = 8000;

function requestListener(_request, response) {
  response.writeHead(200);
  response.end("<html><h1>My first server!<h1></html>");
}

const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});

Enfin, exécuter la commande node server-http.mjs et vérifier que votre application web fonctionne en vous connectant avec votre navigateur.

Question 1.1 donner la liste des en-têtes de la réponse HTTP du serveur.