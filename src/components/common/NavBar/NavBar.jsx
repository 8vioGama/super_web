import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
import './NavBar.scss';
import logo from '../../../assets/images/logo.png';

const NavBar = (props) => {

  const { classes, theme, title } = props;

  return (
    <div className="header">
      {/* <div className="logo">
        
      </div> */}
      <nav className="nav">
        <ul className>
          <img src={logo} alt="logo"/>
          <Link className="color--black-text" to="">Sé un superflete</Link>
        </ul>
      </nav>
    </div>
  );
}

NavBar.propTypes = {
};

export default NavBar;
