

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




