import { BrowserRouter, Route, Routes } from "react-router-dom"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/day01" element={<>1일차 미션</>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
