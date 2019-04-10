import React, { Component } from 'react';
// import { Button, Icon } from 'antd';
// import {Animated} from 'react-animated-css';
import './controlPage.css';
import './circles.css';
import _ from 'lodash';
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
import TfmToNoteObject from './tfmToNoteObject';
import {MelakarthaList, formScale, createSarali, carnaticToWestern, RagaCategories, RagaSubCategories, RagaNames} from '../..//components/data/noteMethods.js';
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


let songCategories = ['composer', 'director', 'actor', 'genre', 'period'];

// let courseList = getCourseList();
let composerList = [...getComposerList()];
let directorList = [...getDirectorList()];
let actorList = [...getActorList()];
let genreList = [...getGenreList()];
let periodlist = [...getPeriodList()];

const tmfObject = {
  baseNotes: 's r2 g3 m1 p d2 n3 S',
  Notes: [
    'g s r g s r g s r g s r p r s',
    'r g s r g s r g s r g s r p r s',
    's r g p d n S n d p',
    's r g p d n S n d p',
    's r g p d n S n d p',
    's r g p d n S n d p',
  ]
}

TfmToNoteObject(tmfObject);
formScale('C', 'major');
let Melakartha = MelakarthaList();

for (var i = 0; i < Melakartha.length; i++) {
  let sarali = createSarali(Melakartha[i]);
  console.log({sarali});
}
for (var i = 0; i < Melakartha.length; i++) {
  let westernNotes = carnaticToWestern(Melakartha[i]);
  console.log({westernNotes});
}

console.log(RagaNames());
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
      subCategory: null,
      lessonList: [],
      subCatList: [],
      menuVisibility: true,
      showBackButton: false,
      headerText: ['Piano Buddy']
    }
  }


  lessonsSelected = () => {

    this.setState({
      menuVisibility: false,
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

  ragasSelected = () => {


        this.setState({
          menuVisibility: false,
        })

        window.setTimeout(() => {

          let {pageId, headerText} = this.state
          pageId.push(6)
          headerText.push('Ragas')
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

  ragaNumSelected = (index) => {

    let {songCategory, subCategory, lessonList, headerText} = this.state
    let title = lessonList[index];
    let ragaNum = songCategory*6 + subCategory
    let ragam = Melakartha[ragaNum];
    let sarali = createSarali(ragam);
    let saraliAll = [];
    for (var i = 0; i < sarali.length; i++) {
      saraliAll.push(...sarali[i])
    }

    let westernNotes = saraliAll.map(carnatic => {
      return carnaticToWestern(carnatic).join(" ")
    });

    let lyrics = []
    for (var i = 0; i < westernNotes.length; i++) {

      let paternNum = Math.floor(i/4) + 1;
      let lineNum = i%4 + 1;
      lyrics.push('Patern ' + paternNum + ";" + "Line " + lineNum);

    }
    // console.log(lyrics);
    let song = {
      title: title,
      notes: westernNotes,
      lyric: lyrics,
    }
    // console.log({sarali});
    // console.log({saraliAll});
    // console.log({westernNotes});


    this.setState({
      song: song,
      menuVisibility: false,
    })

    window.setTimeout(() => {

      let {pageId, headerText} = this.state
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

  songNumSelected = (index) => {

    let {lessonList, headerText} = this.state
    let song = lessonList[index]
    this.setState({
      song: song,
      menuVisibility: false,
    })

    window.setTimeout(() => {

      let {pageId, headerText} = this.state
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

  ragacatSelected = (input,category) => {

    let ragaSubCatList = RagaSubCategories()[input];

    this.setState({
      menuVisibility: false,
    })

    window.setTimeout(() => {

      let {pageId, headerText} = this.state
      pageId.push(7)
      headerText.push(category + " chakras")
      this.setState({
        pageId: pageId,
        songCategory: input,
        subCatList: [...ragaSubCatList],
        menuVisibility: true,
        headerText:headerText,
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

  ragaSubCatSelected = (subCategoryIndex,subCategory) => {

    let {headerText} = this.state
    let category = this.state.songCategory;
    let ragaList = RagaNames(category,subCategoryIndex)

        this.setState({
          menuVisibility: false,
          subCategory: subCategoryIndex,
          lessonList: ragaList,
        })

        window.setTimeout(() => {

          let {pageId} = this.state
          pageId.push(8)
          headerText.push(subCategory + " chakra")
          this.setState({
            pageId: pageId,
            menuVisibility: true,
            headerText:headerText,
          })

        }, 500);

  }
  songSubCatSelected = (input) => {

    let {songCategory, headerText} = this.state
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
          <div className = "controlMenuOne" onClick={this.lessonsSelected}>
            Lessons
          </div>
          <div className = "controlMenuOne" onClick={this.songsSelected}>
            Songs
          </div>
          <div className = "controlMenuOne" onClick={this.ragasSelected}>
            Ragas
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

  pageId6 = () => {


    let pageId = this.state.pageId[this.state.pageId.length-1]
    if (pageId===6) {
      let {menuVisibility} = this.state
      let ragaCategories = RagaCategories();

      return(

        ragaCategories.map((category,index) => {
          return(
            <Animated animationIn="bounceIn" animationOut="zoomOut" isVisible={menuVisibility}>
              <div key={index} id={'songcat' + index} className = "controlMenuOne" onClick={() => this.ragacatSelected(index,category)}>
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

  pageId7 = () => {


    let pageId = this.state.pageId[this.state.pageId.length-1]
    if (pageId===7) {

      let {menuVisibility,subCatList} = this.state
      return(

        subCatList.map((category,index) => {
          return(
            <Animated animationIn="bounceIn" animationOut="zoomOut" isVisible={menuVisibility}>
              <div key={index} id={'songsubcat' + index} className = "ragaCategoryButton" onClick={() => this.ragaSubCatSelected(index,category)}>
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

  pageId8 = () => {

    let pageId = this.state.pageId[this.state.pageId.length-1]
    if (pageId===8) {
      let {lessonList, menuVisibility} = this.state

      console.log({lessonList});


      return(

        lessonList.map((lesson,index) => {
          return(
            <Animated animationIn="bounceIn" animationOut="zoomOut" isVisible={menuVisibility}>
              <div key={index} id={'song' + index} className = "ragaCategoryButton" onClick={() => this.ragaNumSelected(index)}>
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
    let pageId6 = this.pageId6();
    let pageId7 = this.pageId7();
    let pageId8 = this.pageId8();
    let pageIdA = this.pageIdA();
    let backButton = this.backButton();
    let containerClass = 'controlMenuContainer'

    switch (pageId) {
      case 0:
        containerClass = 'controlMenuContainer0'
        break;
      case 1:
        containerClass = 'controlMenuContainer2'
        break;
      case 2:
        containerClass = 'controlMenuContainer2'
        break;
      case 3:
        containerClass = 'songCategoryContainer'
        break;
      case 4:
        containerClass = 'songCategoryContainer'
        break;
      case 5:
        containerClass = 'songCategoryContainer'
        break;
      case 6:
        containerClass = 'ragaCategoryContainer'
        break;
      case 7:
        containerClass = 'ragaCategoryContainer'
        break;
      case 8:
        containerClass = 'ragaCategoryContainer'
        break;
      default:

    }



    return(

      <div>
        {pageId<99?
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
              {pageId6}
              {pageId7}
              {pageId8}
            </div>
          </div>
        :null}

        {pageId===99?
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
