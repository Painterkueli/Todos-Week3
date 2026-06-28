
const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const logRequest = require('./Middlewares/logger');
const validateTodo = require('./Middlewares/validator');
const validatePatch = require('./Middlewares/validatePatch');
const errorhandler = require('./Middlewares/errorhandler');
const conn = require('./Database/connDB');
const TODO = require('./Models/TodoModel');


app.use(express.json()); // Parse JSON bodies
app.use(cors("*"));
app.use(logRequest);
conn();



// GET All – Read
app.get('/todos', async (req, res) => {
  const todos = await TODO.find({}); 
  res.status(200).json(todos); // Send array as JSON
});

/*
//Only Active tasks
app.get('/todos', async (req,res) => {
  const query = req.query.completed;
  try {
    const todo = await TODO.collection('Todo').findOne({
      completed: 
    })
  } catch (error) {
    
  }
  
  res.status(200).json(todo);
})

*/
//Complete task
app.get('/todos/completed', async (req, res, next) => {
 try {
  const completed = await TODO.find({completed: true});
  res.status(200).json(completed); // Custom Read!
 } catch (error) {

  next(error);
 }
});


//GET A SINGLE TODO
app.get('/todos/:id', async (req,res, next) => {
  try {
    const todo = await TODO.findById(req.params.id);


  if (!todo) return res.status(404).json({message: 'Todo not found'});
  res.status(200).json(todo);
  } catch (error) {

    next(error);
  }
});

// POST New – Create
app.post('/todos', validateTodo, async (req, res, next) => {

   try {
   const {task, completed} = req.body;
   const newTodo = new TODO({
    task,
    completed
   })
   await newTodo.save();
   
  res.status(201).json(newTodo); // Echo back
 } catch (error) {

  next(error);
 }
});


// PATCH Update – Partial
app.patch('/todos/:id', validatePatch, async (req, res, next) => {
 try {
   const todo = await TODO.findByIdAndUpdate(req.params.id, req.body, {
    new : true
   });
    if (!todo) return res.status(404).json({message: 'Todo not found'}); 
  res.status(200).json(todo);
 } catch (error) {

  next(error);
 }
});

// DELETE Remove
app.delete('/todos/:id', async (req, res, next) => {
try {
  const todo = await TODO.findByIdAndDelete(req.params.id);
  if (!todo) return res.status(404).json({ error: 'Todo not found' });
  res.status(200).json({Message: `Todo ${req.params.id} delete`}); // Silent success
} catch (error) {
  next(error);
}
});


app.use(errorhandler);

const PORT = parseInt(process.env.PORT || 3012);
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
