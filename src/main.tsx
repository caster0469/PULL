import React from 'react';import{createRoot}from'react-dom/client';import App from './App';import'./styles.css';

window.addEventListener('error',event=>console.error('[renderer] Uncaught error:',event.error??event.message));
window.addEventListener('unhandledrejection',event=>console.error('[renderer] Unhandled rejection:',event.reason));

const root=document.getElementById('root');
if(!root)throw new Error('React mount element #root was not found');
if(!window.pull){
  console.error('[renderer] Preload API window.pull is unavailable');
  root.innerHTML='<main class="startup-error"><h1>PULL</h1><p>アプリの初期化に失敗しました。</p><small>ターミナルとDevToolsのログを確認してください。</small></main>';
}else{
  createRoot(root).render(<React.StrictMode><App/></React.StrictMode>);
}
