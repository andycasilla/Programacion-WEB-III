import { BrowserRouter, Routes, Route } from 'react-router-dom' // Requisito: Navegación con React Router

import Dashboard from './Dashboard' // Requisito: Menú principal del sistema
import Login from './pages/Login' // Requisito: Login de usuarios
import Registro from './pages/Registro' // Requisito: Registro de usuarios

function App() {

    return (

        <BrowserRouter>
            {/* Requisito: Frontend en React */}
            {/* Requisito: Navegación entre páginas */}

            <Routes>

                {/* Requisito: Autenticación de usuarios */}
                <Route
                    path="/"
                    element={<Login />}
                />

                {/* Requisito: Menú principal */}
                {/* Requisito: Gestión de productos */}
                {/* Requisito: Gestión de clientes */}
                {/* Requisito: Gestión de mantenimientos */}
                {/* Requisito: Gestión de ventas */}
                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                {/* Requisito: Registro de usuarios */}
                {/* Requisito: Roles y permisos */}
                {/* Requisito: CAPTCHA para registro */}
                <Route
                    path="/registro"
                    element={<Registro />}
                />

            </Routes>

        </BrowserRouter>

    )

}

export default App