const { google } = require('googleapis');
const router = require("express").Router();
const Todo = require("../models/Todo");
const session = require('express-session');

// routes 
router.get("/", async(req, res) => {
    const allTodo = await Todo.find();
    res.render("index", {todo: allTodo})
})
router.get("/about", async(req, res) => {
  res.render("about")
})

router.get("/calendar/:year?/:month?", async (req, res) => {
  const todos = await Todo.find(); // Fetch tasks from the database

  // Get current year and month from URL params, default to current date if not provided
  let year = parseInt(req.params.year) || new Date().getFullYear();
  let month = parseInt(req.params.month) || new Date().getMonth() + 1;

  // Ensure month is within valid range
  if (month < 1) {
      month = 12;
      year--;
  } else if (month > 12) {
      month = 1;
      year++;
  }

  // Get the number of days in the selected month
  const daysInMonth = new Date(year, month, 0).getDate();

  // Get current time
  const currentTime = new Date();
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();

  // Render the EJS template and pass the variables
  res.render("calendar", { currentYear: year, currentMonth: month, daysInMonth, todos, hours,
    minutes, seconds });
});
// This is for adding a new task
router
      .post("/add/todo", (req, res) => {
        const { todo, dueDate, dueTime } = req.body;
        //const newTodo = new Todo({ todo, dueDate: new Date(dueDate)});
        const dueDateTime = new Date(`${dueDate}T${dueTime}`);

        const newTodo = new Todo({
          todo: todo,
          dueDate: dueDateTime
        });
      
        newTodo.save()
          .then(() => res.redirect("/"))
          .catch(err => console.log(err));
      })

  //This is for marking a task as completed.
  .post('/complete/todo/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { completed } = req.body;
        
        await Todo.findByIdAndUpdate(id, { completed });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update task' });
    }
})

//This is for editing a task
  .get("/edit/todo/:_id", async (req, res) => {
    const { _id } = req.params;
    try {
        const todo = await Todo.findByIdAndUpdate(_id);
        if (!todo) {
            return res.status(404).send("Todo not found");
        }
        res.render("editTodo", { todo });
    } catch (err) {
        res.status(500).send("Server error");
    }
    })
    .patch("/update/todo/:_id", (req, res) => {
        const { _id } = req.params;
        const { todo } = req.body;
        const { dueDate } = req.body;
        const { dueTime } = req.body;

        const updatedDueDateTime = new Date(`${dueDate}T${dueTime}`);
    
        Todo.findByIdAndUpdate(_id, { $set: { todo: todo, dueDate: updatedDueDateTime} })
            .then(() => {
                console.log("Updated todo successfully");
                res.redirect("/");
            })
            .catch((err) => console.log(err));
    })

    //This is for deleting a task
  .get("/delete/todo/:_id", (req, res) => {
    const { _id } = req.params;
    Todo.deleteOne({ _id })
      .then(() => {
        console.log("Deleted Todo Successfully!");
        res.redirect("/");
      })
      .catch((err) => console.log(err));
  });

module.exports = router;

