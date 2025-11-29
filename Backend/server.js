const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/assets", express.static(path.join(__dirname, "assets")));

// Routes
app.use("/", require("./routes/home"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/authors", require("./routes/authors"));
app.use("/api/books", require("./routes/books"));
app.use("/api/borrows", require("./routes/borrows"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/fines", require("./routes/fines"));
app.use("/api/publishers", require("./routes/publishers"));
app.use("/api/readers", require("./routes/readers"));
app.use("/api/staffs", require("./routes/staffs"));
app.use("/api/users", require("./routes/users"));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`=> Server running on port ${PORT}`));
