import { useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  const [code,setCode] = useState('')
  const [result,setResult] = useState('')
  const [language,setLanguage] = useState('java')

  async function handleSubmit(){
     console.log(code);

     const payLoad = {
      language,
      code
     }

    //  fetch('http://localhost:5000/run',{
    //   method:'POST',
    //   body:JSON.stringify(payLoad)
    //  }).then((response)=> response.json())
    //  .then((res)=> setResult(res))

    try{
      const ans =await axios.post('http://localhost:5000/run',payLoad)
      console.log(ans);
      setResult(ans.data.output)
    }catch({response}){
      if(response){
        const errorMessage = response.data.stderr
        setResult(errorMessage)
      }else{
        setResult("Something went wrong")
      }
    }
  }

  return (
    <>
        <div>
           <h2>Code Compiler</h2>
           <div>
            <select value={language} onChange={(e)=>{setLanguage(e.target.value); console.log(e.target.value);}}>
              <option value="java">JAVA</option>
              <option value="py">Python</option>
            </select>
           </div>
           <textarea name="" id="" cols="80" rows="20" value={code} onChange={(e)=> setCode(e.target.value)}>

           </textarea>

           <div>
           <button onClick={handleSubmit}>Submit</button>
           </div>
        </div>
        {result && <div>
           {result}
        </div>}
    </>
  )
}

export default App
