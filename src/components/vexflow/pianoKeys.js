import React, { Component } from 'react';
import './pianoKeys.css'
// import { Button, Icon } from 'antd';
// import {Animated} from 'react-animated-css';
// import './landing.css';
// import Delayed from '../..//components/header/delayed';
import SongList from './notesFile1';
import NotesPage from './notesRender';


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
          <li className="white b"></li>
          <li className="black as"></li>
          <li className="white a"></li>
          <li className="black gs"></li>
          <li className="white g"></li>
          <li className="black fs"></li>
          <li className="white f"></li>
          <li className="white e"></li>
        	<li className="black ds"></li>
      	  <li className="white d"></li>
      	  <li className="black cs"></li>
      	  <li className="white c"></li>

          <li className="white b"></li>
          <li className="black as"></li>
          <li className="white a"></li>
          <li className="black gs"></li>
          <li className="white g"></li>
          <li className="black fs"></li>
          <li className="white f"></li>
          <li className="white e"></li>
          <li className="black ds"></li>
          <li className="white d"></li>
          <li className="black cs"></li>
          <li className="white c"></li>

          <li className="white b"></li>
          <li className="black as"></li>
          <li className="white a"></li>
          <li className="black gs"></li>
          <li className="white g"></li>
          <li className="black fs"></li>
          <li className="white f"></li>
          <li className="white e"></li>
          <li className="black ds"></li>
          <li className="white d"></li>
          <li className="black cs"></li>
          <li className="white c"></li>
        </ul>
        </div>
    )
  }
}

export default PianoKeys
