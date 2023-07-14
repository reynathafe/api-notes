const express = require("express");
const mongoose = require("mongoose");
//const { nanoid } = require("nanoid");
const nanoid = require("nanoid").nanoid;

const app = express();
app.use(express.json());

// Menghubungkan ke database MongoDB
mongoose.connect("mongodb://localhost/notes", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Membuat model Catatan
const Note = mongoose.model("Note", {
  id: String,
  judul: String,
  tags: [String],
  body: String,
});

// Menambahkan catatan baru
app.post("/notes", async (req, res) => {
  try {
    const { judul, tags, body } = req.body;
    const id = nanoid();

    const note = new Note({ id, judul, tags, body });
    await note.save();

    res.json(note);
  } catch (error) {
    res.status(500).json({ error: "Gagal menambahkan catatan" });
  }
});

// Menampilkan semua catatan
app.get("/notes", async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil catatan" });
  }
});

// Mengubah catatan
app.put("/notes/:id", async (req, res) => {
  try {
    const { judul, tags, body } = req.body;
    const { id } = req.params;

    const note = await Note.findOneAndUpdate(
      { id },
      { judul, tags, body },
      { new: true }
    );
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengubah catatan" });
  }
});

// Menghapus catatan
app.delete("/notes/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await Note.findOneAndDelete({ id });
    res.json({ message: "Catatan berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghapus catatan" });
  }
});

// Menjalankan server
app.listen(3000, () => {
  console.log("Server berjalan pada http://localhost:3000");
});
