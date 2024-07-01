import { ChangeEvent, useState } from 'react';
import './App.css'

function App() {

  const [file, setFile] = useState<File>()
  const [art, setArt] = useState<string>()

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    if (!file) {
      return;
    }

    var body = new FormData()
    body.append("file", file)

    fetch('http://localhost:3000/ascii', {
      method: 'POST',
      body: body,
    })
      .then(res => res.json())
      .then(data => setArt(data))
      .then(data => console.log(data))
      .catch(err => console.error(err))
  };

  return (
    <>
      <input type="file" onChange={handleFileChange} />
      <div>{file && `${file.name} - ${file.type}`}</div>
      <button onClick={handleUploadClick}>Upload</button>

      {art?.split('\n').map(line => <div style={{fontSize: 8, lineHeight: 1, width: 'fit-content', color: 'white', backgroundColor: 'black', overflowY: 'hidden'}}>{line}</div>)}
    </>
  )
}

export default App
