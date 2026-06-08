import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

const ROOT_ID = 'kroger-qualitrics-root';

export default function init(context) {
  let rootElement = document.getElementById(ROOT_ID);
  if (!rootElement) {
    rootElement = document.createElement('div');
    rootElement.id = ROOT_ID;
    rootElement.style.position = 'relative';
    rootElement.style.zIndex = '2147483647';
    document.body.appendChild(rootElement);
  }

  const root = ReactDOM.createRoot(rootElement);
  root.render(<App context={context} />);
}
