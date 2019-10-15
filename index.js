const express = require('express');

const server = express();

//State
let requestCount = 0;
const projects = [];

//Middlewares
server.use(express.json());

server.use((req, res, next) => {
  requestCount++;
  console.log(`Request count: ${requestCount}`);
  return next();
})

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(element => element.id == id);
  if (project) {
    req.project = project;
    return next()
  }
  return res.status(404).json({error: 'Project id not found'});
};

//Routes
server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  projects.push({
    id,
    title,
    tasks: []
  });

  return res.json(projects);
});

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { title } = req.body;
  req.project.title = title;
  return res.json(projects);
});

server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const index = projects.findIndex(element => element.id == id);
  projects.splice(index, 1);
  return res.json(projects);
});

server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { title } = req.body;
  req.project.tasks.push(title);
  return res.json(projects);
});

//Listen
server.listen(3000);
