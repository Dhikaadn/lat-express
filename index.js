const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const db = require("./connection");
const response = require("./response");

app.use(bodyParser.json());

app.get("/", (req, res) => {
  const sql = `SELECT * FROM mahasiswa`;
  db.query(sql, (error, result) => {
    if (error) throw error;
    response(200, result, "semua data mahasiswa", res);
  });
});

app.get("/find", (req, res) => {
  const sql = `SELECT nama_lengkap FROM mahasiswa WHERE nim=${req.query.nim}`;
  db.query(sql, (error, result) => {
    response(200, result, "find mahasiswa name", res);
  });
  // console.log("find nip:", req.query.nim);
});

app.get("/mahasiswa/:nim", (req, res) => {
  const nim = req.params.nim;
  const sql = `SELECT * FROM mahasiswa WHERE nim=${nim}`;
  db.query(sql, (error, result) => {
    if (error) throw error;
    response(200, result, "get detail mahasiswa", res);
  });
});

app.get("/cari_kelas", (req, res) => {
  const sql = `SELECT nama_lengkap FROM mahasiswa WHERE kelas=${req.query.kelas}`;
  db.query(sql, (error, result) => {
    response(200, result, "find mahasiswa by kelas", res);
  });
});

app.get("/cari_alamat", (req, res) => {
  const sql = `SELECT alamat FROM mahasiswa WHERE nama_lengkap=${req.query.nama_lengkap}`;
  db.query(sql, (error, result) => {
    response(200, result, "find alamat by nama", res);
  });
});
app.post("/login", (req, res) => {
  console.log({ requestFromOutside: req.body });
  res.send("login berhasil");
});

app.put("/username", (req, res) => {
  console.log({ updateData: req.body });
  res.send("update berhasil");
});

app.post("/register", (req, res) => {
  const { nim, nama_lengkap, kelas, alamat } = req.body;
  const sql = `INSERT INTO mahasiswa (nim, nama_lengkap, kelas, alamat) VALUES('${nim}','${nama_lengkap}',${kelas},'${alamat}')`;
  db.query(sql, (error, result) => {
    if (error) response(500, "invalid", "error", res);
    if (result?.affectedRows) {
      response(200, result.insertId, "Data added successfully", res);
    }
  });
});

app.put("/update", (req, res) => {
  const { id, nim, nama_lengkap, kelas, alamat } = req.body;
  const sql = `UPDATE mahasiswa SET nim=${nim},nama_lengkap='${nama_lengkap}',kelas=${kelas},alamat='${alamat}' WHERE id=${id}`;
  db.query(sql, (error, result) => {
    if (error) response(500, "invalid", "error", res);
    if (result?.affectedRows) {
      const data = {
        isSuccess: result.affectedRows,
        message: result.message,
      };
      response(200, data, "update data successfully", res);
    } else {
      response(404, "user not found", "error", res);
    }
  });
});

app.delete("/delete", (req, res) => {
  const { id } = req.body;
  const sql = `DELETE FROM mahasiswa WHERE id=${id}`;
  db.query(sql, (error, result) => {
    if (error) response(500, "invalid", "error", res);
    if (result?.affectedRows) {
      const data = {
        isDeleted: result.affectedRows,
      };
      response(200, data, "delete data successfully", res);
    } else {
      response(404, "user not found", "error", res);
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
