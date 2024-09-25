import http from "node:http";

const host = "localhost";
const port = 8000;

import fs from "node:fs/promises";

function requestListener(_request, response) {
  fs.readFile("index.html", "utf8")
    .then((contents) => {
      response.setHeader("Content-Type", "text/html");
      response.writeHead(200);
      response.end(contents);
    })
    .catch((error) => {    
      console.error("Erreur lors de la lecture du fichier:", error); //On rajoute un messae d'erreur dansle console

      response.end("Le fichier souhaite est introuvable.");
    });
}




const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
