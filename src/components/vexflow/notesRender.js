import React, {Component} from 'react';
import Clef from "./clefandtime";
// import Voice from "./voice";
// import Voices from "./voices";
import ScrollView from "./scrollview";
import OneNoteVoice from "./oneNoteVoice";
import Delayed from '../..//components/common/delayed';
import './notes.css';
import {Animated} from 'react-animated-css';
import {Button} from 'antd';
import ReactDOM from 'react-dom';
import WebMidi from 'webmidi';
import MIDI from 'midi.js';
// import MIDISounds from 'midi-sounds-react';
import Tone from 'tone';
import NoteFormation from './noteFormation';
import NoteForTone from './noteForTone';

let input = null;
let output = null;
var context = new AudioContext();

let noteIndex = 0;
let synth = new Tone.Synth().toMaster()
let transport = Tone.Transport;

class notesRender extends Component {
    constructor(props) {
        super(props);

        let {song} = this.props
        let noteText = song.notes.map((stave_note) => { return NoteForTone(stave_note)});

        // Default state
        this.state = {
            stave_notes: song.notes,
            notes_title: song.title,
            showAll: false,
            stavesCount : song.notes.length,
            staveIndex: 0,
            showBackButton: false,
            showFrontButton: true,
            waitBeforeShow: 300,
            showPage: true,
            showButtonText: "Show All",
            refresh: false,
            showLine: true,
            noteClass: [],
            noteIndex: 0,
            noteText:noteText,
            notesVisibility:[],
        };
    };


    // setInterval( function(){
    //   let {showPage} = this.state
    //   if (!showPage) {
    //     this.setState({
    //       showPage = true
    //     })
    //   }
    // }, 1000);


    setNoteText = (staveIndex) => {
      let {stave_notes} = this.state;
      let stave_note = stave_notes[staveIndex];
      let notes = stave_note.split(' ');
      let notesTone = notes.map((note) => {
        let {keys, duration} = NoteFormation(note)
        let noteTone = keys[0].split('/').join('')
        switch (duration) {
          case 'q':
            duration = '4n'
            break;
          case 'h':
            duration = '2n'
            break;
          case 'w':
            duration = '1n'
          case '8':
          duration = '8n'
          break;
        }
        console.log({noteTone} ,{duration})
        return(
          {noteTone, duration}
        )

      })

      return(notesTone);
      // this.setState({
      //   noteText : notesTone,
      // })
    }

    playNotes = () => {

      console.clear()

      let noteText = this.state.noteText[this.state.staveIndex]
      console.log({noteText})

      // let notesVisibility = noteText.map(() => {return false});
      
      let time = Tone.Time('4n')
      noteText.forEach((note,index) => {
        console.log({note},{index},{time})
        let {noteTone, duration} = note;
        synth.triggerAttackRelease(noteTone, duration, Tone.context.currentTime + time )
        time = time + Tone.Time(duration)
        // notesVisibility[index] = true;
        // this.setState({
        //   notesVisibility : notesVisibility,
        //   notesPlayed: true,
        // })
      })
     

    }
    notesClicked = () => {

      // synth.triggerAttackRelease(noteText[noteIndex], '8n')
      // let synth = new Tone.Synth().toMaster()
      // noteText.map((note,index)=> {
      //   console.log({note},{index})
      //   console.log(index/2 + 1)
      //   synth.triggerAttackRelease(note, 1,index+1)
      // })

      // synth.triggerAttackRelease(noteText[0], .25,.5)
      // synth.triggerAttackRelease(noteText[1], .25,1)
      // synth.triggerAttackRelease(noteText[2], .25,1.5)
      // synth.triggerAttackRelease(noteText[3], .25,2)      
      // this.setState({
      //   noteIndex: noteIndex + 1
      // })

      // console.clear();

      transport.start();

      setInterval(() => {
        let {noteText} = this.state
        
        if (noteIndex === noteText.length) {
          console.log({noteIndex}, noteText.length)
          transport.stop()
          noteIndex = 0;
        }
      },10)


    }

    repeat = (time) =>  {
      console.log({time})
      let {noteText} = this.state
      let {noteTone, duration} = noteText[noteIndex];
      synth.triggerAttackRelease(noteTone, duration ,time )
      // console.log({noteTone}, {noteIndex})
      noteIndex++;

      }


    setTrasport = () => {

      console.log('setting transport');
      console.log(this.state.noteText[this.state.noteIndex])
      transport.scheduleRepeat(time => {
        this.repeat(time);
      },'4n')

    }
    componentDidMount() {
      

      context.resume().then(() => {
        console.log('Playback resumed successfully');
      });

      // let notesTone = this.setNoteText(0);

      // console.log({notesTone})

      this.inputElement.focus();
      this.setState({
        stavesCount: this.state.stave_notes.length,
        // noteText: notesTone
      })
      this.setTrasport();

      WebMidi.enable(function (err) {

        if (err) {
          console.log("WebMidi could not be enabled.", err);
        } else {
          console.log("WebMidi enabled!");
          console.log(WebMidi.inputs);
          console.log(WebMidi.outputs);

          console.log("WebMidi", WebMidi);
         input = WebMidi.inputs[0];
         output = WebMidi.outputs[0];
         if (output) {
           output.playNote("C4");
         } else {

         }
        }



      });
    }

    lineBoxSelected = (index) => {

      let {showAll} = this.state
      if (showAll) {
        this.setState({
          staveIndex: index,
          // showAll: !this.state.showAll
        })
        this.showAllClicked();
      }


    }
    notePressed = (event) => {
      console.log("key :", event.key);
      let {stave_notes, staveIndex} = this.state
      let stave_note = stave_notes[staveIndex];
      let notes = stave_note.split(' ')

      let index = notes.indexOf(event.key)
      console.log(index);

    }
    noteCount = (notes) => {
      let notesArray = notes.split(' ');
      let noteCount = 0;
      for (let i = 0; i < notesArray.length; i++) {
        let noteSplit = notesArray[i].split('-');
        if (noteSplit.length === 2) {
          let duration = noteSplit[1];
          switch (duration) {
            case "w":
              noteCount = noteCount + 4
              break;
            case "h":
              noteCount = noteCount +  2
              break;
            case "q":
              noteCount = noteCount +  1
              break;
            case "qr":
              noteCount = noteCount +  1
              break;
            default:

          }
        } else {
          noteCount = noteCount +  1
        }
      }
      return(noteCount)

    }

    noteBox = (i,note,noteCount) => {

      // let {noteClass} = this.state

      // className="noteBox " + {noteClass[i]}

      let noteWidth = window.innerWidth*.6/noteCount;
      let noteKey =  note.split('-')[0];
      let {waitBeforeShow,notesVisibility} = this.state
      return(
        <Delayed key={i} id={i} waitBeforeShow={0}>
          <Animated animationIn="flipInX" animationOut="zoomOut" isVisible={notesVisibility[i]}>
            <div className="noteBox">
              <OneNoteVoice
                noteTags = {note}
                noteWidth = {noteWidth}
                />
                <h2 className="noteTextBox">
                {noteKey}
                </h2>
            </div>
          </Animated>
        </Delayed>
      )
    }

    lineBox = (notes,i) => {
      let stave_note = notes.split(' ')
      let noteCount = this.noteCount(notes);
      let backText = "<<"
      let forwardText = ">>"
      // let noteCount = stave_note.length

      let notesBox = (
        <div  className="flexNotes">
          <div className="noteBox">
            <Clef/>
            <h2  className="noteSideBox" onClick={() => this.lineBoxSelected(i)}>Select</h2>
          </div>
          {stave_note.map((note,index) => {
            return(
              this.noteBox(index+1,note,noteCount)
            )
          })}
        </div>
      )

      let frontButton = (
        <Animated animationIn="fadeIn" animationOut="zoomOut" isVisible={this.state.showFrontButton}>
          <div
            className="notesNavButton"
            onClick = {() => this.directionButtonClicked('front')}
          >
          {forwardText}
          </div>
        </Animated>
      )

      let backButton = (
        <Animated animationIn="fadeIn" animationOut="zoomOut" isVisible={this.state.showBackButton}>
          <div
            className="notesNavButton"
            onClick = {() => this.directionButtonClicked('back')}
          >
          {backText}
        </div>
        </Animated>
      )

      return(
        <div key={i} id={i} className="lineBox">
          <h2 className="lyricBox">Lyrics of the song goes here</h2>
          <div className="notesContainter">
            {backButton}
            {notesBox}
            {frontButton}
          </div>
          <button ref={(inp) => {this.inputElement = inp}} onKeyDown={(e) => this.notePressed(e)} >focus</button>
        </div>
      )

    }


    directionButtonClicked = (direction) => {
      this.inputElement.focus();
      let {staveIndex, showFrontButton, showBackButton, stavesCount} = this.state

      if (direction === 'front') {
        if (showFrontButton) {
          staveIndex = staveIndex + 1
        }
      } else {
        if (showBackButton) {
          staveIndex = staveIndex - 1
        }
      }


      if (staveIndex < stavesCount -1 ) {
          showFrontButton= true

      } else {
          showFrontButton= false
      }

      if (staveIndex > 0) {
          showBackButton= true
      } else {
          showBackButton= false
      }

      // let notesTone = this.setNoteText(staveIndex)

      this.setState({
        staveIndex: staveIndex,
        showBackButton: showBackButton,
        showFrontButton: showFrontButton,
        refresh: true,
        showLine: false,
        // noteText: notesTone,
      })

    }

    showAllClicked = () => {

      let {staveIndex, showAll, showFrontButton,
          showBackButton, stavesCount,
          waitBeforeShow, showButtonText } = this.state

      if (!showAll) {
        //currently it is not shoiwng all. when it shows all front and back buttons should be hidden
        showFrontButton = false
        showBackButton = false
        waitBeforeShow = 0
        showButtonText = "Select a line"
      } else {
        //currently is is showing all. when changed from this
        waitBeforeShow = 300
        showButtonText = "Show All"
        if (staveIndex === 0) {
          showBackButton = false
        } else {
          showBackButton = true
        }

        if (staveIndex === stavesCount-1) {
          showFrontButton = false
        } else {
          showFrontButton = true
        }
      }


      this.setState({
        showAll:!this.state.showAll,
        showFrontButton: showFrontButton,
        showBackButton: showBackButton,
        waitBeforeShow: waitBeforeShow,
        showButtonText: showButtonText,
        refresh: true,
        // showPage: false,
      })

    }

    refreshRender = (refreshTo) => {
      this.setState({
        refresh: false,
        showLine: true,
      })
      return (
      <Animated animationInDelay={3000} animationIn="fadeIn" animationOut="zoomOut" isVisible={true}>
        <div></div>
      </Animated>
      )
    }

    render() {

        let {showAll, stave_notes, staveIndex, showButtonText, refresh, showLine, noteText, notesPlayed} = this.state
        // let stave_note = stave_notes[0].split(',')

        if (noteText.length> 0 ){
          this.playNotes();
        }
        let header = (
          <div className="notesHeaderBox">
            <h4 onClick={this.playNotes}>Click</h4>
            <h1 className="notesHeaderText">Piano Notes</h1>
            <Button className="notesHeaderText" onClick={() => this.showAllClicked()} ghost> {showButtonText} </Button>
          </div>
        )

      if (refresh) {
        return(
          <div>
          {this.refreshRender()}
          </div>
        )
      } else {
        return (
              <div className="notesPage">
                  {header}
                  {showAll?
                    <Animated animationIn="fadeIn" animationOut="zoomOut" isVisible={showAll}>
                    {stave_notes.map((stave_note,i) => {
                      return(
                        this.lineBox(stave_note,i)
                      )
                    })}
                    </Animated>
                    :
                    <Animated  animationIn="fadeIn" animationOut="fadeInRight" isVisible={showLine}>
                        {this.lineBox(stave_notes[staveIndex],staveIndex)}
                    </Animated>

                  }

              
              </div>

        );

      }
    }
}

export default notesRender;

// <ScrollView
// notes = {stave_notes[staveIndex]}
// />      

// <Stave notes={this.state.stave_notes}/>
// <Stave notes={this.state.stave_notes}/>
// <Stave notes={this.state.stave_notes}/>

// <Animated animationIn="zoomIn" animationOut="zoomOut" isVisible={true}>
//   <div className="flexNotes">
//     <Clef/>
//     <Voice/>
//     <Voices/>
//     <Voice/>
//   </div>
// </Animated>

// <div className="singles">
//   <Clef/>
//   <Singlenote
//     noteTags = {["c5","c4#","d4b","e4bb",]}/>
// </div>
//
// <ScrollView2
//   notes = {stave_notes[staveIndex]}
// />
                    {/* <Animated  animationIn="fadeOut" animationOut="fadeOut" isVisible={false}>
                      <MIDISounds 
                                  ref={(ref) => (this.midiSounds = ref)} 
                                  appElementName="root" instruments={[3]} 
                                  isVisible={false}
                                  />
                    </Animated> */}