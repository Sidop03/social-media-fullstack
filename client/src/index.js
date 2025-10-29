// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HashRouter } from 'react-router-dom';
import './index.css'
import {Provider} from 'react-redux';
import store from './redux/store';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Missing <div id='root'> in public/index.html");

const root = ReactDOM.createRoot(rootElement);
root.render(
    <HashRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </HashRouter>
  
);
