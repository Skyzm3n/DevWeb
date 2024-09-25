# Tutoriel HTTP/Express Node.js

- [Tutoriel HTTP/Express Node.js](#tutoriel-httpexpress-nodejs)
  - [Partie 1 : serveur HTTP natif Node.js](#partie-1--serveur-http-natif-nodejs)
    - [Installation](#installation)
    - [Servir différents types de contenus](#servir-différents-types-de-contenus)
    - [Mode développement](#mode-développement)
    - [Gestion manuelle des routes](#gestion-manuelle-des-routes)
  - [Partie 2 : framework Express](#partie-2--framework-express)
    - [Création du serveur](#création-du-serveur)
    - [Ajout de middlewares](#ajout-de-middlewares)
    - [Rendu avec EJS](#rendu-avec-ejs)
    - [Gestion d'erreurs](#gestion-derreurs)
  - [Conclusion](#conclusion)

Ce tutorial est inspiré de [_How To Create a Web Server in Node.js with the HTTP Module_](https://www.digitalocean.com/community/tutorials/how-to-create-a-web-server-in-node-js-with-the-http-module) et compléter avec une partie sur Express.

Ce tutorial vous fait prendre en main l'environnement Node.js avec un petit projet de serveur web monté pas à pas, utilisant essentiellement les bilbiothèques standards de Node.js. Le framework <http://expressjs.com/> sera introduit ensuite.

- installer Node.js <https://nodejs.org/en/download/> pour votre environnement
- cloner le projet de départ de la GitHub Classroom <https://classroom.github.com/a/8mQFHDdO>
  - on obtient un dossier `tutoriel-http-express-node-LOGIN` qu'on appellera `devweb-tp5` par la suite par commodité

**RENDU** vous devrez remplir le fichier `README.md` avec les questions du sujet et **commiter/pousser sur GitHub Classroom**.
Les différentes étapes à réaliser seront aussi committées. La date limite de rendu est le **lundi 29 août 2022 23h59**.

## Partie 1 : serveur HTTP natif Node.js

### Installation

Exécuter la commande `npm init` dans le dossier `devweb-tp5`.
Répondre avec les valeurs par défaut, sauf pour _entry point: (index.js)_ où donner la valeur `server-http.mjs`
À ce stade, un fichier `package.json` a du être créé à peu près comme suit.

```json
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
```

Toujours dans le dossier `devweb-tp5` , créer le fichier `server-http.mjs` avec le contenu suivant :

```js
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
```

Enfin, exécuter la commande `node server-http.mjs` et vérifier que votre application web fonctionne en vous connectant avec votre navigateur.

**Question 1.1** donner la liste des en-têtes de la réponse HTTP du serveur.




Après avoir lancer notre serveur on obtien la requête suivante.
Cell-ci se découpe en 5 parties:
- __HTTP/1.1 200 OK__ : Le code 200 du protocole http représente le sucées de la requête HTTP.
- __Wed, 25 Sep 2024 02:24:17 GM__ : On a alors la date et l'heure de la reponse à notre requête qui nous est retourné par le serveur.
- __Connection: keep-alive__ : Definit que le serveur reste en ligne pour toutes demandes supplémentaires.
- __Keep-Alive: timeout=5__ : Cette ligne definit un delai de 5 secondes avant de fermer la connexion avec le serveur.
- __Transfer-Encoding: chunked__ : Il s'agit de la méthode d'envoie de la réponse. Dans le cas suivant celle-ci est envoyéen morceau

![img](https://github.com/Skyzm3n/DevWeb/tree/main/DERRIEN_Benoit_CC3/images/P1_1.1-2.png?raw=true)
![img](https://github.com/Skyzm3n/DevWeb/tree/main/DERRIEN_Benoit_CC3/images/P1_1.1-1.png?raw=true)

<br><br>

Servir différents types de contenus

Maintenant, remplacer la fonction requestListener() par la suivante et tester :

function requestListener(_request, response) {
  response.setHeader("Content-Type", "application/json");
  response.end(JSON.stringify({ message: "I'm OK" }));
}

**Question 1.2** donner la liste des en-têtes qui ont changé depuis la version précédente.

![img](https://github.com/Skyzm3n/DevWeb/tree/main/DERRIEN_Benoit_CC3/images/P1_1.2-1.png?raw=true)
<br>
![img](https://github.com/Skyzm3n/DevWeb/tree/main/DERRIEN_Benoit_CC3/images/P1_1.2-2.png?raw=true)
<br>
Depuis que l'on à changé de version on peut observer de nouvelles modifications telles que l'arrivée de: 

- __Content-Type : application/json__ :En effet cette en-tête est desormais au format JSON.
- __Conten-Lenght/ 20__ : En effet maintenat la requête nous renvoie la taille en octet de la réponse

On a par contre perdu:
- __Transfer-Encoding: chunked__ : Il s'agit de la méthode d'envoie de la réponse. Dans le cas suivant celle-ci est envoyéen morceau

<br><br>


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

Le client recevra le contenu du fichier html ayant pour nom index.html au format utf-8.
Si celui-ci n'existe pas la requète n'aboutiera paset se transformera en erreur.

<br><br>

**Question 1.4** quelle est l'erreur affichée dans la console ? Retrouver sur <https://nodejs.org/api> le code d'erreur affiché.

![img](https://github.com/Skyzm3n/DevWeb/tree/main/DERRIEN_Benoit_CC3/images/P1_1.4.png?raw=true)
<br>
![img](https://github.com/Skyzm3n/DevWeb/tree/main/DERRIEN_Benoit_CC3/images/P1_1.4-2.png?raw=true)
<br>

ENOENT (No such file or directory): Commonly raised by fs operations to indicate that a component of the specified pathname does not exist. No entity (file or directory) could be found by the given path.

- Le programme ne trouve pas le fichier en question dans le repertoire DERRIEN_Benoit_CC3

on modifie le code alors de la façon suivant
```js
function requestListener(_request, response) {
  fs.readFile("index.html", "utf8")
    .then((contents) => {
      response.setHeader("Content-Type", "text/html");
      response.writeHead(200);
      response.end(contents);
    })
    .catch((error) => {    
      console.error("Erreur lors de la lecture du fichier:", error); //On rajoute un messae d'erreur dansle console
      response.writeHead(500, { "Content-Type": "text/plain" }); //Si l'erreur est une ereur de type 500 alors 
      response.end("Le fichier souhaite est introuvable.");
    });
}
```




