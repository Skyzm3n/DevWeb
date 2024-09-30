import http from "node:http";

const host = "localhost";
const port = 8000;

import fs from "node:fs/promises";

async function requestListener(request, response) {
  response.setHeader("Content-Type", "text/html");
  try {
    const section_url = request.url.split("/");

    if (section_url[1] === "index.html" || section_url[1] === "") {
      const contents = await fs.readFile("index.html", "utf8");
      response.writeHead(200);
      return response.end(contents);
    }

    if (section_url[1] === "random" && section_url.length === 3) {
      const nb = parseInt(section_url[2]);
      if (!isNaN(nb) && nb > 0) {
        const nbr_rdm = Array.from({ length: nb }, () => Math.floor(100 * Math.random()));
        response.writeHead(200);
        return response.end(`<html><p>Nombre genere aleatoirement : ${nbr_rdm.join(", ")}</p></html>`);
      } 
    }

    response.writeHead(404);
    return response.end(`<html><p>404: NOT FOUND</p></html>`);
  } catch (error) {
    console.error("Internal server error:", error);
    response.writeHead(500);
    return response.end(`<html><p>500: INTERNAL SERVER ERROR</p></html>`);
  }
}


const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
