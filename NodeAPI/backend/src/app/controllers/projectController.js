const express = require('express');
const authMidleware = require('../midleware/auth');
const router = express.Router();

//import  controllers
const Project = require('../models/project');
const Task = require('../models/task');

// import the midleware and treat after next();
router.use(authMidleware);
// if authenticate is all good go next (list of the projects)
router.get('/', async (req, res) => {
  try {
    // find projects on the list and return all
    const projects = await Project.find().populate(['user', 'task']);
    return res.send({ projects });
  } catch (err) {
    return  res.status(400).send({ error: 'Error loading projects.'});
  }
});

// start CRUD for Projects
// list of 1 project
router.get('/:projectId', async (req, res) => {
  try {
    // find projects on the list and return all
    const project = await Project.findById( req.params.projectId).populate(['user', 'task']);
    return res.send({ project });
  } catch (err) {
    return  res.status(400).send({ error: 'Error loading project.'});
  }
});
// create a project
router.post('/', async (req, res) => {
  // create project and return it with userId and body
  try {
    // get title, description, task from the form
    const { title, description, tasks } = req.body;
    // create title, description, into project
    const project = await Project.create({ title, description, user: req.userId });
    // mapping all task
    await Promise.all( tasks.map( async task => {
      // create task and inclued to the project
      const projectTask = new Task({ task, project: project._id});
      // save tasks and push to the database
      await projectTask.save();
      project.tasks.push( projectTask );
    }));
    // save and update in the database
    await project.save();
    return res.send({ project });
  } catch (err) {
    console.log(err);
    return  res.status(400).send({ error: 'Error creating new project.'});
  }
});
// update
router.put('/:projectId', async (req, res) => {
  try {
    // get title, description, task from the form
    const { title, description, tasks } = req.body;
    // update title, description, into project
    const project = await Project.findByIdAndUpdate( req.params.projectId, {
      title,
      description
    }, { new: true }); // new: true => return the new value allready updated

    // delete all the taks then build again updated
    project.tasks = [];
    await Task.remove({ project: project._id });

    // mapping all task
    await Promise.all( tasks.map( async task => {
      // create task and inclued to the project
      const projectTask = new Task({ task, project: project._id});
      // save tasks and push to the database
      await projectTask.save();
      project.tasks.push( projectTask );
    }));
    // save and update in the database
    await project.save();
    return res.send({ project });
  } catch (err) {
    console.log(err);
    return  res.status(400).send({ error: 'Error updating new project.'});
  }
});
// delete
router.delete('/:projectId', async (req, res) => {
  try {
    // find projects on the list and remove
    const project = await Project.findByIdAndRemove( req.params.projectId).populate( 'user' );
    return res.send();
  } catch (err) {
    return  res.status(400).send({ error: 'Error deleting project.'});
  }
});
// end of CRUD

module.exports = app => app.use('/projects', router);
