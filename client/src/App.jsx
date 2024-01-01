import { useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  const [code,setCode] = useState('')
  const [result,setResult] = useState('')

  async function handleSubmit(){
     console.log(code);

     const payLoad = {
      language:'java',
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
    }catch(error){
      console.log(error);
    }
  }

  return (
    <>
        <div>
           <h2>Code Compiler</h2>
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
