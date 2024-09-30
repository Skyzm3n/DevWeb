import http from "node:http";

const host = "localhost";
const port = 8000;

import fs from "node:fs/promises";

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

console.log("NODE_ENV =", process.env.NODE_ENV);

const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
