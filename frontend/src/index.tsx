import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import Shop from './routes/shop'
import Cart from './routes/cart';
import Login from './routes/login';

import { ShopProvider } from './providers/shop';
import Feedback from './routes/feedback';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
    <ShopProvider>
      <Routes>
        <Route path="/" element={<App />} >
          <Route index element={<Shop />} />
          <Route path="shop" element={<Shop />} />
          <Route path="cart" element={<Cart />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="login" element={<Login />} />
          <Route path="*" element={<Navigate to="/shop" replace />} />
        </Route>
      </Routes>      
    </ShopProvider>
  </BrowserRouter>
    
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
