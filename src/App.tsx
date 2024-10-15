import './App.css'
import Home from './pages/Home'
import Header from './components/Header'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Kvkk from './pages/kvkk'


function App() {


  return (
    <>
      <Header></Header>
      <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/Kvkk" element={<Kvkk/>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
