const router = require("express").Router();
const Todo = require("../models/Todo");

// routes will be here....
router.get("/", async(req, res) => {
    const allTodo = await Todo.find();
    res.render("index", {todo: allTodo})
})
// routes
router
  .post("/add/todo", (req, res) => {
    const { todo } = req.body;
    const newTodo = new Todo({ todo });

    // save the todo
    newTodo
      .save()
      .then(() => {
        console.log("Successfully added todo!");
        res.redirect("/");
      })
      .catch((err) => console.log(err));
  })

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
    
        Todo.findByIdAndUpdate(_id, { $set: { todo } })
            .then(() => {
                console.log("Updated todo successfully");
                res.redirect("/");
            })
            .catch((err) => console.log(err));
    })
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
