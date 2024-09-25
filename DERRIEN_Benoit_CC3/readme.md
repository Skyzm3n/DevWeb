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

**Question 1.1** donner la liste des en-têtes de la réponse HTTP du serveur.




Après avoir lancer notre serveur on obtien la requête suivante.
Cell-ci se découpe en 5 parties:
- __HTTP/1.1 200 OK__ : Le code 200 du protocole http représente le sucées de la requête HTTP.
- __Wed, 25 Sep 2024 02:24:17 GM__ : On a alors la date et l'heure de la reponse à notre requête qui nous est retourné par le serveur.
- __Connection: keep-alive__ : Definit que le serveur reste en ligne pour toutes demandes supplémentaires.
- __Keep-Alive: timeout=5__ : Cette ligne definit un delai de 5 secondes avant de fermer la connexion avec le serveur.
- __Transfer-Encoding: chunked__ : Il s'agit de la méthode d'envoie de la réponse. Dans le cas suivant celle-ci est envoyéen morceau

![img](/images/P1_1.1-2.png)
![img](/images/P1_1.1-1.png)

<br><br>

Servir différents types de contenus

Maintenant, remplacer la fonction requestListener() par la suivante et tester :

function requestListener(_request, response) {
  response.setHeader("Content-Type", "application/json");
  response.end(JSON.stringify({ message: "I'm OK" }));
}

**Question 1.2** donner la liste des en-têtes qui ont changé depuis la version précédente.









Remplacer enfin la fonction requestListener() par la suivante et tester :

import fs from "node:fs/promises";

function requestListener(_request, response) {
  fs.readFile("index.html", "utf8")
    .then((contents) => {
      response.setHeader("Content-Type", "text/html");
      response.writeHead(200);
      return response.end(contents);
    })
    .catch((error) => console.error(error));
}

**Question 1.3** que contient la réponse reçue par le client ?