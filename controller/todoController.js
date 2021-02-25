const Todo = require('../model/todo');
const User = require('../model/user');


const todoRender = async(req, res) => {
    console.log("todoRender");

    const sorted = +req.query.sorted || -1;
    const page = +req.query.page || 1;
    const editId = req.query.editId || -1;
    const itemsToShowPerPage = 2;
    const itemsToShow = itemsToShowPerPage * page;

    const user = await User.findOne({_id:req.user.user._id}).populate(
        {
            path: 'todoList',
            options: { 
                sort: { date: sorted },
                limit: itemsToShow
            }
        });


    console.log(req.user);
    
    if(!user) {
        console.log("No such user. going to register")
        return res.redirect('/register');
    } 

    const reachedMaxItems = itemsToShow > user.todoList.length;

    const items = user.todoList;

    console.log(items);

    res.render('index.ejs', {
        user,
        editId, 
        items,
        page,
        reachedMaxItems, 
        sorted,
        success: req.query.success, 
        error:req.query.error,
    });  

}

const todoSubmit = async (req, res) => {
    const page = +req.query.page || 1;

    const itemsToShowPerPage = 2;
    const itemsToShow = itemsToShowPerPage * page;
    
    if(req.body.task) {
        const todo = await new Todo({
            task: req.body.task 
        }).save();

        const user = await User.findOne({_id:req.user.user._id});

        user.addTodoItem(todo._id);
        
        await Todo.find().limit(itemsToShow);
        
        res.redirect("/?success=A task was added successfully!");
    } else {
        res.redirect("/?error=Please add a task!");
    }
    
}

const todoEdit = async (req,res) => {
    const id = req.params.id;
    const page = +req.query.page || 1;
    
    await Todo.findByIdAndUpdate(id, {task: req.body.task}, () => {  
        Todo.find().countDocuments();
        res.redirect("/?page=" + page + "&sorted=" + req.query.sorted);
    })     
    
}

const todoRemove = async (req, res) => {
    const id = req.params.id;
    const user = await User.findOne({_id:req.user.user._id});
    user.removeTodoItem(id);
    
    await Todo.findByIdAndRemove(id, {task: req.body.task}, () => {  
        res.redirect("/?page=" + req.query.page + "&sorted=" + req.query.sorted);
    })
    
}

module.exports = {
    todoRender,
    todoSubmit,
    todoEdit,
    todoRemove
}