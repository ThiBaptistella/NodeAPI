const mongoose = require('../../database');
const bcrypt = require('bcryptjs');

const ProjectSchema = new mongoose.Schema ({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  },
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
  }],
  createDate: {
    type: Date,
    default: Date.now,
  },
}, {
  usePushEach: true
});

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;

// Create User Schema (tables and parameters) and export.
