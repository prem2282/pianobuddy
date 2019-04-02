

import React, { Component } from 'react';
import './pianoKeys.css'
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
        <ul className="">

          <li id='F3' className="white f">f{tr+2}</li>
          <li id='F#3'  className="black fs">f#</li>
          <li id='G3'  className="white g">g{tr+2}</li>
          <li id='G#3'  className="black gs">g#</li>
          <li id='A3'  className="white a">a{tr+2}</li>
          <li id='A#3'  className="black as">a#</li>
          <li id='B3'  className="white b">b{tr+2}</li>
          <li id='C4'  className="white c">c{tr+3}</li>
          <li id='C#4'  className="black cs">c#</li>
          <li id='D4'  className="white d">d{tr+3}</li>
          <li id='D#4'  className="black ds">d#</li>
          <li id='E4'  className="white e">e{tr+3}</li>

          <li id='F4' className="white f">f{tr+3}</li>
          <li id='F#4'  className="black fs">f#</li>
          <li id='G4'  className="white g">g{tr+3}</li>
          <li id='G#4'  className="black gs">g#</li>
          <li id='A4'  className="white a">a{tr+3}</li>
          <li id='A#4'  className="black as">a#</li>
          <li id='B4'  className="white b">b{tr+3}</li>
          <li id='C5'  className="white c">c{tr+4}</li>
          <li id='C#5'  className="black cs">c#</li>
          <li id='D5'  className="white d">d{tr+4}</li>
          <li id='D#5'  className="black ds">d#</li>
          <li id='E5'  className="white e">e{tr+4}</li>

          <li id='F5' className="white f">f{tr+4}</li>
          <li id='F#5'  className="black fs">f#</li>
          <li id='G5'  className="white g">g{tr+4}</li>
          <li id='G#5'  className="black gs">g#</li>
          <li id='A5'  className="white a">a{tr+4}</li>
          <li id='A#5'  className="black as">a#</li>
          <li id='B5'  className="white b">b{tr+4}</li>
          <li id='C6'  className="white c">c{tr+5}</li>
          <li id='C#6'  className="black cs">c#</li>
          <li id='D6'  className="white d">d{tr+5}</li>
          <li id='D#6'  className="black ds">d#</li>
          <li id='E6'  className="white e">e{tr+5}</li>
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
