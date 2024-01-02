import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const [language, setLanguage] = useState("java");
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);

  async function handleSubmit() {
    console.log(code);

    const payLoad = {
      language,
      code,
    };

    try {
      setJobId("")
      setStatus("")
      setResult("")
      const ans = await axios.post("http://localhost:5000/run", payLoad);
      console.log(ans);
      setJobId(ans.data.jobId);

      let interval = setInterval(async () => {
        const { data: statusRes } = await axios.get(
          "http://localhost:5000/status",
          {
            params: { id: ans.data.jobId },
          }
        );
        const { success, job, error } = statusRes;
        console.log(statusRes);

        if (success) {
          const { status: jobStatus, output: jobOutput } = job;
          setStatus(jobStatus);
          setJobDetails(job);
          if (jobStatus === "pending") return;
          setResult(jobOutput);
          clearInterval(interval);
        } else {
          console.error(error);
          setResult(error);
          setStatus("Bad request");
          clearInterval(interval);
        }
      }, 1000);
    } catch ({ response }) {
      if (response) {
        const errorMessage = response.data.stderr;
        setResult(errorMessage);
      } else {
        setResult("Something went wrong");
      }
    }
  }

  return (
    <>
      <div>
        <h2>Code Compiler</h2>
        <div>
          <select
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
              console.log(e.target.value);
            }}
          >
            <option value="java">Java</option>
            <option value="py">Python</option>
            <option value="js">Javascript</option>
          </select>
        </div>
        <textarea
          name=""
          id=""
          cols="80"
          rows="20"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
          }}
        ></textarea>

        <div>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </div>
      <p>{status}</p>
      <p>{jobId ? `Job ID: ${jobId}` : ""}</p>
      <p>{result}</p>
    </>
  );
}

export default App;
