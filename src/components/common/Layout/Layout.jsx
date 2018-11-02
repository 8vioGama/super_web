import React from 'react';
import NavBar from '../NavBar/NavBar';

class Layout extends React.Component {

  render() {
    const { classes, children, title } = this.props;

    const childrenWithProps = React.Children.map(children, child =>
      React.cloneElement(child));

    return (
      <div className="">
        <NavBar />
        {childrenWithProps}
      </div>
    );
  }
}

export default Layout;
