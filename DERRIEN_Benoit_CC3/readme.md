

**Question 1.1**: donner la liste des en-têtes de la réponse HTTP du serveur.

Après avoir lancer notre serveur on obtien la requête suivante.
Cell-ci se découpe en 5 parties:
- __HTTP/1.1 200 OK__ : Le code 200 du protocole http représente le sucées de la requête HTTP.
- __Wed, 25 Sep 2024 02:24:17 GM__ : On a alors la date et l'heure de la reponse à notre requête qui nous est retourné par le serveur.
- __Connection: keep-alive__ : Definit que le serveur reste en ligne pour toutes demandes supplémentaires.
- __Keep-Alive: timeout=5__ : Cette ligne definit un delai de 5 secondes avant de fermer la connexion avec le serveur.
- __Transfer-Encoding: chunked__ : Il s'agit de la méthode d'envoie de la réponse. Dans le cas suivant celle-ci est envoyéen morceau

![img](https://github.com/Skyzm3n/DevWeb/blob/main/DERRIEN_Benoit_CC3/images/P1_1.1-2.png)

![img](https://github.com/Skyzm3n/DevWeb/blob/main/DERRIEN_Benoit_CC3/images/P1_1.1-1.png)

<br><br>



**Question 1.2**: donner la liste des en-têtes qui ont changé depuis la version précédente.

![img](https://github.com/Skyzm3n/DevWeb/blob/main/DERRIEN_Benoit_CC3/images/P1_1.2-1.png)

![img](https://github.com/Skyzm3n/DevWeb/blob/main/DERRIEN_Benoit_CC3/images/P1_1.2-2.png)

<br>
Depuis que l'on à changé de version on peut observer de nouvelles modifications telles que l'arrivée de: 

- __Content-Type : application/json__ :En effet cette en-tête est desormais au format JSON.
- __Conten-Lenght/ 20__ : En effet maintenat la requête nous renvoie la taille en octet de la réponse

On a par contre perdu:
- __Transfer-Encoding: chunked__ : Il s'agit de la méthode d'envoie de la réponse. Dans le cas suivant celle-ci est envoyéen morceau

<br><br>

**Question 1.3**: que contient la réponse reçue par le client ?

Le client recevra le contenu du fichier html ayant pour nom index.html au format utf-8.
Si celui-ci n'existe pas la requète n'aboutiera paset se transformera en erreur.

<br><br>

**Question 1.4**: quelle est l'erreur affichée dans la console ? Retrouver sur <https://nodejs.org/api> le code d'erreur affiché.

![img](https://github.com/Skyzm3n/DevWeb/blob/main/DERRIEN_Benoit_CC3/images/P1_1.4-1.png)
![img](https://github.com/Skyzm3n/DevWeb/blob/main/DERRIEN_Benoit_CC3/images/P1_1.4-2.png)

<br>

ENOENT (No such file or directory): Commonly raised by fs operations to indicate that a component of the specified pathname does not exist. No entity (file or directory) could be found by the given path.

- Le programme ne trouve pas le fichier en question dans dans la fonction requestListener() 

Modifier la fonction requestListener() précédente pour que le client recoive une erreur 500 si index.html est introuvable en remplacant le callback de la méthode Promise.catch().

on modifie le code alors de la façon suivant:
```js

function requestListener(_request, response) {
  fs.readFile("index.html", "utf8")
    .then((contenu_page) => {
      response.setHeader("Content-Type", "text/html");
      response.writeHead(200);
      response.end(contenu_page);
    })
    .catch((error) => {    
      console.error("Erreur lors de la lecture du fichier : Error 500", error); //On rajoute un message d'erreur dans le console
      response.writeHead(500, { "Content-Type": "text/plain" }); //Si l'erreur est une ereur de type 500 alors 
      response.end("Le fichier souhaite est introuvable : Error 500"); //In affiche le message d'erreur à l'utilisateur
    });
}

```

On peut obtenir le message suivant sur la page de l'utilisateur.

![img](https://github.com/Skyzm3n/DevWeb/blob/main/DERRIEN_Benoit_CC3/images/P1_1.4-2.png)

<br><br>

**Question 1.5**: donner le code de requestListener() modifié avec gestion d’erreur en async/await.


```js

async function requestListener(_request, response) {
  try {
    const contenu_page = await fs.readFile("index.html", "utf8");
    response.setHeader("Content-Type", "text/html");
    response.writeHead(200);
    response.end(contenu_page);
    
  } catch (error) {

    console.error("Erreur lors de la lecture du fichier : Error 500", error); //On rajoute un message d'erreur dans le console
    response.writeHead(500, { "Content-Type": "text/plain" }); //Si l'erreur est une ereur de type 500 alors 
    response.end("Le fichier souhaite est introuvable : Error 500"); //On affiche le message d'erreur à l'utilisateur
  }
}

```
<br><br>


**Mode développement**
Dans le dossier devweb-tp5 exécuter les commandes suivantes :

- npm install cross-env --save
- npm install nodemon --save-dev


**Question 1.6**: indiquer ce que cette commande a modifié dans votre projet.

On effectue les commandes citées précédement.
![img](https://github.com/Skyzm3n/DevWeb/blob/main/DERRIEN_Benoit_CC3/images/P1_1.6-1.png)

L'execution de ces commandes permettent d'installer differents addons/packtages.
Ceux-ci sont:
- __cross-env__ : packtage permettant d'utiliser des variables d'environnement non dépendantes d'un systèmes d'exploitation precis
-__nodemon__ : packtage permettant de redemarer automatiquement node.js lorsqu'il y a une modification des fichier. cela nous évite de redemarer à chaque modification le server comme precedementt.

L'execution de ces commandes modifient dans un premier temps le fichier package.json.
On passe alors de ;
![img](https://github.com/Skyzm3n/DevWeb/blob/main/DERRIEN_Benoit_CC3/images/P1_1.6-2.png)
à:
![img](https://github.com/Skyzm3n/DevWeb/blob/main/DERRIEN_Benoit_CC3/images/P1_1.6-3.png)

On obtien egalement la creation d'un fichier package-lock.json ainsi qu'un dossier node_modules avec tous les addons et les packages:
![img](https://github.com/Skyzm3n/DevWeb/blob/main/DERRIEN_Benoit_CC3/images/P1_1.6-4.png)
![img](https://github.com/Skyzm3n/DevWeb/blob/main/DERRIEN_Benoit_CC3/images/P1_1.6-5.png)





