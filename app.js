require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const logRequest = require('./Middlewares/Logger');
const validateTodo = require('./Middlewares/validator');
const validatePatch = require('./Middlewares/validatePatch');
const errorhandler = require('./Middlewares/errorHandler');


app.use(express.json()); // Parse JSON bodies
app.use(cors("*"));
app.use(logRequest);


let todos = [
  { id: 1, task: 'Learn Node.js', completed: false },
  { id: 2, task: 'Build CRUD API', completed: false },
];

// GET All – Read
app.get('/todos', (req, res) => {
  res.status(200).json(todos); // Send array as JSON
});

//Only Active tasks
app.get('/todos/active', (req,res) => {
  const complete = false;
  const todo = todos.filter((t) => t.completed === complete);
  res.status(200).json(todo);
})

//Complete task
app.get('/todos/completed', (req, res, next) => {
 try {
  const complete = true;
  const completed = todos.filter((t) => t.completed === complete);
  res.status(200).json(completed); // Custom Read!
 } catch (error) {

  next(error);
 }
});


//GET A SINGLE TODO
app.get('/todos/:id', (req,res, next) => {
  try {
    const id = parseInt(req.params.id);

  if(isNaN(id)) throw new Error ("Invalid ID");
  const todo = todos.find((t) => t.id === id);
  if (!todo) return res.status(404).json({message: 'Todo not found'});
  res.status(200).json(todo);
  } catch (error) {

    next(error);
  }
});

// POST New – Create
app.post('/todos', validateTodo, (req, res, next) => {
 try {
   const {task} = req.body;

  if (!task || task.length <= 2){
    return res.status(400).json({message: "Please provide the task"});
  }

  const newTodo  = { id: todos.length + 1, ...req.body }; // Auto-ID
  todos.push(newTodo);
  res.status(201).json(newTodo); // Echo back
 } catch (error) {

  next(error);
 }
});


// PATCH Update – Partial
app.patch('/todos/:id', validatePatch, (req, res, next) => {
 try {
   const todo = todos.find((t) => t.id === parseInt(req.params.id)); // Array.find()
  if (!todo) return res.status(404).json({ message: 'Todo not found' });
  Object.assign(todo, req.body); // Merge: e.g., {completed: true}
  res.status(200).json(todo);
 } catch (error) {

  next(error);
 }
});

// DELETE Remove
app.delete('/todos/:id', (req, res, next) => {
try {
    const id = parseInt(req.params.id);
  const initialLength = todos.length;
  todos = todos.filter((t) => t.id !== id); // Array.filter() – non-destructive
  if (todos.length === initialLength)
    return res.status(404).json({ error: 'Not found' });
  res.status(204).send(); // Silent success
} catch (error) {
  next(error);
}
});


app.use(errorhandler);

const PORT = parseInt(process.env.PORT || 3012);
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
