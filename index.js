import express from "express";
import mysql from "mysql"
import cors from 'cors';
import bcrypt from 'bcrypt';

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
    const values = [
        req.body.f_Image || null,
        req.body.f_Name,
        req.body.f_Email,
        req.body.f_Mobile,
        req.body.f_Designation,
        req.body.f_Gender,
        Array.isArray(req.body.f_Course) ? req.body.f_Course.join(',') : req.body.f_Course,
        req.body.f_CreatedDate
    ];
    db.query(sql, [values], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.put("/update/:id", (req, res) => {
    const sql = "UPDATE f_Employee set `f_Image`=?, `f_Name`=?, `f_Email`=?, `f_Mobile`=?, `f_Designation`=?, `f_Gender`=?, `f_Course`=?, `f_CreatedDate`=? where ID=?";
    const valuse = [
        req.body.f_Image || null,
        req.body.f_Name,
        req.body.f_Email,
        req.body.f_Mobile,
        req.body.f_Designation,
        req.body.f_Gender,
        Array.isArray(req.body.f_Course) ? req.body.f_Course.join(',') : req.body.f_Course,
        req.body.f_CreatedDate,

    ]
    const id = req.params.id
    db.query(sql, [...valuse, id], (err, data) => {
        console.log(data);
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
app.get("/update/:id", (req, res) => {
    const id = req.params.id;
    const sql = `SELECT * FROM f_Employee where ID= ${id}`;
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.get("/all", (req, res) => {
    const sql = "SELECT * FROM f_Employee"
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data)
    })
})

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = `INSERT INTO t_login (f_userName, f_Pwd) VALUES (?, ?)`;
        db.query(sql, [username, hashedPassword], (err, result) => {
            if (err) {
                res.status(500).send({ message: 'Internal server error' });
            } else {
                res.status(201).send({ message: 'User registered successfully' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

app.post('/', async (req, res) => {
    const { username, password } = req.body;
    const sql = `SELECT * FROM t_login WHERE f_userName = ?`;

    db.query(sql, [username], async (err, result) => {
        if (err) {
            res.status(500).send({ message: 'Internal server error' });
        } else if (result.length > 0) {
            const hashedPassword = result[0].f_Pwd;
            try {
                const match = await bcrypt.compare(password, hashedPassword);
                if (match) {
                    res.status(200).send({ message: 'Login successful', token: "wertyuio" });
                } else {
                    res.status(401).send({ message: 'Invalid username or password' });
                }
            } catch (error) {
                console.error(error);
                res.status(500).send({ message: 'Internal server error' });
            }
        } else {
            res.status(401).send({ message: 'Invalid username or password' });
        }
    });
});


app.listen(8000, () => console.log("App listening"))