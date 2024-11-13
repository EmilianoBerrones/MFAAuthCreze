import react from 'react'
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx"
import MFAComplete from "./pages/MFAComplete.jsx";
import EnableMFA from "./pages/MFAEnable.jsx"
import MFASetup from "./pages/MFASetup.jsx";
import MFASettings from "./pages/Settings.jsx";
import NotFound from "./pages/NotFound.jsx";
import Register from "./pages/Register.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function Logout() {
    localStorage.clear();
    return <Navigate to="/login"/>
}

function RegisterAndLogout() {
    localStorage.clear();
    return <Register/>
}

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <ProtectedRoute allowTemp={false}>
                            <Home/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path='/MFAEnable'
                    element={
                        <ProtectedRoute allowTemp={true}>
                            <EnableMFA/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path='/MFASetup'
                    element={
                    <ProtectedRoute allowTemp={true}>
                        <MFASetup/>
                    </ProtectedRoute>
                    }
                />
                <Route path='/MFAComplete' element={<MFAComplete/>}/>
                <Route path="/MFASettings" element={<MFASettings/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/logout" element={<Logout/>}/>
                <Route path="/register" element={<RegisterAndLogout/>}/>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App
