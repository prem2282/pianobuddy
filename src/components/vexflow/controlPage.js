import React, { Component } from 'react';
// import { Button, Icon } from 'antd';
// import {Animated} from 'react-animated-css';
import './controlPage.css';
// import Delayed from '../..//components/header/delayed';
import courseList from '../..//components/data/courseList';
import SongList from '../..//components/data/songList';
import SongDetails from '../..//components/data/songDetails';
import {getComposerList, getActorList, getDirectorList, getGenreList, getPeriodList,
  getComposerSongList, getActorSongList, getDirectorSongList, getGenreSongList, getPeriodSongList} from '../..//components/data/dataMethods';
import LessonDetails from '../..//components/data/lessonDetails';
import NotesPage from './notesRender';
import {Animated} from 'react-animated-css';
import {Icon, message} from 'antd';
//pageId - 0:Top Level - Songs/Lessons
//pageId - 1 Lesson selected from page 0, display list of categories
//pageId - 2 Category selected from page 1, display list of lesson names
//pageId - 3 Songs selected from page 0, display list of song categories
//pageId - 4 Category selected from page 3, display list of sub categories
//pageId - 5 Sub Category selected from page 4, display list of Songs
//pageId - 6 song or lesson selected, display notes render page
let songCategories = ['composer', 'director', 'actor', 'genre', 'period'];

// let courseList = getCourseList();
let composerList = [...getComposerList()];
let directorList = [...getDirectorList()];
let actorList = [...getActorList()];
let genreList = [...getGenreList()];
let periodlist = [...getPeriodList()];

// console.log({composerList});
// // let composerSongList = getComposerSongList(composerList[0]);
// console.log({composerSongList});
class controlPage extends Component {

//menuLevel 0 - Top menu - Songs/
  constructor(props) {
    super(props);
    this.state = {
      pageId: [0],
      courseList: courseList,
      songCategory: null,
      lessonList: [],
      subCatList: [],
      menuVisibility: true,
      showBackButton: false,
    }
  }


  lessonsSelected = () => {

    this.setState({
      menuVisibility: false,
    })

    window.setTimeout(() => {

      let {pageId} = this.state
      pageId.push(1)
      this.setState({
        pageId: pageId,
        menuVisibility: true,
        showBackButton: true,
      })

    }, 500);


  }

  songsSelected = () => {

    this.setState({
      menuVisibility: false,
    })

    window.setTimeout(() => {

      let {pageId} = this.state
      pageId.push(3)
      this.setState({
        pageId: pageId,
        menuVisibility: true,
        showBackButton: true,
      })

    }, 500);


  }

  songNumSelected = (index) => {

    let {lessonList} = this.state
    let song = lessonList[index]
    this.setState({
      song: song,
      menuVisibility: false,
    })

    window.setTimeout(() => {

      let {pageId} = this.state
      pageId.push(6)
      this.setState({
        pageId: pageId,
      })
      this.setState({
        pageId: pageId,
        menuVisibility: true,
      })

    }, 500);



  }
  lessonNumSelected = (index) => {
    let {lessonList} = this.state
    let lessonNum = lessonList[index]
    let song = LessonDetails.find(lesson => lesson.id === lessonNum)
    this.setState({
      song: song,
      menuVisibility: false,
    })

    window.setTimeout(() => {

      let {pageId} = this.state
      pageId.push(6)
      this.setState({
        pageId: pageId,
      })
      this.setState({
        pageId: pageId,
        menuVisibility: true,
      })

    }, 500);

  }

  songcatSelected = (input) => {

    let subCatList = [];

    switch (input) {
      case 'composer':
          subCatList = getComposerList(input)
        break;
      case 'director':
          subCatList = getDirectorList(input)
        break;
      case 'actor':
          subCatList = getActorList(input)
        break;
      case 'genre':
          subCatList = getGenreList(input)
        break;
      case 'period':
          subCatList = getPeriodList(input)
        break;
      default:
        break;
      }

      this.setState({
        menuVisibility: false,
      })

      window.setTimeout(() => {

        let {pageId} = this.state
        pageId.push(4)
        this.setState({
          pageId: pageId,
          songCategory: input,
          subCatList: [...subCatList],
          menuVisibility: true,
        })

      }, 500);


  }
  songSubCatSelected = (input) => {

    let {songCategory} = this.state
    let songList = [];

    switch (songCategory) {
      case 'composer':
          songList = getComposerSongList(input)
          console.log({songList});
        break;
      case 'director':
          songList = getDirectorSongList(input)
        break;
      case 'actor':
          songList = getActorSongList(input)
        break;
      case 'genre':
          songList = getGenreSongList(input)
        break;
      case 'period':
          songList = getPeriodSongList(input)
        break;
      default:
        break;

    }
    console.log({songList});

        this.setState({
          menuVisibility: false,
          lessonList: songList,
        })

        window.setTimeout(() => {

          let {pageId} = this.state
          pageId.push(5)
          this.setState({
            pageId: pageId,
            menuVisibility: true,
          })

        }, 500);

  }
  catSelected = (courseIndex) => {

    this.setState({
      menuVisibility: false,
    })

    window.setTimeout(() => {

      console.log({courseIndex});
      console.log(courseList[courseIndex].lessonList);
      let {pageId} = this.state
      pageId.push(2)
      this.setState({
        pageId: pageId,
        lessonList: courseList[courseIndex].lessonList,
        menuVisibility: true,
      })

    }, 500);


  }

  pageId0 = () => {
    let {menuVisibility} = this.state
    let pageId = this.state.pageId[this.state.pageId.length-1]
    if (pageId===0) {
      return(
        <Animated animationIn="bounceIn" animationOut="zoomOut" isVisible={menuVisibility}>
          <div className = "controlMenuOne" onClick={this.lessonsSelected}>
            Lessons
          </div>
          <div className = "controlMenuOne" onClick={this.songsSelected}>
            Songs
          </div>
        </Animated>
      )
    } else {
      return null
    }

  }



  pageId1 = () => {


    let {courseList,menuVisibility} = this.state
    let pageId = this.state.pageId[this.state.pageId.length-1]
    if (pageId===1) {
      return(

        courseList.map((course,index) => {
          return(
            <Animated animationIn="bounceIn" animationOut="zoomOut" isVisible={menuVisibility}>
              <div key={index} id={'cat' + index} className = "controlMenuOne" onClick={() => this.catSelected(index)}>
                {course.category}
              </div>
            </Animated>
          )
        })

      )
    } else {
      return null
    }

  }

  pageId2 = () => {

    let pageId = this.state.pageId[this.state.pageId.length-1]

    if (pageId===2) {

      let {lessonList, menuVisibility} = this.state

      let lessonNames = lessonList.map(lessonNum => {
        let lessonName = LessonDetails.find(lesson => lesson.id === lessonNum ).title
        return(
          lessonName
        )
      })

      return(

        lessonNames.map((lesson,index) => {
          return(
            <Animated animationIn="bounceIn" animationOut="zoomOut" isVisible={menuVisibility}>
              <div key={index} id={'les' + index} className = "controlMenuOne" onClick={() => this.lessonNumSelected(index)}>
                {lesson}
              </div>
            </Animated>
          )
        })

      )
    } else {
      return null
    }

  }

  pageId3 = () => {


    let pageId = this.state.pageId[this.state.pageId.length-1]
    if (pageId===3) {
      let {menuVisibility} = this.state

      return(

        songCategories.map((category,index) => {
          return(
            <Animated animationIn="bounceIn" animationOut="zoomOut" isVisible={menuVisibility}>
              <div key={index} id={'songcat' + index} className = "controlMenuOne" onClick={() => this.songcatSelected(category)}>
                {category}
              </div>
            </Animated>
          )
        })

      )
    } else {
      return null
    }

  }


  pageId4 = () => {


    let pageId = this.state.pageId[this.state.pageId.length-1]
    if (pageId===4) {

      let {menuVisibility,subCatList} = this.state
      return(

        subCatList.map((category,index) => {
          return(
            <Animated animationIn="bounceIn" animationOut="zoomOut" isVisible={menuVisibility}>
              <div key={index} id={'songsubcat' + index} className = "controlMenuOne" onClick={() => this.songSubCatSelected(category)}>
                {category}
              </div>
            </Animated>
          )
        })

      )
    } else {
      return null
    }

  }


  pageId5 = () => {

    let pageId = this.state.pageId[this.state.pageId.length-1]
    if (pageId===5) {
      let {lessonList, menuVisibility} = this.state

      console.log({lessonList});

      let lessonNames = lessonList.map(song => {
        return(
          song.title
        )
      });

      console.log({lessonNames});

      return(

        lessonNames.map((lesson,index) => {
          return(
            <Animated animationIn="bounceIn" animationOut="zoomOut" isVisible={menuVisibility}>
              <div key={index} id={'song' + index} className = "controlMenuOne" onClick={() => this.songNumSelected(index)}>
                {lesson}
              </div>
            </Animated>
          )
        })

      )
    } else {
      return null
    }

  };


  backButtonClicked = () => {
    let {pageId, showBackButton} = this.state;

    pageId.pop()

    if (pageId.length===1) {
      showBackButton=  false
    } else {
      showBackButton= true
    }
    this.setState({
      pageId: pageId,
      showBackButton:showBackButton,
    })

  };


  backButton = () => {
    let {showBackButton} = this.state
    return (
      <Animated className="menuButtonBox" animationIn="fadeIn" animationOut="zoomOut" isVisible={showBackButton}>
        <div
          className="menuNavButton"
          onClick = {() => this.backButtonClicked()}
        >
          <Icon type="double-left" />
      </div>
      </Animated>
    )
  };


  render() {
    let pageId = this.state.pageId[this.state.pageId.length-1]
    console.log(this.state.pageId);
    let {song} = this.state;
    let pageId0 = this.pageId0();
    let pageId1 = this.pageId1();
    let pageId2 = this.pageId2();
    let pageId3 = this.pageId3();
    let pageId4 = this.pageId4();
    let pageId5 = this.pageId5();
    let backButton = this.backButton();
    let containerClass = 'controlMenuContainer'
    if (pageId === 0) {
      containerClass = 'controlMenuContainer1'
    } else {
      containerClass = 'controlMenuContainer'
    }

    return(
      <div>
        
        

        {pageId<6?
          <div>
            <div className="menuHeaderBox">
              {backButton}
            </div>
            <div className={containerClass}>
              {pageId0}
              {pageId1}
              {pageId2}
              {pageId3}
              {pageId4}
              {pageId5}
            </div>
          </div>
        :null}

        {pageId===6?
          <div>
              <NotesPage
                song = {song}
                homeButton = {this.backButtonClicked}
              />
          </div>
          :
          <div>
          <NotesPage
            song = {null}
            homeButton = {this.backButtonClicked}
          />
      </div>
        }
      </div>


    )
  }

}

export default controlPage
