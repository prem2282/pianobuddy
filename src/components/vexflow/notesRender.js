

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
import {Icon, message, Modal} from 'antd';
import ReactDOM from 'react-dom';
import WebMidi from 'webmidi';
// import MIDI from 'midi.js';
import MIDISounds from 'midi-sounds-react';
import Tone from 'tone';
import NoteFormation from './noteFormation';
import NoteForTone from './noteForTone';
import NoteForVex from './noteForVex';
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
        // let noteText = song.notes.map((stave_note) => { return NoteForTone(stave_note)});
        // console.log(
        //   {noteText}
        // );
        let noteObject = null;
        let noteStr = null;
        let noteDelay = null;
        let title = null;
        let stavesCount = 0;
        let lyrics = null;
        let image = null;
        if (song) {
           title = song.title;
           lyrics = song.lyric;
           image = song.image;
           stavesCount = song.notes.length;
           noteObject = song.notes.map((stave_note) => {return NoteForMidiPlayer(stave_note)});
           noteStr = song.notes.map((stave_note) => {return NoteForVex(stave_note)})
           noteDelay = noteObject.map((stave_note) => {
            return(
              stave_note.map((note) => {
                return Tone.Time(note.noteDuration).toSeconds()
              })
            )
          } )
        }

        console.log({noteObject});
        // Default state
        this.state = {
            // stave_notes: song.notes,
            stave_notes: noteStr,
            notes_title: title,
            lyrics: lyrics,
            image: image,
            showAll: false,
            stavesCount : stavesCount,
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
            errorCount: 0,
            // noteText:noteText,
            noteObject: noteObject,
            notesVisibility:true,
            choiceVisibility:true,
            songMenuVisibility:true,
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
            webMidiInitialized: false,
            allNotesCompleted: false,
            allLinesCompleted: false,
            keyInputDetails: null,
            printedText: [],
            showPrint: false,
            modalVisible: false,
            songInputAvailable:false,
        };
    };


    // playNotes = () => {
    //
    //   // console.clear()
    //
    //   let noteText = this.state.noteText[this.state.staveIndex]
    //
    //   console.log({noteText})
    //
    //   let time = Tone.Time('4n')
    //   // console.log(time)
    //   noteText.forEach((note,index) => {
    //     console.log({note},{index},{time})
    //     let {noteTone, duration} = note;
    //     synth.triggerAttackRelease(noteTone, duration, Tone.context.currentTime + time )
    //
    //     time = time + Tone.Time(duration)
    //
    //   })
    //
    //
    // }

    initializeSong = () => {
      let {song} = this.props

      let title = song.title;
      let  lyrics = song.lyric;
      let  image = song.image;
      let  stavesCount = song.notes.length;
      let  noteObject = song.notes.map((stave_note) => {return NoteForMidiPlayer(stave_note)});
      let  noteStr = song.notes.map((stave_note) => {return NoteForVex(stave_note)})
      let  noteDelay = noteObject.map((stave_note) => {
         return(
           stave_note.map((note) => {
             return Tone.Time(note.noteDuration).toSeconds()
           })
         )
       } )

       this.setState({
            // stave_notes: song.notes,
            stave_notes: noteStr,
            notes_title: title,
            lyrics: lyrics,
            image: image,
            showAll: false,
            stavesCount : stavesCount,
            // noteText:noteText,
            noteObject: noteObject,
            noteDelay: noteDelay,
            songInputAvailable: true,
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
      let {noteString, noteDuration, noteScale, durationVex} = thisNoteObject
      // console.log({noteString},{noteDuration},{noteScale});
      let noteNum = NoteToNum(noteString) + Number(noteScale)*12;
      // console.log({noteNum});
      let duration = Tone.Time(noteDuration).toSeconds();
      // console.log({duration});
      if (durationVex === 'qr' || durationVex === 'hr'  ) {
        //this is a pause. so dont play it
      } else {
        this.midiSounds.playChordNow(instrument, [noteNum], duration)
      }




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
        // console.log("Received 'noteon' message (" + e.note.name + e.note.octave + ").");
        // console.log("key details:", e)

        let {practice,scrollView, keyInputDetails, allNotesCompleted,allLinesCompleted, scrollview} = this.state


      if (e !== keyInputDetails) {

        if (scrollView) {
          this.setState({
            keyInputDetails: e
          })
        }
        if (practice) {

          if (allLinesCompleted) {

              this.processSongCompletion(e, 'onDevice');

          } else {

            if (allNotesCompleted) {
              this.processLineSelection(e, 'onDevice');
            } else {
              this.setClassForNoteBG(e,'onDevice');
            }
          }

        }

      }  else if (scrollview) {

          console.log("key input Received on hard practice");

      }



    }

    playMidiNote = (index,delayTime) => {

      let {noteObject, staveIndex, noteDelay} = this.state
      let currentStaveNotes = noteObject[staveIndex];

      let noteDuration = noteDelay[staveIndex][index]*1000
      let durationVex = noteObject[staveIndex][index]
      console.log(noteDuration);

      let noteDetails = currentStaveNotes[index-1]
      
      let noteKey = noteDetails.noteString + noteDetails.noteScale;
      delayTime = "+" + delayTime
      // console.log({noteKey})
      if (durationVex === 'qr' || durationVex === 'hr') {
        //dont play. its a pause''
      } else {
        output.playNote(noteKey, 1, {duration:noteDuration, time:delayTime})      
    }

      let notesCount = currentStaveNotes.length
      console.log({index}, {notesCount});
      if (index  === notesCount) {
        console.log("all notes done");
        this.setState({
          notesPlayEnded: true,
        })
      }



    }

    addPrintedText = (text) => {
      let {printedText} = this.state
      printedText.push(text)
  
      this.setState({
        printedText: printedText,
     })
    }



    checkForMidi = () => {
        // console.clear();
      // console.log("checking for midi")

      let {webMidiEnabled, webMidiInitialized} = this.state
      // console.log("webMidiEnabled:", webMidiEnabled)
      if (webMidiEnabled) {
        // console.log("WebMidi.inputs",WebMidi.inputs)
        // console.log("WebMidi.outputs",WebMidi.outputs)
        // console.log(WebMidi)
        if (WebMidi.outputs.length === 0) {
          // console.log("output not found");
          message.info('midi device lost');


          this.setState({
            webMidiEnabled: false,
            webMidiInitialized: false,
          })
          WebMidi.disable();
        }

      } else {

        if (!webMidiInitialized) {
          WebMidi.enable( (err) => {

            if (err) {

              if (webMidiEnabled) {
                // alert('Midi Device Not Found');
              }

              // console.log("WebMidi could not be enabled.", err);
            } else {
              this.setState({
                webMidiInitialized: true,
              })
            }

          })
        } else {

          console.log(WebMidi.inputs);
          console.log(WebMidi.outputs);

          if (WebMidi.inputs.length > 0) {

            input = WebMidi.inputs[0];
            output = WebMidi.outputs[0];

            input.addListener('noteon', 'all',
            ((e) => {this.keyInputReceived(e)})
           )

            this.addPrintedText(input.connection + input.id + input.manufacturer + input.name + input.state);
            this.addPrintedText(output.connection + output.id + output.manufacturer + output.name + output.state);

            message.info('midi device connected');
            console.log("output found");
            this.setState({
              webMidiEnabled: true,
            })
          }

        }
      }
    }

    componentDidMount() {


      context.resume().then(() => {
        console.log('Playback resumed successfully');
      });

      // this.setState({
      //   stavesCount: this.state.stave_notes.length,
      // })

      window.setInterval(() => {

        this.checkForMidi();
      }, 1000);


    }

    bringPerfectScreen = (allLinesCompleted) => {

      window.setTimeout(() => {

        this.setState ({
          allNotesCompleted: true,
          allLinesCompleted: allLinesCompleted,
          errorScreenMode: 'perfect',
        })
      }, 1000);

      window.setTimeout(() => {

        if (allLinesCompleted) {
            // this.processSongCompletion(false,'onScreen')
        } else {
            this.processLineSelection(false,'onScreen')
        }


      }, 2000);

    }

    bringErrorScreen = () => {

      window.setTimeout(() => {

        this.setState ({
          allNotesCompleted: true,
          errorScreenMode: 'error'
        })
      }, 1000);

      window.setTimeout(() => {

        this.processLineSelection(true,'onScreen')

      }, 2000);

    }

    bringNextScreen = () => {


      window.setTimeout(() => {

        this.setState ({
          allNotesCompleted: true,
          errorCount: 0,
          errorScreenMode : 'ok',
        })
      }, 1000);

    }

    setClassForNoteBG = (keyInputDetails, source) => {

      //check for pause in duration. if it is a pause, skip the note by adding the class to noteClass
      let {noteClass, staveIndex, noteObject } = this.state;
      let noteNumToCheck = noteClass.length;
      let {durationVex} = noteObject[staveIndex][noteNumToCheck];
 
      if (durationVex === 'qr' || durationVex === 'hr') {
        noteClass.push('correctNoteBoxBG')
        this.setState({
          noteClass: noteClass,
        })
      } else {
        this.setClassForNoteBGYes(keyInputDetails,source)
      }

    }

    showModal = () => {
      this.setState({
        modalVisible: true,
      });
    }

    handleOk = (e) => {
      console.log(e);
      this.setState({
        modalVisible: false,
      });
    }
  
    handleCancel = (e) => {
      console.log(e);
      this.setState({
        modalVisible: false,
      });
    }

    setClassForNoteBGYes = (keyInputDetails,source) => {

      let playedNote = ''
      let {noteClass, staveIndex, noteObject, errorCount, stavesCount, } = this.state;
      let currentStaveNotes = noteObject[staveIndex];
      let noteNumToCheck = noteClass.length;
      let {noteString, noteScale} = noteObject[staveIndex][noteNumToCheck]
      let noteToCheck = noteString + noteScale

      if (source === 'onScreen') {
        playedNote = noteObject[staveIndex][keyInputDetails-1].noteString + noteObject[staveIndex][keyInputDetails-1].noteScale
      } else {
        playedNote = keyInputDetails.note.name + keyInputDetails.note.octave
      }



      let noteId = "note" + (noteNumToCheck+1)
      let noteTextId = "noteText" + (noteNumToCheck+1)
      let noteBox = document.getElementById(noteId);
      let noteTextBox = document.getElementById(noteTextId);
      let keyBox = document.getElementById(playedNote);

      console.log({noteToCheck}, {playedNote});
      let allNotesCompleted = false;
      let allLinesCompleted = false;

      if (noteToCheck === playedNote) {

              console.log({noteNumToCheck});
              console.log(currentStaveNotes.length);
              if (noteNumToCheck+1 === currentStaveNotes.length) {
                allNotesCompleted = true
                if (stavesCount === Number(staveIndex+1)) {
                  allLinesCompleted = true
                }
                this.setState({
                  notesVisibility: false,
                  allLinesCompleted: allLinesCompleted,
                })
              }



              noteTextBox.classList.add('correctNoteBoxBG')
              noteBox.classList.add('correctNoteBoxScale')
              noteClass.push('correctNoteBoxBG')
              this.setState({
                noteClass: noteClass,
                  keyInputDetails: keyInputDetails,
                allNotesCompleted: false,
              })
      } else {
              let messageText = 'You played ' + playedNote
              message.error(messageText,1);
              let {errorCount} = this.state
              errorCount = errorCount+1;
              this.setState({
                errorCount: errorCount,
              })
              noteBox.classList.add('wrongNoteBox')
      }

      keyBox.classList.add('playedNoteBox')

      if (allNotesCompleted) {

        if (errorCount === 0) {
            this.bringPerfectScreen(allLinesCompleted);
        } else {
          if (errorCount > 2 ) {
            this.bringErrorScreen();
          } else {
            this.bringNextScreen();
          }

        }

      }


      window.setTimeout(() => {
        keyBox.classList.remove('playedNoteBox')
      }, 500);

      window.setTimeout(() => {
        noteBox.classList.remove('wrongNoteBox')
        noteBox.classList.remove('correctNoteBoxScale')

      }, 200);

    }

    findKeyColor = (keyNumber) => {
      keyNumber = keyNumber % 12
      let keyIndex = whiteKeys.indexOf(keyNumber)
      console.log({keyNumber}, {keyIndex})
      // console.log({selectedChoice})
      let keyColor = 'white';
      if (keyIndex < 0) {
        keyColor = 'black';
      }

      return(keyColor);

    }

    processSongCompletion = (selectedChoice,source) => {

        let repeatSameSong = true;

        if (source === 'onDevice') {
        //WhiteKey Pressed - Repeat Same song
        //BlackKey Pressed - Go back to song menu
          let keyColor = this.findKeyColor(selectedChoice.note.number)
          if (keyColor === 'black') {
            repeatSameSong = false;
          }


        } else {
        //this is when the input is given from screen.
        //0 - Repeat Same line
        //1 - Go to Next line
          repeatSameSong = selectedChoice;
        }

        window.setTimeout(() => {

          if (!repeatSameSong) {
           this.backToTop()
          } else {
            this.setState({
              notesVisibility: true,
              keyInputDetails: null,
              noteClass : [],
              allNotesCompleted: false,
              allLinesCompleted: false,
              showFrontButton: true,
              showBackButton: false,
              choiceVisibility: true,
              notesPlayEnded: false,
              keyInputDetails: selectedChoice,
              staveIndex: 0,
            })

          }
        }, 1000);

    }



    processLineSelection = (selectedChoice,source) => {


      let repeatSameLine = true;

      if (source === 'onDevice') {
      //WhiteKey Pressed - Repeat Same line
      //BlackKey Pressed - Go to Next line
        let keyColor = this.findKeyColor(selectedChoice.note.number)
        //if keyIndex is -1 then it is not a whitekey
        //so blackkey is pressed. if black key is pressed set the repeatSameLine to False
        if (keyColor === 'black') {
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
            errorCount: 0,
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
        this.switchForEasyPractice(index);

        // this.showAllClicked();
      } else {
        // this.playNotesAlt2();
        // this.setState({
        //   notesPlayEnded: false,
        // })
      }


    }

    replayLine = () => {
      console.log("replay the same line. To be incorporated. Currently there are problems");
    }
    // notePressed = (event) => {
    //   console.log("key :", event.key);
    //   let {stave_notes, staveIndex} = this.state
    //   let stave_note = stave_notes[staveIndex];
    //   let notes = stave_note.split(' ')
    //
    //   let index = notes.indexOf(event.key)
    //   console.log(index);
    //
    // }
    noteCount = (notes) => {
      // let notesArray = notes.split(' ');
      let noteCount = 0;
      for (let i = 0; i < notes.length; i++) {
        let durationVex = notes[i].durationVex;
        // if (noteSplit.length === 2) {
          // let duration = noteSplit[1];
          switch (durationVex) {
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
        // } else {
        //   noteCount = noteCount +  1
        // }
      }
      return(noteCount)

    }

    noteForVexFlowNew = (noteObject) => {

      console.log({noteObject});

      let {noteLetter, noteScale, durationVex, acc} = noteObject;

      let noteForVexFlow = noteLetter + "/" + noteScale + "/" + durationVex + "/" + acc;
      console.log(noteForVexFlow);
      return noteForVexFlow

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
      let noteForVexFlow = noteLetter + "/" + noteOctave + "/" + noteDuration + "/" + noteAcc

      return noteForVexFlow

    }
    noteBox = (i,note,noteCount) => {

      // let {noteClass} = this.state

      // className="noteBox " + {noteClass[i]}
      let {playNotes, staveIndex, notesPlayEnded, webMidiEnabled, noteDelay} = this.state

      // console.log({componentDidMount}, {staveIndex}, {noteObject});
      let noteWidth = window.innerWidth*.6/noteCount;
      console.log({noteCount}, {noteWidth});

      // let noteKey =  note.split('-');
      let vexFlowNote = this.noteForVexFlowNew(note);

      let noteKey = note.noteString + note.noteScale;
      
      if (note.durationVex === 'qr' || note.durationVex ==='hr'){
        noteKey = ''
      }

      // let {noteDelay} = this.state;
      let noteDelayForThis = [0,...noteDelay[staveIndex]];

      let delaySoFar = 0.5;
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
      console.log({notesVisibility})
      return(
        <div>
        <Delayed key={i} id={i} waitBeforeShow={delayToApply}>
            <div id = {'note' + i} className="noteBox">
              <Animated animationIn="fadeIn" animationOut="bounceOut" isVisible={notesVisibility}>
                <SingleNote
                  notes = {[vexFlowNote]}
                  noteCount = {noteCount}
                  />
              </Animated>
              <Animated animationIn="flipInX" animationOut="bounceOut" isVisible={notesVisibility}>
                  <div className="noteTextBoxContainer">
                    <h2 id = {'noteText' + i} className="noteTextBox" onClick={() => this.setClassForNoteBG(i,'onScreen')}>
                    {noteKey}
                    </h2>
                  </div>
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

    headerBox = () => {

      // let backText = "<<"
      // let forwardText = ">>"

      let {lyrics, staveIndex, showAll,lineBoxText ,showFrontButton,showBackButton, firstTime} = this.state

            let frontButton = (
              <Animated className="navButtonBox" animationIn="fadeIn" animationOut="zoomOut" isVisible={showFrontButton}>
                <div
                  className="notesNavButton"
                  onClick = {() => this.directionButtonClicked('front')}
                >
                <Icon type="double-right" />
                </div>
              </Animated>
            )

            let backButton = (
              <Animated className="navButtonBox" animationIn="fadeIn" animationOut="zoomOut" isVisible={showBackButton}>
                <div
                  className="notesNavButton"
                  onClick = {() => this.directionButtonClicked('back')}
                >
                <Icon type="double-left" />
              </div>
              </Animated>
            )

            let homeButton = (
              <Animated className="navButtonBox" animationIn="fadeIn" animationOut="zoomOut" isVisible={true}>
                <div className="notesNavButton" onClick={this.backToTop}
                >
                <Icon type="home" />
              </div>
              </Animated>
            )
            let connectionText = ''
            if (this.state.webMidiEnabled) {
              connectionText = '🎹'
            }

            let connectionButton = (
              <Animated className="navButtonBox" animationIn="fadeIn" animationOut="zoomOut" isVisible={true}>
                <div className="notesNavButton"
                >
                {connectionText}
              </div>
              </Animated>
            )

            let options = (
              <Animated className="navButtonBox" animationIn="fadeIn" animationOut="zoomOut" isVisible={true}>
                <div className="notesNavButton" onClick={this.showModal}
                >
                <Icon type="setting" />
              </div>
              </Animated>
            )

            if (true) {

            }
            let centerHeaderText = (
              <div></div>
            )

            // let headerCenterText = lyrics[staveIndex]
            // if (!headerCenterText) {
            //   headerCenterText = 'Line ' + String(staveIndex)
            // }

            let headerCenterText = this.state.notes_title;


            if (!firstTime) {
              centerHeaderText = (
                    <h3 className="headerCenterText">{headerCenterText}</h3>
              )
            }

            let songHeader = (
              <div className="notesHeaderBox">
                {backButton}
                {homeButton}
                {connectionButton}
                {centerHeaderText}
                {options}
                {frontButton}
              </div>
            )

            return songHeader;
    }
    lineBox = (noteObject,i) => {


      let {showAll,lyrics,notesVisibility} = this.state

      let stave_note = noteObject;
      let noteCount = this.noteCount(noteObject);
      console.log({noteObject},{i})

      let notesBox = (
        <div  className="flexNotesTop">
          <Delayed key={i} id={i} waitBeforeShow={500}>
          <Animated animationIn="fadeIn" animationOut="bounceOut" isVisible={notesVisibility}>
            <h2 className="noteTextBox">{lyrics[i]}</h2>
          </Animated>
          </Delayed>
          <div className="flexNotesInner">
            <div className="noteBox">
              <Delayed key={i} id={i} waitBeforeShow={500}>
                <Animated animationIn="fadeIn" animationOut="bounceOut" isVisible={notesVisibility}>
                  <Clef/>
                  {showAll?
                    <h2  className="noteSideBox" onClick={() => this.lineBoxSelected(i)}>select</h2>
                    :
                    null
                  }
                </Animated>
              </Delayed>
            </div>
            {stave_note.map((note,index) => {
              return(
                this.noteBox(index+1,note,noteCount)
              )
            })}
            </div>
        </div>
      )


      // lyric moved to header. so below is commented out (if needed it should be placed inside return within first div)
      // <Delayed waitBeforeShow={500}>
      //   <Animated animationIn="fadeIn" animationOut="zoomOut" isVisible={true}>
      //     <h2 className="lyricBox">{lyric}</h2>
      //   </Animated>
      // </Delayed>
      return(
        <div key={i} id={i} className="lineBox">


          <div className="notesContainter">
            {notesBox}
          </div>
          {showAll?
            null
            :
            <div className="pianoKeys">
              <PianoKeys/>
            </div>
          }
        </div>
      )

    }


    directionButtonClicked = (direction) => {
      // this.inputElement.focus();
      let {staveIndex, showFrontButton, showBackButton, stavesCount, noteObject, firstTime} = this.state


      if (firstTime) {
        //Do nothing
      } else {


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
            // currentStaveNotes: noteObject[staveIndex],
            notesVisibility: true,
            choiceVisibility: true,
          })

      }

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
      let {firstTime} = this.state

      if (firstTime) {
        this.props.homeButton();
      }
      this.setState({
        staveIndex: 0,
        showLine: true,
        firstTime: true,
        notesVisibility:true,
        showBackButton:false,
        showFrontButton: true,
        allLinesCompleted: false,
        allNotesCompleted: false,
        noteClass:[],
        playNotes:true,
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
    switchForEasyPractice = (index) => {
      let showBackButton = true;
      let showFrontButton = true;
      if (index === 0) {
        showBackButton = false;
      }
      if (index === this.state.stavesCount-1) {
        showFrontButton = false;
      }
      this.setState({
        index: index,
        firstTime:false,
        playNotes:true,
        notesPlayEnded:false,
        showAll:false,
        scrollView:false,
        showFrontButton : showFrontButton,
        showBackButton : showBackButton,
        practice: true,
        songMenuVisibility: true,
        // currentStaveNotes: this.state.noteObject[this.state.staveIndex],
      })
    }
    switchForShowAllButton = () => {
      this.setState({
        firstTime:false,
        showAll:true,
        playNotes:false,
        notesPlayEnded:true,
        scrollView:false,
        showFrontButton : false,
        showBackButton : false,
        practice: false,
        songMenuVisibility: true,
      })
    }

    swithcForHardPractice = () => {
      this.setState({
        firstTime:false,
        scrollView:true,
        playNotes:false,
        notesPlayEnded:true,
        showAll:false,
        showFrontButton : false,
        showBackButton : false,
        practice: false,
        songMenuVisibility: true,
        allNotesCompleted: false,
        allLinesCompleted: false,
      })
    }

    switchForBackToTop = () => {
      this.setState({
        firstTime:true,
        scrollView:false,
        playNotes:false,
        notesPlayEnded:false,
        showAll:false,
        showFrontButton : false,
        showBackButton : false,
        practice: false,
        songMenuVisibility: true,
      })
    }

    showNextLyric = () => {
      let {staveIndex, stavesCount} = this.state
      if (staveIndex === stavesCount - 1) {
        this.setState({
        })
      } else {
        // this.setState({
        //   staveIndex: staveIndex + 1,
        // })
      }

    }
    scrollCompleted = () => {
      this.setState({
        allLinesCompleted: true,
      })
    }
    resetSwitches = (event) => {
      let id = event.target.id
      this.setState({
        songMenuVisibility: false,
      })

      window.setTimeout(() => {


        if (id === 'practice') {
          this.switchForEasyPractice(this.state.staveIndex);
        }

        if (id === 'showAll') {
          this.switchForShowAllButton();
        }

        if (id === 'scroll') {
          this.swithcForHardPractice();
        }

        if (id === 'backToTop') {
          this.switchForBackToTop();
        }

      }, 500);



    }
    render() {



        let {showAll, webMidiEnabled, noteObject, staveIndex,  scrollView, allNotesCompleted, allLinesCompleted, lyrics,
           showLine,songInputAvailable,  playNotes, firstTime,choiceVisibility, errorCount, errorScreenMode, songMenuVisibility, image} = this.state

          //  this.checkForMidi()
        
        let {song} = this.props
        
        if (song && !songInputAvailable ) {
          this.initializeSong();
        }

        let header = (
          <div>
          </div>
        )
        let headerOld = (
          <div className="notesHeaderBox">
            <h4 id='backToTop' onClick={this.backToTop}>back</h4>
            <h1 className="notesHeaderText">{this.state.notes_title}</h1>
            {/* <h2 className="notesHeaderText" onClick={() => this.showAllClicked()}> {showButtonText} </h2> */}
          </div>
        )

        let backgroundImage = null;
        let imageUrl = "url('" + image + "')"

        if (image) {
            backgroundImage = "linear-gradient( rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7) )," + imageUrl
        }

        return (
              <div className="notesPage" >
                  {this.headerBox()}
                  {firstTime && this.props.song?
                    <div>
                      <Animated animationIn="fadeIn" animationOut="fadeOut" isVisible={songMenuVisibility}>
                        <div className="songOptionBox" style={{  backgroundImage:backgroundImage, backgroundColor:'transparent' }}>
                          <h2 className="songOptionHeaderText">{this.state.notes_title}</h2>
                          <Animated animationIn="bounceIn" animationOut="bounceOut" isVisible={songMenuVisibility}>
                            <h2 id='practice' className="songOptionButton" onClick={(e) => this.resetSwitches(e)}>Easy Practice</h2>
                            <h2 id='scroll' className="songOptionButton" onClick={(e) => this.resetSwitches(e)}>Hard Practice</h2>
                            <h2 id='showAll' className="songOptionButton" onClick={(e) => this.resetSwitches(e)}>Show All Notes</h2>
                          </Animated>
                        </div>
                      </Animated>
                    </div>
                  :
                  <div>
                    {showAll?
                      <Animated animationIn="fadeIn" animationOut="zoomOut" isVisible={showAll}>
                      {noteObject.map((stave_note,i) => {
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
                          {this.lineBox(noteObject[staveIndex],staveIndex)}
                      </Animated>
                      :null
                    }

                    {(allLinesCompleted  &&  allNotesCompleted)?
                      <Animated  animationIn="zoomIn" animationOut="bounceOut" isVisible={choiceVisibility}>
                        <div className="choiceContainer">
                          <div className="whiteKeyChoice" onClick={() => this.processSongCompletion(true,'onScreen')}>
                            Redo
                          </div>
                          <div className="blackKeyChoice" onClick={() => this.processSongCompletion(false,'onScreen')}>
                            Back
                          </div>


                        </div>
                      </Animated>
                      :null

                    }

                    {(allNotesCompleted && !allLinesCompleted && errorScreenMode==='ok')?
                      <Animated  animationIn="zoomIn" animationOut="bounceOut" isVisible={choiceVisibility}>
                        <h2 className="errorTxtOne"> You are very Close! </h2>
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

                    {(allNotesCompleted && !allLinesCompleted && errorScreenMode==='error')?
                      <div className="errorContainer">
                        <Animated  animationIn="bounceIn" animationOut="bounceOut" isVisible={choiceVisibility}>
                          <h2 className="errorTxtOne">{errorCount} errors. </h2>
                        </Animated>
                          <Animated  animationIn="zoomIn" animationOut="bounceOut"  isVisible={choiceVisibility}>
                              <h1 className="errorTxtTwo">Lets try again</h1>
                          </Animated>
                      </div>
                      :null
                    }

                    {(allNotesCompleted && !allLinesCompleted && errorScreenMode==='perfect')?
                      <div className="errorContainer">
                        <Animated  animationIn="bounceIn" animationOut="bounceOut" isVisible={choiceVisibility}>
                          <h2 className="errorTxtOne">Perfect!</h2>
                        </Animated>
                          <Animated  animationIn="zoomIn" animationOut="bounceOut"  isVisible={choiceVisibility}>
                              <h1 className="errorTxtTwo">Lets move on to the next one</h1>
                          </Animated>
                      </div>
                      :null
                    }

                    {scrollView && !allLinesCompleted?
                      <ScrollView
                      notes = {noteObject}
                      keyInputDetails={this.state.keyInputDetails}
                      stavesCount = {this.state.stavesCount}
                      lyrics={lyrics}
                      keyBoardConnection = {webMidiEnabled}
                      scrollCompleted = {this.scrollCompleted}
                      />
                      :
                      null

                    }
                    {scrollView && allLinesCompleted?

                      <Animated  animationIn="zoomIn" animationOut="bounceOut" isVisible={choiceVisibility}>
                      <h1>Song Completed!</h1>
                      <div className="choiceContainer">
                        <div className="whiteKeyChoice" onClick={() => this.processSongCompletion(true,'onScreen')}>
                          Redo
                        </div>
                        <div className="blackKeyChoice" onClick={() => this.processSongCompletion(false,'onScreen')}>
                          Back
                        </div>


                      </div>
                    </Animated>
                      :
                      null

                    }

                  </div>
                  }
                  <div className="midiSoundsClass">
                    <Animated  animationIn="fadeOut" animationOut="" isVisible={true}>
                    <MIDISounds
                            ref={(ref) => (this.midiSounds = ref)}
                            appElementName="root" instruments={[3,771]}
                            isVisible={false}
                            />
                    </Animated>
                  </div>
                  {this.state.modalVisible?
                    <div>
                      <Modal
                        title="Basic Modal"
                        visible={this.state.modalVisible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                      >
                        {this.state.printedText.map((text) => {
                          return(
                            <p>{text}</p>
                          )
                        })}
                      </Modal>                      

                    </div>
                    :null
                  }

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
