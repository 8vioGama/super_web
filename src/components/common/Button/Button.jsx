import React from 'react';
import './Button.scss';

const Button = ( data ) => {
  return (
    <button name="" id="" className={data.class + " btn"}> {data.string} </button>
  );
}

export default Button;