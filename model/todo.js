const mongoose = reuqrie('mongoose');

const todoSchema = new mongoose.Schema({

    name: { type: String, require: true, minlength:2, maxlength: 20},
    date: { type: Date, default: Date.now}

});

const Todo = mongoose.model("todo", todoSchema);

module.exports = Todo;