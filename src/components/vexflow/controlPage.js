import React, { Component } from 'react';
// import { Button, Icon } from 'antd';
// import {Animated} from 'react-animated-css';
// import './landing.css';
// import Delayed from '../..//components/header/delayed';
import courseList from '../..//components/data/courseList';
import SongList from '../..//components/data/songList';
import SongDetails from '../..//components/data/songDetails';
import courseDetails from '../..//components/data/courseDetails';
import NotesPage from './notesRender';


class controlPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  getLessonCategories = () => {
    let lessonCategory = courseDetails.map((lesson) => {
      return lesson.title
    })

    lessonCategory = [...Set(lessonCategory)];
    return lessonCategory;
  }

  lessonsSelected = () => {
    this.getLessonCategories();

  }

  render () {
    return(
      <div>
        <div onClick={this.lessonsSelected}>
          Lessons
        </div>
        <div onClick={this.songsSelected}>
          Songs
        </div>
        <div>
            <NotesPage
              song = {SongDetails[0]}
            />
        </div>
      </div>
  
    )
  }
}

export default controlPage
