import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {Anacleto} from 'anacleto-frontend';
import reportWebVitals from './reportWebVitals';

//TODO  passare avanti componenti custom, logo login ecc

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Anacleto />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
