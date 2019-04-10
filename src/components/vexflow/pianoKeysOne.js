

import React, { Component } from 'react';
import './pianoKeysOne.css'
// import { Button, Icon } from 'antd';
// import {Animated} from 'react-animated-css';
// import './landing.css';
// import Delayed from '../..//components/header/delayed';
let tr = 1;

class PianoKeys extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }


  render () {
    return(
        <div>
        <ul className="ul1">
          <li id='C4'  className="white1 c1">c{tr+3}</li>
          <li id='C#4'  className="black1 cs1">c#</li>
          <li id='D4'  className="white1 d1">d{tr+3}</li>
          <li id='D#4'  className="black1 ds1">d#</li>
          <li id='E4'  className="white1 e1">e{tr+3}</li>
          <li id='F3' className="white1 f1">f{tr+2}</li>
          <li id='F#3'  className="black1 fs1">f#</li>
          <li id='G3'  className="white1 g1">g{tr+2}</li>
          <li id='G#3'  className="black1 gs1">g#</li>
          <li id='A3'  className="white1 a1">a{tr+2}</li>
          <li id='A#3'  className="black1 as1">a#</li>
          <li id='B3'  className="white1 b1">b{tr+2}</li>
          <li id='C5'  className="white1 c1">c{tr+4}</li>
        </ul>
        </div>
    )
  }
}

export default PianoKeys

// <li className="white b"></li>
// <li className="black as"></li>
// <li className="white a"></li>
// <li className="black gs"></li>
// <li className="white g"></li>
// <li className="black fs"></li>
// <li className="white f"></li>
// <li className="white e"></li>
// <li className="black ds"></li>
// <li className="white d"></li>
// <li className="black cs"></li>
// <li className="white c"></li>
