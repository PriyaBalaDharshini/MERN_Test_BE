import express from "express";
import mysql from "mysql"
import cors from 'cors'

const app = express();
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Priya@1995",
    database: "admin_dashboard"
})

app.post("/create", (req, res) => {
    const sql = "INSERT INTO f_Employee (`f_Image`, `f_Name`, `f_Email`, `f_Mobile`, `f_Designation`, `f_Gender`, `f_Course`, `f_CreatedDate`) VALUES (?)";
    const valuse = [
        req.body.f_Image,
        req.body.f_Name,
        req.body.f_Email,
        req.body.f_Mobile,
        req.body.f_Designation,
        req.body.f_Gender,
        Array.isArray(req.body.f_Course) ? req.body.f_Course.join(',') : req.body.f_Course,
        req.body.f_CreatedDate
    ]
    db.query(sql, [valuse], (err, data) => {
        if (err) return res.json(err);
        return res.json(data)
    })
})

app.put("/update/:id", (req, res) => {
    const sql = "UPDATE f_Employee set `f_Image`=?, `f_Name`=?, `f_Email`=?, `f_Mobile`=?, `f_Designation`=?, `f_Gender`=?, `f_Course`=?, `f_CreatedDate`=? where ID=?";
    const valuse = [
        req.body.f_Image,
        req.body.f_Name,
        req.body.f_Email,
        req.body.f_Mobile,
        req.body.f_Designation,
        req.body.f_Gender,
        Array.isArray(req.body.f_Course) ? req.body.f_Course.join(',') : req.body.f_Course,
        req.body.f_CreatedDate
    ]
    const id = req.params.id
    db.query(sql, [...valuse, id], (err, data) => {
        if (err) return res.json(err);
        return res.json(data)
    })
})


app.delete("/all/:id", (req, res) => {
    const sql = "DELETE FROM f_Employee where ID=?";
    const id = req.params.id
    db.query(sql, [id], (err, data) => {
        if (err) return res.json(err);
        return res.json(data)
    })
})

app.get("/all", (req, res) => {
    const sql = "SELECT * FROM f_Employee"
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data)
    })
})



app.listen(8000, () => console.log("App listening"))