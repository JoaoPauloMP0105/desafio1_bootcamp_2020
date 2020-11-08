const express = require("express");
const cors = require("cors");
const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  // para listar todos os repositories
  
  return response.json(repositories);
});

// rota para cadastrar novo repositorio
app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs, 
    likes: 0,
  }

  repositories.push(repository);

  return response.json(repository);
});

// rota para atualizar repositorio
app.put("/repositories/:id", (request, response) => {
  
  const { id } = request.params;
  const { title, url, techs } = request.body;
    // Primeiramente vamos percorrer todo o array do repositories para encontrar o id especifico
    // atraves da função findIndex e encontrar o id do repositories para receber o id do repository especifico
    const findRepositoryIndex = repositories.findIndex(repository => repository.id === id );

    // Validando a informação de verificação do indice
    if (findRepositoryIndex === -1) {
        // Caso haja o erro o codigo será 400 do http code, para saber que o erro foi causado por problemas de conexão com o server
        return response.status(400).json({ error: 'Repository does not exists.' });
    }
    // Agora será criado um novo project pegando os dados 
    const repository = {
        id,
        title,
        url,
        techs,
        likes: repositories[findRepositoryIndex].likes,
    };

    // Agora vamos pegar os respositorios e percorrer todo o array de vetores e susbistitui pelo repositorio atual
    repositories[findRepositoryIndex] = repository;
    
    // Agora pegamos o retorno e iremos altera pelo repositorio atual para mostrar para o usuario
    return response.json(repository);
});

// Rota para deletar os dados.
app.delete("/repositories/:id", (request, response) => {
  // pegando o id de dentro dos params
  const { id } = request.params;


  // Primeiramente vamos percorrer todo o array do repositorio para encontrar o id especifico
  // atraves da função findIndex e encontrar o id do repositorio para receber o id do repositorio especifico
  const findRepositoryIndex = repositories.findIndex(repository => repository.id === id);

  // Validando a informação de verificação do indice
  if (findRepositoryIndex >= 0) {
      // Caso haja o erro o codigo será 400 do http code, para saber que o erro foi causado por problemas de conexão com o server
      repositories.splice(findRepositoryIndex, 1);
      
  } else {
    return response.status(400).send({ message: "Repository does not exists."});
  }
  return response.status(204).send();

});

// Rota para criar um novo like ao ser adicionado
app.post("/repositories/:id/like", (request, response) => {
  
  const { id } = request.params;


  // Primeiramente vamos percorrer todo o array dos repositorios para encontrar o id especifico
  // atraves da função findIndex e encontrar o id do repositorio para receber o id do repositorio especifico
  const findRepositoryIndex = repositories.findIndex(repository => repository.id === id);

  // Validando a informação de verificação do indice
  if (findRepositoryIndex === -1) {
    // Caso haja o erro o codigo será 400 do http code, para saber que o erro foi causado por problemas de conexão com o server
    return response.status(400).json({ error: 'Repository does not exists.' });
  }
  // função para somar um like no repositorio encontrado pelo indice dos repositorios
  repositories[findRepositoryIndex].likes += 1;

  return response.json(repositories[findRepositoryIndex]);
});
// exportando dados da page app
module.exports = app;
