import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './css/style.css';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css'
import ToDo from './pages/ToDo';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <BrowserRouter>
<ToDo/>
    </BrowserRouter>
  </StrictMode>
);



