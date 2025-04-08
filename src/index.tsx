import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);



root.render(
  <React.StrictMode>
     <GoogleOAuthProvider clientId="850757731416-nnjqpq7a5592no9b7c21llo245uobgtq.apps.googleusercontent.com">
    <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);