import React, { Component } from 'react';
// import { Button, Icon } from 'antd';
// import {Animated} from 'react-animated-css';
import './controlPage.css';
import './circles.css';
import _ from 'lodash';
// import Delayed from '../..//components/header/delayed';
import courseList from '../..//components/data/courseList';

import {getComposerList, getActorList, getDirectorList, getGenreList, getPeriodList,
   getActorSongList, getDirectorSongList, getGenreSongList, getPeriodSongList} from '../..//components/data/dataMethods';
import LessonDetails from '../..//components/data/lessonDetails';
import axios from "axios";
import {Animated} from 'react-animated-css';
import {Icon} from 'antd';
import FlatRender from './flatRender';

// import RagasPage from './ragas';

// import {MelakarthaList, formScale, createSarali, carnaticToWestern, RagaCategories, RagaSubCategories, RagaNames} from '../..//components/data/noteMethods.js';
const targetUrl = 'https://prem2282.pythonanywhere.com/api/MusicList/';

//pageId - 0:Top Level - Songs/Lessons/Ragas
//pageId - 1 Lesson selected from page 0, display list of categories
//pageId - 2 Category selected from page 1, display list of lesson names
//pageId - 3 Songs selected from page 0, display list of song categories
//pageId - 4 Category selected from page 3, display list of sub categories
//pageId - 5 Sub Category selected from page 4, display list of Songs
//pageId - 99 song or lesson or raga selected, display notes render page
//pageId - 6 Ragas selected from page 0, display list of Raga categories
//pageId - 7 Raga category selected (example Melakartha). Display list of sub categories
//pageId - 8 Raga subcategory selected (example indhuchakra). Display list of Ragas


// let songCategories = ['composer', 'director', 'actor', 'genre', 'period'];
// let songCategories = ['composer', 'language', 'scale', 'raga'];
let songCategories = ['composer', 'language', 'scale'];


// let courseList = getCourseList();
// let composerList = [...getComposerList()];
// let directorList = [...getDirectorList()];
// let actorList = [...getActorList()];
// let genreList = [...getGenreList()];
// let periodlist = [...getPeriodList()];


const getMidi = async input => {
  console.log('in getMidi');
  console.log('input', input);

  let url = targetUrl
  const  data  = await   axios.get(url, {params:{
    }})
    .then(res => {
      console.log("songlist is here");
      if (res.data.length > 0) {

              return res.data
              console.log(res.data);
      } else {
              return 'no data'
      }
    })

  console.log(data);
  return data

};



class controlPage extends Component {

//menuLevel 0 - Top menu - Songs/
  constructor(props) {
    super(props);
    this.state = {
      pageId: [0],
      songId: null,
      courseList: courseList,
      baseCategory: null,
      songCategory: null,
      subCategory: null,
      lessonList: [],
      subCatList: [],
      menuVisibility: true,
      showBackButton: false,
      headerText: ['Piano Buddy'],
      songData: [],
      songDataRecieved: false,
      editor: false,
    }
  }


  lessonsSelected = () => {

    this.setState({
      menuVisibility: false,
      baseCategory: 'lessons',
    })

    window.setTimeout(() => {

      let {pageId, headerText} = this.state
      pageId.push(1)
      headerText.push('Lessons')
      this.setState({
        pageId: pageId,
        menuVisibility: true,
        showBackButton: true,
        headerText: headerText,
      })

    }, 500);


  }


  songsSelected = () => {

    this.setState({
      menuVisibility: false,
      baseCategory: 'songs',
      editor: false,
    })

    window.setTimeout(() => {

      let {pageId, headerText} = this.state
      pageId.push(3)
      headerText.push('Songs')
      this.setState({
        pageId: pageId,
        menuVisibility: true,
        showBackButton: true,
        headerText: headerText,
      })

    }, 500);


  }



  songNumSelected = (index) => {

    let {lessonList, headerText} = this.state
    let song = lessonList[index]
    this.setState({
      song: song,
      menuVisibility: false,
    })

    window.setTimeout(() => {

      let {pageId, headerText} = this.state
      // pageId.push(99)
      pageId.push(98)
      headerText.push(song.title)
      this.setState({
        songId: index,
        pageId: pageId,
      })
      this.setState({
        pageId: pageId,
        menuVisibility: true,
        headerText:headerText,
      })

    }, 500);



  }

  lessonNumSelected = (index) => {
    let {lessonList, headerText} = this.state
    let lessonNum = lessonList[index]
    let song = LessonDetails.find(lesson => lesson.id === lessonNum)
    this.setState({
      song: song,
      menuVisibility: false,
    })

    window.setTimeout(() => {

      let {pageId} = this.state
      pageId.push(99)
      headerText.push(song.title)
      this.setState({
        pageId: pageId,
      })
      this.setState({
        pageId: pageId,
        menuVisibility: true,
        headerText:headerText,
      })

    }, 500);

  }


  songcatSelected = (input) => {

    let subCatList = [];

    let {songData} = this.state
    let composerList = [...new Set(songData.map( song => song.composer))]
    let languageList = [...new Set(songData.map( song => song.language))]
    let scaleList = [...new Set(songData.map( song => song.scale))]

    switch (input) {
      case 'composer':
          subCatList = composerList
        break;
      case 'language':
          subCatList = languageList
        break;
      case 'scale':
          subCatList = scaleList
        break;
      default:
        break;
      }

      this.setState({
        menuVisibility: false,
      })

      window.setTimeout(() => {

        let {pageId, headerText} = this.state
        pageId.push(4)
        headerText.push(input)
        this.setState({
          pageId: pageId,
          songCategory: input,
          subCatList: [...subCatList],
          menuVisibility: true,
          headerText:headerText,
        })

      }, 500);


  }

  songSubCatSelected = (input) => {

    let {songCategory, headerText, songData} = this.state
    let songList = [];



    switch (songCategory) {
      case 'composer':
          // songList = getComposerSongList(input)
            songList = songData.filter(song => song.composer === input);
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
          headerText.push(input)
          this.setState({
            pageId: pageId,
            menuVisibility: true,
            headerText:headerText,
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
      let {pageId, headerText} = this.state
      headerText.push(courseList[courseIndex].category)
      pageId.push(2)
      this.setState({
        pageId: pageId,
        lessonList: courseList[courseIndex].lessonList,
        menuVisibility: true,
        headerText:headerText,
      })

    }, 500);


  }

  pageIdA = () => {

    let musicNote = ['♫','♩','♬','♪','♯','♭','♮','°','♪','♫','♫','♩','♬','♪','♯','♭','♮','°','♪','♫','♫','♩','♬','♪','♯','♭','♮','°','♪','♫','♫','♩','♬','♪','♯','♭','♮','°','♪','♫']
    musicNote = _.shuffle(musicNote)

    let notes = (
      musicNote.map(note => {
            /*background: rgba(255, 255, 255, 0.5);*/
        let backr = Math.floor(Math.random()*255);
        let backg = Math.floor(Math.random()*255);
        let backb = Math.floor(Math.random()*255);
        let backa = Math.random();
        let color =  'rgba(' + backr + ','+ backg + ',' + backb + ',' + backa + ')'
        let top = String(Math.floor(Math.random() * Math.floor(10))*10) + '%';
        let right = String(Math.floor(Math.random() * Math.floor(10))*50 -150) + 'px';
        let widthNum = Math.floor(Math.random() * Math.floor(3)) + 1
        let width = String(widthNum) + 'rem';
        let fontSize = String(widthNum*(0.9)) + 'rem';
        let animationDelay = String(Math.floor(Math.random() * Math.floor(20))) + 's';
        let animationDuration = String(Math.floor(Math.random() * Math.floor(40))+20) + 's';
        // console.log({top},{right},{width},{fontSize},{animationDelay},{animationDuration},{color});
        return(
          <li style={{top:top,
                      right:right,
                      color:color,
                      width:width,
                      height:width,
                      fontSize:fontSize,
                      animationDuration: animationDuration,
                    }}>{note}</li>
        )
      })
    )
    return(
      <div>
            <ul className="circles">
              {notes}
            </ul>
    </div >

    )
  }

  pageId0 = () => {
    let {menuVisibility} = this.state
    let pageId = this.state.pageId[this.state.pageId.length-1]
    if (pageId===0) {
      return(
        <Animated animationIn="bounceIn" animationOut="zoomOut" isVisible={menuVisibility}>
          <div className = "controlMenuOne topMenuButton" onClick={this.lessonsSelected}>
            Lessons
          </div>
          <div className = "controlMenuOne topMenuButton" onClick={this.songsSelected}>
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
              <div key={index} id={'cat' + index} className = "controlMenuOne lessonButton" onClick={() => this.catSelected(index)}>
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
              <div key={index} id={'les' + index} className = "controlMenuOne lessonButton" onClick={() => this.lessonNumSelected(index)}>
                <div className="lessonNumBox">{index+1}</div>
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
              <div key={index} id={'songcat' + index} className = "controlMenuOne songButton" onClick={() => this.songcatSelected(category)}>
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
              <div key={index} id={'songsubcat' + index} className = "controlMenuOne songButton" onClick={() => this.songSubCatSelected(category)}>
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
              <div key={index} id={'song' + index} className = "controlMenuOne songButton" onClick={() => this.songNumSelected(index)}>
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

  // pageId6 = () => {


  //   let pageId = this.state.pageId[this.state.pageId.length-1]
  //   if (pageId===6) {
  //     let {menuVisibility} = this.state
  //     let ragaCategories = RagaCategories();

  //     return(

  //       ragaCategories.map((category,index) => {
  //         return(
  //           <Animated animationIn="bounceIn" animationOut="zoomOut" isVisible={menuVisibility}>
  //             <div key={index} id={'songcat' + index} className = "controlMenuOne ragaButton" onClick={() => this.ragacatSelected(index,category)}>
  //               {category}
  //             </div>
  //           </Animated>
  //         )
  //       })

  //     )
  //   } else {
  //     return null
  //   }

  // }

  // pageId7 = () => {


  //   let pageId = this.state.pageId[this.state.pageId.length-1]
  //   if (pageId===7) {

  //     let {menuVisibility,subCatList} = this.state
  //     return(

  //       subCatList.map((category,index) => {
  //         return(
  //           <Animated animationIn="bounceIn" animationOut="zoomOut" isVisible={menuVisibility}>
  //             <div key={index} id={'songsubcat' + index} className = "controlMenuOne ragaButton" onClick={() => this.ragaSubCatSelected(index,category)}>
  //               {category}
  //             </div>
  //           </Animated>
  //         )
  //       })

  //     )
  //   } else {
  //     return null
  //   }

  // }

  // pageId8 = () => {

  //   let pageId = this.state.pageId[this.state.pageId.length-1]
  //   if (pageId===8) {
  //     let {lessonList, menuVisibility} = this.state

  //     console.log({lessonList});


  //     return(

  //       lessonList.map((lesson,index) => {
  //         return(
  //           <Animated animationIn="bounceIn" animationOut="zoomOut" isVisible={menuVisibility}>
  //             <div key={index} id={'song' + index} className = "controlMenuOne ragaButton" onClick={() => this.ragaNumSelected(index)}>
  //               {lesson}
  //             </div>
  //           </Animated>
  //         )
  //       })

  //     )
  //   } else {
  //     return null
  //   }

  // };

  backButtonClicked = () => {
    let {pageId, showBackButton, headerText} = this.state;

    pageId.pop()
    headerText.pop()

    if (pageId.length===1) {
      showBackButton=  false
    } else {
      showBackButton= true
    }
    this.setState({
      pageId: pageId,
      headerText: headerText,
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

  async componentDidMount () {

    const songData = await getMidi();
    console.log('songData', songData);

    this.setState({
      songData: songData,
      songDataRecieved: true,
    })

  }

  render() {
    let pageId = this.state.pageId[this.state.pageId.length-1]
    let headerText = this.state.headerText[this.state.headerText.length-1]
    console.log(this.state.pageId);
    let {song} = this.state;
    let pageId0 = this.pageId0();
    let pageId1 = this.pageId1();
    let pageId2 = this.pageId2();
    let pageId3 = this.pageId3();
    let pageId4 = this.pageId4();
    let pageId5 = this.pageId5();
    // let pageId6 = this.pageId6();
    // let pageId7 = this.pageId7();
    // let pageId8 = this.pageId8();
    let pageIdA = this.pageIdA();
    let backButton = this.backButton();
    let containerClass = 'controlMenuContainer'

    switch (pageId) {
      case 0:
        containerClass = 'controlMenuContainerBase topMenuBack'
        break;
      case 1:
        containerClass = 'controlMenuContainerBase lessonBack'
        break;
      case 2:
        containerClass = 'controlMenuContainerBase lessonBack'
        break;
      case 3:
        containerClass = 'controlMenuContainerBase songBack'
        break;
      case 4:
        containerClass = 'controlMenuContainerBase songBack'
        break;
      case 5:
        containerClass = 'controlMenuContainerBase songBack'
        break;
      // case 6:
      //   containerClass = 'controlMenuContainerBase ragaBack ragagrid1'
      //   break;
      // case 7:
      //   containerClass = 'controlMenuContainerBase ragaBack ragagrid2'
      //   break;
      // case 8:
      //   containerClass = 'controlMenuContainerBase ragaBack ragagrid3'
      //   break;
      case 98:
        containerClass = 'controlMenuContainerBase songBack'
        break;
      default:



    }

    let {songData, songId, lessonList, editor} = this.state

    return(

      <div>

        {pageId<98?
          <div>
              {pageIdA}
            <div className="menuHeaderBox">
              {backButton}
              {headerText}
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

        {pageId===98?
        <FlatRender
          flatIOdata = {song}
          backButton = {this.backButtonClicked}
        />:
        null
        }
        {/* {pageId===100?
          <div>
              <NotesPage
                song = {song}
                homeButton = {this.backButtonClicked}
                baseCategory = {this.state.baseCategory}
              />
          </div>
          : null
        } */}
      {/* {pageId===101?
        <div>
        <MidiPlayerPage
          songData = {lessonList[songId]}
          backButtonClicked = {() => this.backButtonClicked()}
          editor = {this.state.editor}
        />
        </div>
        :null
      } */}

      </div>


    )
  }

}

export default controlPage
      // <RagasPage/>
