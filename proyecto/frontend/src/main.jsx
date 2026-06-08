import React from 'react' // Requisito: Frontend en React
import ReactDOM from 'react-dom/client' // Requisito: Renderizado de la aplicación React

import App from './App' // Requisito: Componente principal del sistema

import 'bootstrap/dist/css/bootstrap.min.css' // Requisito: Diseño e interfaz de usuario

import './css/index.css' // Requisito: Estilos personalizados del sistema

ReactDOM.createRoot(
    document.getElementById('root')
).render(
    <App />
) // Requisito: Inicio de la aplicación React