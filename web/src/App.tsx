import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login"; 
import RecuperarPassword from "./pages/RecuperarPassword"; // 1. Importa la nueva página

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/recuperar-password" element={<RecuperarPassword />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App;