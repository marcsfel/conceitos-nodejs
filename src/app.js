const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");
const app = express();

app.use(express.json());
app.use(cors());

const likes = 0;

const repositories = [];

function validateRepositoryId(request, response, next){
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid ID!'});
  }
  return next();
}


app.get("/repositories", (request, response) => {
  response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  
  const repository = {
    id:uuid(),
    title,
    url,
    techs,
    likes
  }

  repositories.push(repository);

  response.json(repository);

});

app.put("/repositories/:id",validateRepositoryId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs} = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  const likes = repositories[repositoryIndex].likes;

  const repository = {
    id,
    title,
    url,
    techs,
    likes
  }

  repositories[repositoryIndex] = repository;
  response.json(repository);

});

app.delete("/repositories/:id",validateRepositoryId, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like",validateRepositoryId, (request, response) => {
  const { id } = request.params;

  const repository = repositories.find(repository => repository.id === id);

  repository.likes +=1;
  
  response.json(repository);
  

});

module.exports = app;
