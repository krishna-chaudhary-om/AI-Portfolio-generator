import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout.jsx'
import Home from './pages/Home.jsx'
import Preview from './pages/Preview.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/preview" element={<Preview />} />
      </Route>
    </Routes>
  )
}
