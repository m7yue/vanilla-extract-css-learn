import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from '../components';
import { exampleStyle } from './styles.css';

ReactDOM.render(
  <React.StrictMode>
    <div className={exampleStyle}>
      <Button>button</Button>
    </div>
  </React.StrictMode>,
  document.getElementById('root')
);

export const a = 1;

export const b = false;
