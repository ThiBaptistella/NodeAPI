const mongoose = require('../../database');
const bcrypt = require('bcryptjs');

const TaskSchema = new mongoose.Schema ({
  title: {
    type: String,
    require: true,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    require: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  },
  completed: {
    type: Boolean,
    require: true,
    default: false,
  },
  createDate: {
    type: Date,
    default: Date.now,
  },
}, {
  usePushEach: true
});

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;

// Create User Schema (tables and parameters) and export.
