const express = require("express");

const server = express();

server.use(express.json());

const projects = [];
let numeroRequisicoes = 0;

server.use((req, res, next) => {
  numeroRequisicoes = numeroRequisicoes + 1;
  console.time("Request");
  console.log(
    `Método: ${req.method}; URL: ${
      req.url
    }; TOTAL DE REQUISIÇÕE: ${numeroRequisicoes};`
  );

  next();

  console.timeEnd("Request");
});

function checkProjectExist(req, res, next) {
  const project = projects[req.params.id];
  if (!project) {
    return res.status(400).json({ error: "Project does not Exist" });
  }
  return next();
}

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.post("/projects", (req, res) => {
  projects.push(req.body);
  return res.json(projects);
});

server.put("/projects/:id", checkProjectExist, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects[id].title = title;
  return res.json(projects);
});

server.delete("/projects/:id", checkProjectExist, (req, res) => {
  const { index } = req.params;

  projects.splice(index, 1);

  return res.json(projects);
});

server.post("/projects/:id/tasks", checkProjectExist, (req, res) => {
  const { id } = req.params;
  const { task } = req.body;

  projects[id]["task"].push(task);
  return res.json(projects);
});

server.listen(3000);
