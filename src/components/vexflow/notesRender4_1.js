

import React, {Component} from 'react';
import Clef from "./clefandtime";
// import Voice from "./voice";
// import Voices from "./voices";
import ScrollView from "./scrollview";
// import OneNoteVoice from "./oneNoteVoice";
import OneNoteSound from "./oneNoteSound";
import Delayed from '../..//components/common/delayed';
import './notes.css';
import {Animated} from 'react-animated-css';
// import {Button,Alert} from 'antd';
import ReactDOM from 'react-dom';
import WebMidi from 'webmidi';
// import MIDI from 'midi.js'; 
import MIDISounds from 'midi-sounds-react';
import Tone from 'tone';
import NoteFormation from './noteFormation';
import NoteForTone from './noteForTone';
import NoteForMidiPlayer from './noteForMidiPlayer';
import SingleNote from './singleNote3';
import PianoKeys from './pianoKeys';

// import WebAudio from './webAudioFontDemo';
import NoteToNum from './noteToNum';

let whiteKeys = [0,2,4,5,7,9,11];
let input = null;
let output = null;
let context = new AudioContext();
let instrument = 3;
let noteIndex = 0;
let synth = new Tone.Synth().toMaster()
let transport = Tone.Transport;

class notesRender extends Component {
    constructor(props) {
        super(props);

        let {song} = this.props
        let noteText = song.notes.map((stave_note) => { return NoteForTone(stave_note)});
        console.log(
          {noteText}
        );
        let noteObject = song.notes.map((stave_note) => {return NoteForMidiPlayer(stave_note)});
        let noteDelay = noteObject.map((stave_note) => {
          return(
            stave_note.map((note) => {
              return Tone.Time(note.noteDuration).toSeconds()
            })
          )
        } )
        console.log({noteObject});
        // Default state
        this.state = {
            stave_notes: song.notes,
            notes_title: song.title,
            lyrics: song.lyric,
            showAll: false,
            stavesCount : song.notes.length,
            staveIndex: 0,
            showBackButton: false,
            showFrontButton: true,
            waitBeforeShow: 500,
            showPage: true,
            showButtonText: "Show All",
            lineBoxText: "Play",
            refresh: false,
            showLine: true,
            noteClass: [],
            noteIndex: 0,
            noteText:noteText,
            noteObject: noteObject,
            notesVisibility:true,
            choiceVisibility:true,
            componentDidMount: false,
            noteDelay: noteDelay,
            firstTime:true,
            currentStaveNotes:[],
            playNotes:false,
            notesPlayEnded: false,
            time: 0,
            scrollView: false,
            playedKey: '',
            practice: false,
            webMidiEnabled: false,
            allNotesCompleted: false,
            allLinesCompleted: false,

        };
    };


    playNotes = () => {

      // console.clear()

      let noteText = this.state.noteText[this.state.staveIndex]

      console.log({noteText})

      let time = Tone.Time('4n')
      // console.log(time)
      noteText.forEach((note,index) => {
        console.log({note},{index},{time})
        let {noteTone, duration} = note;
        synth.triggerAttackRelease(noteTone, duration, Tone.context.currentTime + time )

        time = time + Tone.Time(duration)

      })


    }

    playThisNote = (i) => {

      let {noteObject, staveIndex} = this.state
      let thisNoteObject = noteObject[staveIndex][i-1]
      let notesCount = noteObject[staveIndex].length;

      console.log({i}, {notesCount});
      if (i === notesCount) {
        console.log("all notes done");
        this.setState({
          notesPlayEnded: true,
        })
      }

      // let {noteObject} =
      // console.log({noteObject})
      // let instrument = 3;
      let {noteString, noteDuration, noteScale} = thisNoteObject
      // console.log({noteString},{noteDuration},{noteScale});
      let noteNum = NoteToNum(noteString) + Number(noteScale)*12;
      // console.log({noteNum});
      let duration = Tone.Time(noteDuration).toSeconds();
      // console.log({duration});
      this.midiSounds.playChordNow(instrument, [noteNum], duration)


    }
    playNotesAlt2 = () => {

          let noteObject = this.state.noteObject[this.state.staveIndex]

          let noteDuration = this.state.noteDelay[this.state.staveIndex]
          let timeNow = Tone.context.currentTime
                console.log({noteObject})

          noteObject.forEach((note,index) => {
            let {noteString, noteScale} = note
            let noteNum = NoteToNum(noteString) + Number(noteScale)*12;
            console.log(timeNow, noteDuration[index],instrument,noteString );
            this.midiSounds.playChordAt(timeNow, instrument, [noteNum], noteDuration[index])
            timeNow = timeNow + noteDuration[index];
          })
          console.log(this.midiSounds);


    }
    playNotesAlt = () => {

      let noteObject = this.state.noteObject[this.state.staveIndex]
      console.log({noteObject})

      let time = Tone.context.currentTime;

      // console.log(time)
      noteObject.forEach((note,index) => {
        console.log({note},{index},{time})
        let {noteString, noteScale, noteDuration} = note;
        let duration = Tone.Time(noteDuration);
        let noteNum = NoteToNum(noteString) + noteScale*12;

        this.midiSounds.playChordAt(time, instrument, [noteNum], duration)
        this.setState({
          // playNotes: false,
          time: time
        })
        time = time + duration

      })


    }


    keyInputReceived = (e) => {
        console.log("Received 'noteon' message (" + e.note.name + e.note.octave + ").");
        console.log("key details:", e)
        
        let {practice, keyInputDetails, allNotesCompleted,allLinesCompleted, staveIndex, stavesCount} = this.state
        

      if (e !== keyInputDetails) {

        if (practice) {
            
          if (allLinesCompleted) {

          } else {

            if (allNotesCompleted) {
              this.processLineSelection(e, 'onDevice');
            } else {
              this.setClassForNoteBG(e,'onDevice');
            }
          }

        }

      }



    }

    playMidiNote = (index,delayTime) => {

      let {currentStaveNotes, staveIndex, noteDelay} = this.state

      let noteDuration = noteDelay[staveIndex][index]*1000
      console.log(noteDuration);
      
      let noteDetails = currentStaveNotes[index-1]
      let noteKey = noteDetails.noteString + noteDetails.noteScale;
      delayTime = "+" + delayTime
      console.log({noteKey})
      output.playNote(noteKey, 16, {duration:noteDuration, time:delayTime});
      
      let notesCount = currentStaveNotes.length
      console.log({index}, {notesCount});
      if (index  === notesCount) {
        console.log("all notes done");
        this.setState({
          notesPlayEnded: true,
        })
      }



    }


    checkForMidi = () => {
        // console.clear();
      console.log("checking for midi")


      let {webMidiEnabled} = this.state
      console.log({webMidiEnabled})
      if (webMidiEnabled) {
        console.log("WebMidi.inputs",WebMidi.inputs)
        console.log("WebMidi.outputs",WebMidi.outputs)

        if (WebMidi.outputs.length === 0) {
          console.log("output not found");
          alert('midi device not found')
          this.setState({
            webMidiEnabled: false,
          })
        }

      } 

      WebMidi.enable( (err) => {
        console.log("enable err:", err)
        if (err) {

          if (webMidiEnabled) {
            alert('Midi Device Lost');
            this.setState({
              webMidiEnabled: false
            })
          }

          console.log("WebMidi could not be enabled.", err);
        } else {
          console.log("WebMidi enabled!");
          console.log(WebMidi.inputs);
          console.log(WebMidi.outputs);
          

          if (!webMidiEnabled && WebMidi.outputs.length > 0) {
            alert('midi device connected', WebMidi.outputs);
            console.log("output found");
            this.setState({
              webMidiEnabled: true,
            })
          }


          if (webMidiEnabled && WebMidi.outputs.length === 0) {
            console.log("output not found");
            alert('midi device not found')
            this.setState({
              webMidiEnabled: false,
            })
          }


          console.log("WebMidi", WebMidi);
         input = WebMidi.inputs[0];
         output = WebMidi.outputs[0];
          //http://djipco.github.io/webmidi/latest/classes/WebMidi.html
         if (input) {

          input.addListener('noteon', 'all',
            ((e) => {this.keyInputReceived(e)})
         )
        }
         if (output) {
          //  output.playNote("C4","all", {duration:500});
         } else {

         }
        }



      });
    }
    componentDidMount() {


      context.resume().then(() => {
        console.log('Playback resumed successfully');
      });

      this.setState({
        stavesCount: this.state.stave_notes.length,
      })

      window.setInterval(() => {
        
        this.checkForMidi();
      }, 1000);


    }

    bringNextScreen = () => {

      let {staveIndex, stavesCount, allLinesCompleted} = this.state

      if (stavesCount === (staveIndex+1)) {
        allLinesCompleted = true;
      }

      window.setTimeout(() => {
        
        this.setState ({
          allNotesCompleted: true,
          allLinesCompleted: allLinesCompleted,
        })
      }, 1000);

    }

    setClassForNoteBG = (keyInputDetails,source) => {

      let playedNote = ''
      let {noteClass, staveIndex, noteObject} = this.state;
      let noteNumToCheck = noteClass.length;
      let noteToCheck = noteObject[staveIndex][noteNumToCheck].noteString + noteObject[staveIndex][noteNumToCheck].noteScale

      if (source === 'onScreen') {
        playedNote = noteObject[staveIndex][keyInputDetails-1].noteString + noteObject[staveIndex][keyInputDetails-1].noteScale
      } else {
        playedNote = keyInputDetails.note.name + keyInputDetails.note.octave
      }


      let noteId = "note" + (noteNumToCheck+1)
      let noteTextId = "noteText" + (noteNumToCheck+1)
      let noteBox = document.getElementById(noteId);
      let noteTextBox = document.getElementById(noteTextId);

      console.log({noteToCheck}, {playedNote});
      let allNotesCompleted = false;
      if (noteToCheck === playedNote) {
              if (noteNumToCheck+1 === this.state.currentStaveNotes.length) {
                allNotesCompleted = true
                this.setState({
                  notesVisibility: false,
                })
              }
              noteTextBox.classList.add('correctNoteBox')
              noteBox.classList.add('correctNoteBox')
              noteClass.push('correctNoteBox')
              this.setState({
                noteClass: noteClass,
                keyInputDetails: keyInputDetails,
                allNotesCompleted: false,
              })
      } else {
              noteBox.classList.add('wrongNoteBox')
      }

      if (allNotesCompleted) {

        this.bringNextScreen();

      }

      window.setTimeout(() => {
        noteBox.classList.remove('wrongNoteBox')
        noteBox.classList.remove('correctNoteBox')
      }, 200);

    }

    processLineSelection = (selectedChoice,source) => {

      // let {noteClass,notesVisibility,keyInputDetails} = this.state
      //WhiteKey Pressed - Repeat Same line
      //BlackKey Pressed - Go to Next line
      let repeatSameLine = true;

      if (source === 'onDevice') {
      //WhiteKey Pressed - Repeat Same line
      //BlackKey Pressed - Go to Next line
        let keyNumber = selectedChoice.note.number % 12
        let keyIndex = whiteKeys.indexOf(keyNumber)
        console.log({keyNumber}, {keyIndex})
        console.log({selectedChoice})
        //if keyIndex is -1 then it is not a whitekey
        //so blackkey is pressed. if black key is pressed set the repeatSameLine to False
        if (keyIndex < 0) {
          repeatSameLine = false;
        }
        

      } else {
      //0 - Repeat Same line
      //1 - Go to Next line
        repeatSameLine = selectedChoice;
      }

      this.setState({
        choiceVisibility: false,
        keyInputDetails:selectedChoice,
      })

      window.setTimeout(() => {
  
        if (!repeatSameLine) {
         this.directionButtonClicked('front') 
        } else {
          this.setState({
            notesVisibility: true,
            keyInputDetails: null,
            noteClass : [],
            allNotesCompleted: false,
            choiceVisibility: true,
            notesPlayEnded: false,
            keyInputDetails: selectedChoice,
          })
  
        }
      }, 1000);


    }

    lineBoxSelected = (index) => {


      let {showAll} = this.state
      if (showAll) {
        this.setState({
          staveIndex: index,
          lineBoxText: "Play"
          // showAll: !this.state.showAll
        })
        this.showAllClicked();
      } else {
        this.playNotesAlt2();
        // this.setState({
        //   notesPlayEnded: false,
        // })
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
            case "8":
              noteCount = noteCount +  .5
              break;
            case "16":
            noteCount = noteCount +  .25
              break;
            default:

          }
        } else {
          noteCount = noteCount +  1
        }
      }
      return(noteCount)

    }

    noteForVexFlow = (note) => {
      let noteKey =  note.split('-');
      let noteDetails = noteKey[0].split('')
      let noteLetter = noteDetails[0];
      let noteOctave =  noteDetails[1];
      let noteDuration = 'q';
      if (noteKey.length>1) {
         noteDuration = noteKey[1];
      }
      let noteAcc = ''
      if (noteDetails.length > 2) {
        noteAcc = noteDetails[2]
      }
      if (noteDetails.length>3) {
          noteAcc = noteAcc + noteDetails[3]
      }
      //the below will go as input to singleNote component
      let noteString = noteLetter + "/" + noteOctave + "/" + noteDuration + "/" + noteAcc
      return noteString

    }
    noteBox = (i,note,noteCount) => {

      // let {noteClass} = this.state

      // className="noteBox " + {noteClass[i]}
      let {playNotes, staveIndex, notesPlayEnded, webMidiEnabled, noteDelay} = this.state

      // console.log({componentDidMount}, {staveIndex}, {noteObject});
      let noteWidth = window.innerWidth*.6/noteCount;
      console.log({noteCount}, {noteWidth});

      let noteKey =  note.split('-');
      let noteString = this.noteForVexFlow(note);

      // let {noteDelay} = this.state;
      let noteDelayForThis = [0,...noteDelay[staveIndex]];

      let delaySoFar = 0;
      if (playNotes) {

        for (var j = 0; j < i; j++) {

          delaySoFar = delaySoFar + noteDelayForThis[j];
        }
      }

      let delayToApply = delaySoFar*1000

      if (webMidiEnabled & !notesPlayEnded) {
        this.playMidiNote(i,delayToApply)
      }


      // console.log({i},{delaySoFar},{note});

      let {notesVisibility} = this.state
      return(
        <div>
        <Delayed key={i} id={i} waitBeforeShow={delayToApply}>
            <div id = {'note' + i} className="noteBox">

            <Animated animationIn="fadeIn" animationOut="bounceOut" isVisible={notesVisibility}>
              <SingleNote
                notes = {[noteString]}
                noteCount = {noteCount}
                />
            </Animated>
            <Animated animationIn="flipInX" animationOut="bounceOut" isVisible={notesVisibility}>
                <h2 id = {'noteText' + i} className="noteTextBox" onClick={() => this.setClassForNoteBG(i,'onScreen')}>
                {noteKey[0]}
                </h2>
            </Animated>



            </div>
        </Delayed>
        {(notesPlayEnded || webMidiEnabled)?
          null
          :
          <Delayed key={'tone'+i} id={'tone'+i} waitBeforeShow={delaySoFar*1000}>
          <OneNoteSound
            noteIndex = {i}
            playThisNote = {this.playThisNote}
            />
          </Delayed>
        }

        </div>

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
          <div className="flexNotesInner">
            <div className="noteBox">
              <Clef/>
              <h2  className="noteSideBox" onClick={() => this.lineBoxSelected(i)}>{this.state.lineBoxText}</h2>
            </div>
            {stave_note.map((note,index) => {
              return(
                this.noteBox(index+1,note,noteCount)
              )
            })}
            </div>
        </div>
      )

      let frontButton = (
        <Animated className="navButtonBox" animationIn="fadeIn" animationOut="zoomOut" isVisible={this.state.showFrontButton}>
          <div
            className="notesNavButton"
            onClick = {() => this.directionButtonClicked('front')}
          >
          {forwardText}
          </div>
        </Animated>
      )

      let backButton = (
        <Animated className="navButtonBox" animationIn="fadeIn" animationOut="zoomOut" isVisible={this.state.showBackButton}>
          <div
            className="notesNavButton"
            onClick = {() => this.directionButtonClicked('back')}
          >
          {backText}
        </div>
        </Animated>
      )

      let {lyrics, staveIndex} = this.state

      let lyric = "Line : " + (i+1)
      if (lyrics.length > 0) {
        lyric = lyrics[staveIndex]
      }


      return(
        <div key={i} id={i} className="lineBox">
          <Animated animationIn="fadeIn" animationOut="zoomOut" isVisible={true}>
          <div className="notesHeader">
          {backButton}
            <h2 className="lyricBox">{lyric}</h2>
          {frontButton}
          </div>
          </Animated>
          <div className="notesContainter">
            {notesBox}
          </div>
          <PianoKeys/>
        </div>
      )

    }


    directionButtonClicked = (direction) => {
      // this.inputElement.focus();
      let {staveIndex, showFrontButton, showBackButton, stavesCount, noteObject} = this.state

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

      this.setState({
        staveIndex: staveIndex,
        showBackButton: showBackButton,
        showFrontButton: showFrontButton,
        refresh: false,
        showLine: true,
        playNotes: true,
        notesPlayEnded: false,
        allNotesCompleted: false,
        allLinesCompleted: false,
        noteIndex: 0,
        noteClass: [],
        currentStaveNotes: noteObject[staveIndex],
        notesVisibility: true,
        choiceVisibility: true,
      })

    }

    showAllClicked = () => {

      let {staveIndex, showAll, showFrontButton,
          showBackButton, stavesCount,
          waitBeforeShow, showButtonText , lineBoxText} = this.state

      if (!showAll) {
        //currently it is not shoiwng all. when it shows all front and back buttons should be hidden
        showFrontButton = false
        showBackButton = false
        waitBeforeShow = 0
        showButtonText = "Select"
        lineBoxText = "Select"
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
        lineBoxText: lineBoxText,
        refresh: false,

        
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
    backToTop = () => {
      this.setState({
        staveIndex: 0,
        showLine: true,
        firstTime: true,
        notesvisibility:false,
        showBackbutton:false,
      })
    }
    // playTestInstrument = () => {
    //   console.clear();
    //   // this.midiSounds.playChordNow(3, [65], 2.5);
    //   let duration = 2.5;
    //   let instrument = 771;

    //   for (let i = 0; i < this.midiSounds.player.loader.instrumentKeys().length; i++) {
    //       console.log( '' + (i + 0) + '. ' + this.midiSounds.player.loader.instrumentInfo(i).title );
    //   }

    //   // {'' + (i + 0) + '. ' + this.midiSounds.player.loader.instrumentInfo(i).title}


    //   let time = Tone.context.currentTime
    //   this.midiSounds.playChordAt(time + 1, instrument, [60], duration)
    //   this.midiSounds.playChordAt(time + 2, instrument, [60], duration)
    //   this.midiSounds.playChordAt(time + 3, instrument, [60], duration)
    //   console.log(this.midiSounds);
    // }

    resetSwitches = (event) => {
      let id = event.target.id
      if (id === 'practice') {
        this.setState({
          firstTime:false,
          playNotes:true,
          notesPlayEnded:false,
          showAll:false,
          scrollView:false,
          showFrontButton : true,
          showBackButton : false,
          practice: true,
          currentStaveNotes: this.state.noteObject[this.state.staveIndex],
        })

      }

      if (id === 'showAll') {
        this.setState({
          firstTime:false,
          showAll:true,
          playNotes:false,
          notesPlayEnded:true,
          scrollView:false,
          showFrontButton : false,
          showBackButton : false,
          practice: false,
        })
      }

      if (id === 'scroll') {
        this.setState({
          firstTime:false,
          scrollView:true,
          playNotes:false,
          notesPlayEnded:true,
          showAll:false,
          showFrontButton : false,
          showBackButton : false,
          practice: false,
        })
      }

      if (id === 'backToTop') {
        this.setState({
          firstTime:true,
          scrollView:false,
          playNotes:false,
          notesPlayEnded:false,
          showAll:false,
          showFrontButton : false,
          showBackButton : false,
          practice: false,
        })
      }





    }
    render() {



        let {showAll, stave_notes, staveIndex, showButtonText, refresh, scrollView, allNotesCompleted, allLinesCompleted,
           showLine, noteText, notesPlayed, playNotes, firstTime, notesVisibility,choiceVisibility, time, webMidiEnabled} = this.state
        
          //  this.checkForMidi()


        let header = (
          <div className="notesHeaderBox">
            <h4 id='backToTop' onClick={this.backToTop}>back</h4>
            <h1 className="notesHeaderText">{this.state.notes_title}</h1>
            {/* <h2 className="notesHeaderText" onClick={() => this.showAllClicked()}> {showButtonText} </h2> */}
          </div>
        )




        return (
              <div className="notesPage">
                  {header}
                  {firstTime?
                    <div>
                      <h2 id='practice' className="songOptionButton" onClick={(e) => this.resetSwitches(e)}>Practice Mode</h2>
                      <h2 id='showAll' className="songOptionButton" onClick={(e) => this.resetSwitches(e)}>Show All Notes</h2>
                      <h2 id='scroll' className="songOptionButton" onClick={(e) => this.resetSwitches(e)}>Hard Practice</h2>
                    </div>
                  :
                  <div>
                    {showAll?
                      <Animated animationIn="fadeIn" animationOut="zoomOut" isVisible={showAll}>
                      {stave_notes.map((stave_note,i) => {
                        return(
                          this.lineBox(stave_note,i)
                        )
                      })}
                      </Animated>
                      :
                      null
                    }
                    {playNotes && !allNotesCompleted?
                      <Animated  animationIn="fadeIn" animationOut="fadeInRight" isVisible={showLine}>
                          {this.lineBox(stave_notes[staveIndex],staveIndex)}
                      </Animated>
                      :null
                    }
                    {allNotesCompleted?
                      <Animated  animationIn="zoomIn" animationOut="bounceOut" isVisible={choiceVisibility}>
                        <div className="choiceContainer">
                          <div className="whiteKeyChoice" onClick={() => this.processLineSelection(true,'onScreen')}>
                            Redo
                          </div>
                          <div className="blackKeyChoice" onClick={() => this.processLineSelection(false,'onScreen')}>
                           Next  
                          </div>
                         
                          
                        </div>
                      </Animated>
                      :
                      null
                    }
                    {scrollView?
                      <ScrollView
                      notes = {stave_notes[staveIndex]}
                      />
                      :
                      null

                    }

                  </div>
                  }
                  <h2>{this.state.playedKey}</h2>
                  <Animated  animationIn="fadeOut" animationOut="fadeOut" isVisible={false}>
                  <MIDISounds
                          ref={(ref) => (this.midiSounds = ref)}
                          appElementName="root" instruments={[3,771]}
                          isVisible={false}
                          />
                  </Animated>

              </div>

        );

      // }
    }
}

export default notesRender;



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
// <Animated  animationIn="fadeOut" animationOut="fadeOut" isVisible={false}>
// <MIDISounds
//         ref={(ref) => (this.midiSounds = ref)}
//         appElementName="root" instruments={[3]}
//         isVisible={false}
//         />
// </Animated>

          // <button ref={(inp) => {this.inputElement = inp}} onKeyDown={(e) => this.notePressed(e)} >focus</button>

          // <Animated animationIn="fadeIn" animationOut="zoomOut" isVisible={notesVisibility}>
          //   <OneNoteVoice
          //     noteTags = {note}
          //     noteWidth = {noteWidth}
          //     />
          // </Animated>
