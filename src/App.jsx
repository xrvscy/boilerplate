import React, { Component } from 'react';
import { Button, DatePicker } from 'antd';
import _ from 'lodash';
import logo from './logo.svg';
import './App.scss';

/* eslint-disable */

function Logo(props) {

  function handleClick() {
    props.onClick();
  }

  return (
    <img
      onClick={handleClick}
      src={logo}
      className="App-logo"
      alt="logo"
    />
  );
}

class App extends Component {
  handleClick() {
    this.setState({
      hasClicked: true,
    });
  }

  handleBtnClick = () => {
    console.log('test');
  }

  renderBtns = () => {
    const btns = [
      {
        id: 1,
        type: 'primary',
        size: 'small',
        text: '按钮一',
      },
      {
        id: 2,
        type: 'danger',
        size: 'default',
        text: '按钮二',
      },
      {
        id: 3,
        type: 'dashed',
        size: 'small',
        text: '按钮三',
      }
    ];

    const tmp = _.find(btns, { 'type': 'dashed' });
    console.log(tmp);

    return _.map(btns, btn => (
      <Button
        key={btn.id}
        type={btn.type}
        size={btn.size}
        onClick={this.handleBtnClick}
      >
        {btn.text}
      </Button>
    ))
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <Logo onClick={this.handleClick} />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <div className="wrapper">
          {this.renderBtns()}
          <DatePicker />
        </div>
      </div>
    );
  }
}

export default App;
