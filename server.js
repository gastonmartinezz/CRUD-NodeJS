const express = require('express');
const mariadb = require('mariadb');
const app = express();
const port = 3000;

const pool = mariadb.createPool({
    host: "localhost", 
    user: "root", 
    password: "2307", 
    database: "planning",  
    connectionLimit: 5
});

app.use(express.json());

//Mostrar listado
app.get('/todo', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();

        const response = await conn.query(
        "SELECT id, name, description, created_at, updated_at, status FROM todo");
        
        res.json(response);
        
    } catch(error) {
        res.status(500).json({message: "El servidor se rompió."})
    }finally {
        if (conn) conn.release();
    }
})

//Mostrar listado de una persona con id especifico
app.get("/todo/:id", async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();

        const response = await conn.query(
        "SELECT id, name, description, created_at, updated_at, status FROM todo WHERE id=?", [req.params.id]);
        
        res.json(response[0]);
        
    } catch(error) {
        res.status(500).json({message: "El servidor se rompió."})
    }finally {
        if (conn) conn.release();
    }
})

//Insertar elemento nuevo a la tabla
app.post("/todo", async (req, res) =>{
    let conn;
    try {
        conn = await pool.getConnection();

        const response = await conn.query(
        `INSERT INTO todo(id, name, description, created_at, updated_at, status) VALUE(?, ?, ?, ?, ?, ?)`, 
        [req.body.id, req.body.name, req.body.description, req.body.created_at, req.body.updated_at, req.body.status]
        );
        
        res.json({id: parseInt(response.insertId), ...req.body});
        
    } catch(error) {
        res.status(500).json({message: "El servidor se rompió."})
    }finally {
        if (conn) conn.release();
    }
})

//Actualizar un elemento de la tabla
app.put("/todo/:id", async (req, res) =>{
    let conn;
    try {
        conn = await pool.getConnection();

        const response = await conn.query(
        `UPDATE todo SET name=?, description=?, created_at=?, updated_at=?, status=? WHERE id=?`, 
        [req.body.name, req.body.description, req.body.created_at, req.body.updated_at, req.body.status, req.params.id]
        );
        
        res.json({id: req.params.id, ...req.body});
        
    } catch(error) {
        res.status(500).json({message: "El servidor se rompió."})
    }finally {
        if (conn) conn.release();
    }
})

//Eliminar un elemento de la tabla
app.delete("/people/:id", async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();

        const response = await conn.query(`DELETE FROM todo WHERE id=?`, [req.params.id]);
        
        res.json({message: "Elemento eliminado correctamente."});
        
    } catch(error) {
        res.status(500).json({message: "El servidor se rompió."})
    } finally {
        if (conn) conn.release();
    }
})

app.listen(port, () => {
    console.log(`Servidor en http://localhost:${port}`);
})