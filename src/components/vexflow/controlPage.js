import React, { Component } from 'react';
// import { Button, Icon } from 'antd';
// import {Animated} from 'react-animated-css';
// import './landing.css';
// import Delayed from '../..//components/header/delayed';
import SongList from './notesFile1';
import NotesPage from './notesRender';


class controlPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }


  render () {
    return(
        <div>
            <NotesPage
              song = {SongList[0]}
            />
        </div>
    )
  }
}

export default controlPage
