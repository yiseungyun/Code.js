import { BrowserRouter, Route, Routes } from "react-router-dom"
import Day01 from "./code/day01"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/day01" element={<Day01 />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
