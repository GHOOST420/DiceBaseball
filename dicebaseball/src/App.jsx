import heroImg from './assets/hero.png'
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import Baza from './assets/Baza';

function App() {
  const [count, setCount] = useState(0)
  const [baze,setBaze]=useState([0,0,0,1])
  return (
    <>
          <Baza baze={baze} setBaze={setBaze} />
    </>
  )
}

export default App
