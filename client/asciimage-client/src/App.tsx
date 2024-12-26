import { ChangeEvent, useEffect, useState } from 'react';
import './App.css'
import { convertToAscii, healthCheck } from './services/asciimageService';

function App() {

  const title = "ASCI-I-MAGE"

  const [file, setFile] = useState<File>()
  const [ready, setReady] = useState<boolean>(false)
  const [art, setAscii] = useState<string>()

  useEffect(() => {
    const api = async () => {
      try {
        await healthCheck()
        setReady(true)
      } catch (err) {
        setReady(false)
      }
    }
    api()
  }, [])

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadClick = async () => {
    if (!file) {
      return;
    }

    var data = await convertToAscii(file)
    setAscii(data)
  };

  return (
    ready ? 
    <>
      <div style={{
        height: '10dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          padding: '1em 0',
        }}>
          {title.split('').map(x => <span style={{
            fontSize: '3em'
          }}>{x}</span>)}
        </div>
        <input type="file" onChange={handleFileChange} />
        <button type='button' onClick={handleUploadClick}>{">"}</button>
      </div>
      <div style={{
        height: '90dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      }}>
        {art?.split('\n').map(line => <div style={{
          fontSize: 8,
          lineHeight: 1,
          width: 'fit-content',
          backgroundColor: '#033b0c',
          color: '#cbb8f6',
          overflowY: 'hidden',
          textAlign: 'center',
          cursor: 'none'
        }}>{line}</div>)}
      </div> 
    </> :
    <h2>Service Unavailable</h2>
  )
}

export default App
