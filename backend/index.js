const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

const { generateFile } = require("./generateFile");
const { executeJava } = require("./executeJava");
const { executePython } = require("./executePython");
const { executeJS } = require("./executeJavascript");
const {executeCpp } = require("./executeCpp")


const Job = require("./models/job");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

async function dbConnection() {
  try {
    await mongoose.connect(
      "mongodb+srv://anilkumarkclk:1AY18ec%4010@cluster0.rzxbmn9.mongodb.net/online-compiler"
    );
    console.log("db connected successfully");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
dbConnection();

app.get("/", (req, res) => {
  return res.json({ message: "Hello World" });
});

app.post("/run", async (req, res) => {
  const { language = "java", code } = req.body;
  console.log(language);

  if (code === undefined || code.length <= 0) {
    return res.status(500).json({ success: "false", error: "code is empty" });
  }

  let job;
  try {
    const filepath = await generateFile(language, code);

    job = await new Job({ language, filepath }).save();
    if (job === undefined) {
      throw Error(`cannot find Job with id ${jobId}`);
    }
    const jobId = job["_id"];
    console.log("job: ", job);

    res.status(200).json({ success: true, jobId });

    let output;
    job["startedAt"] = new Date();
    if (language === "java") {
      output = await executeJava(filepath);
    } else if (language === "py") {
      output = await executePython(filepath);
    } else if(language === 'cpp') {
      output = await executeCpp(filepath);
    } else if(language === "js"){
      console.log("js here");
      output = await executeJS(filepath)
      console.log('output ',output);
    }

    job["completedAt"] = new Date();
    job["status"] = "success";
    job["output"] = output;

    await job.save();

    console.log(job);
    // return res.json({ filePath, output });
  } catch (error) {

    if(job){
      job['completedAt'] = new Date()
      job['status']="error"
      job['output']=JSON.stringify(error)
      await job.save()
  }

    console.error(JSON.stringify(error));
    // return res.status(500).json(error);
  }
});

app.get("/status", async (req, res) => {
  const jobId = req.query.id;

  if (jobId === undefined) {
    return res
      .status(400)
      .json({ success: false, error: "missing id query param" });
  }

  const job = await Job.findById(jobId);

  if (job === undefined) {
    return res.status(400).json({ success: false, error: "couldn't find job" });
  }

  return res.status(200).json({ success: true, job });
});

app.listen(5000, () => {
  console.log("listening on port 5000");
});
