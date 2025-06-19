import { BrowserRouter, Route, Routes } from "react-router-dom"
import Day01 from "./code/day01"
import { ErrorProvider } from "./code/day01/error/ErrorContext"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/day01" element={
          <ErrorProvider>
            <Day01 />
          </ErrorProvider>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
