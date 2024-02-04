import { BrowserRouter } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Main from './Main'
import "./assets/main.css"

//allow user to post
function App() {
  return (
    <BrowserRouter>
      <Main />
    </BrowserRouter>
  );
}

export default App;
