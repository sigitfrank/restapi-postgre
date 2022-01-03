const express = require('express')
const app = express()
require('dotenv').config()

const PORT = process.env.PORT || 5000

const pool = require('./db')

app.use(express.json()) //req.body

app.post('/todos', async (req, res) => {
    try {
        const { description } = req.body
        const newTodo = await pool.query("INSERT INTO todo (description) VALUES ($1) RETURNING *",
            [description])

        res.status(201).json({ status: true, data: newTodo.rows[0] })

    } catch (error) {
        console.log(error.message)
    }
})

app.get('/todos', async (req, res) => {
    try {
        const todos = await pool.query("SELECT * FROM todo")
        res.status(200).json(todos.rows)
    } catch (error) {
        console.log(error.message)
    }
})

app.put('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { description } = req.body
        if (!id || !description) return res.status(400).json({ status: false })
        const updatedTodo = await pool.query("UPDATE todo SET description = $1 WHERE todo_id = $2 ", [description, id])
        if (updatedTodo.rowCount) return res.status(200).json({ status: true, message: 'Todo updated' })
        return res.status(404).json({ status: false })
    } catch (error) {
        console.log(error.message)
    }
})

app.delete('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params
        if (!id) return res.status(400).json({ status: false })
        const deletedTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1 ", [id])
        if (deletedTodo.rowCount) return res.status(200).json({ status: true, message: 'Todo deleted' })
        return res.status(404).json({ status: false })
    } catch (error) {
        console.log(error.message)
    }
})



app.listen(PORT, () => {
    console.log(`server is running on PORT ${PORT}`)
})