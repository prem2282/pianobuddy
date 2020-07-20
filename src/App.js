import React, { Component } from 'react';
import './App.css';
import ControlPage from './components/common/controlPage';
import DeviceOrientation, { Orientation } from 'react-screen-orientation'

class App extends Component {
  render() {
    return (
      <DeviceOrientation lockOrientation={'landscape'}>
      {/* Will only be in DOM in landscape */}
      <Orientation orientation='landscape' alwaysRender={false}>
        <div className="App">
          <ControlPage/>
        </div>
      </Orientation>
      {/* Will stay in DOM, but is only visible in portrait */}
      <Orientation orientation='portrait' alwaysRender={false}>
        <div>
          <p>Please rotate your device</p>
        </div>
      </Orientation>
    </DeviceOrientation>

    );
  }
}

export default App;
        // <ControlPage/>
