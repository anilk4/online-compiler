const express = require("express");
const app = express();
const cors = require('cors')

const { generateFile } = require("./generateFile");
const { executeJava } = require("./executeJava");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors())

app.get("/", (req, res) => {
  return res.json({ message: "Hello World" });
});

app.post("/run", async (req, res) => {
  const { language = "cpp", code } = req.body;

  if (code === undefined || code === '') {
    return res.status(400).json({ success: "false", error: "code is empty" });
  }

  try {
    const filePath = await generateFile(language, code);
    const output = await executeJava(filePath);
    return res.json({ filePath,output });
  } catch (error) {
    return res.status(500).json(error)
  }
});

app.listen(5000, () => {
  console.log("listening on port 5000");
});
