import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { mount, shallow } from 'enzyme';
import App from './App';

Enzyme.configure({ adapter: new Adapter() });

describe('App', () => {
  let props;
  let mountedApp;
  const app = () => {
    if (!mountedApp) {
      mountedApp = mount(<App {...props} />);
    }
    return mountedApp;
  };

  beforeEach(() => {
    props = {
    };
    mountedApp = undefined;
  });

  it('always renders a div', () => {
    const divs = app().find("div");
    expect(divs.length).toBeGreaterThan(0);
  });

  // describe('OnInput', () => {
  //
  //   it("renders the right results", () => {
  //     const inputValue = '433';
  //     const event = {target: {name: "search", value: inputValue}};
  //     const wrapper = shallow(<SearchContainer transactions={transactions} />).instance();
  //     wrapper.handleChange(event)
  //
  //     const results = doSearch(inputValue, transactions);
  //
  //     expect(wrapper.state.results).toEqual(results);
  //   });
  //
  // });
});
