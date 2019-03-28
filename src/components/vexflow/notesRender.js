
import React, {Component} from 'react';
import Clef from "./clefandtime";
// import Voice from "./voice";
// import Voices from "./voices";
import ScrollView from "./scrollview";
import OneNoteVoice from "./oneNoteVoice";
import OneNoteSound from "./oneNoteSound";
import Delayed from '../..//components/common/delayed';
import './notes.css';
import {Animated} from 'react-animated-css';
import {Button} from 'antd';
import ReactDOM from 'react-dom';
import WebMidi from 'webmidi';
import MIDI from 'midi.js';
import MIDISounds from 'midi-sounds-react';
import Tone from 'tone';
import NoteFormation from './noteFormation';
import NoteForTone from './noteForTone';
import NoteForMidiPlayer from './noteForMidiPlayer';
import SingleNote from './singlenote';
import Clefandtime from './clefandtime';

// import WebAudio from './webAudioFontDemo';
import NoteToNum from './noteToNum';


let input = null;
let output = null;
let context = new AudioContext();
let instrument = 771;
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
            componentDidMount: false,
            noteDelay: noteDelay,
            firstTime:true,
            playNotes:false,
            notesPlayEnded: false,
            time: 0,
            scrollView: false,
            playedKey: '',
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

    playNotesOld = () => {

      let noteObject = this.state.noteObject[this.state.staveIndex]
      console.log({noteObject})

      let time = Tone.context.currentTime;
      console.log('AudiocontextTime:',context.currentTime)
      console.log("currentTime", time);
      // let instrument = 3;
      noteObject.forEach((note,index) => {


        let {noteString, noteScale, noteDuration} = note;
        console.log({noteDuration});
        let noteNum = NoteToNum(noteString) + noteScale*12;
        // let {noteTone, duration} = note;
        // let noteNum = NoteNumMap(noteTone);
        let duration = Tone.Time(noteDuration);

        console.log(noteNum, time, instrument, duration );
        // synth.triggerAttackRelease(noteTone, duration, Tone.context.currentTime + time )

        this.midiSounds.playChordAt(time, instrument, [noteNum], duration)
        // time = time + Tone.Time(duration)
        time = time + duration

      })

    }
    playNotes = () => {

      console.clear()

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

    playNotesAlt = () => {

      // let noteObject = this.state.noteObject[this.state.staveIndex]
      // console.log({noteObject})
      // console.clear()


      // let time = Tone.context.currentTime;
      // console.log("currentTime", time);
      // let instrument = 3;
      let noteObject = this.state.noteObject[this.state.staveIndex]
      console.log({noteObject})
      // let noteText = this.state.noteText[this.state.staveIndex]
      // console.log({noteText})

      let time = Tone.context.currentTime;

      // console.log(time)
      noteObject.forEach((note,index) => {
        console.log({note},{index},{time})
        let {noteString, noteScale, noteDuration} = note;
        let duration = Tone.Time(noteDuration);
        let noteNum = NoteToNum(noteString) + noteScale*12;
        // let {noteTone, duration} = note;
        // synth.triggerAttackRelease(noteTone, duration, Tone.context.currentTime + time )
        this.midiSounds.playChordAt(time, instrument, [noteNum], duration)
        this.setState({
          // playNotes: false,
          time: time
        })
        time = time + duration

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

    keyInputReceived = (e) => {
        console.log("Received 'noteon' message (" + e.note.name + e.note.octave + ").");
        this.setState({
          playedKey: e.note.name + e.note.octave
        })
    }
    componentDidMount() {


      context.resume().then(() => {
        console.log('Playback resumed successfully');
      });

      // let notesTone = this.setNoteText(0);

      // console.log({notesTone})

      // this.inputElement.focus();
      this.setState({
        stavesCount: this.state.stave_notes.length,
        // playnotes: true,
        // noteText: notesTone
      })
      this.setTrasport();

      WebMidi.enable( (err) => {

        if (err) {
          console.log("WebMidi could not be enabled.", err);
        } else {
          console.log("WebMidi enabled!");
          console.log(WebMidi.inputs);
          console.log(WebMidi.outputs);

          console.log("WebMidi", WebMidi);
         input = WebMidi.inputs[0];
         output = WebMidi.outputs[0];
          //http://djipco.github.io/webmidi/latest/classes/WebMidi.html
         if (input) {
          // WebMidi.inputs[0].addListener('noteOn', "all", function(e) {
          //   console.log("note value: " + e.value);
          // });
          input.addListener('noteon', 'all',
            ((e) => {this.keyInputReceived(e)})
         )
        }
         if (output) {
           output.playNote("C4");
         } else {

         }
        }



      });
    }

    setClassForNoteBG = (i) => {



      let {noteClass, staveIndex, noteObject} = this.state;
      let noteNumToCheck = noteClass.length;
      let noteToCheck = noteObject[staveIndex][noteNumToCheck].noteString
      let clickedNote = noteObject[staveIndex][i-1].noteString
      let noteToCheckScale = noteObject[staveIndex][noteNumToCheck].noteScale
      let clickedNoteScale = noteObject[staveIndex][i-1].noteScale
      let noteId = "note" + (noteNumToCheck+1)
      let noteTextId = "noteText" + (noteNumToCheck+1)
      let noteBox = document.getElementById(noteId);
      let noteTextBox = document.getElementById(noteTextId);

      console.log({noteToCheck}, {clickedNote}, {i});

      if ((noteToCheck === clickedNote) && (noteToCheckScale === clickedNoteScale)) {
              noteTextBox.classList.add('correctNoteBox')
              noteBox.classList.add('correctNoteBox')
              noteClass.push('correctNoteBox')
              this.setState({
                noteClass: noteClass
              })
      } else {
              noteBox.classList.add('wrongNoteBox')
      }



      window.setTimeout(() => {
        noteBox.classList.remove('wrongNoteBox')
        noteBox.classList.remove('correctNoteBox')
      }, 200);

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
        this.playNotesAlt();
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
      let {playNotes, staveIndex, noteObject, notesPlayEnded} = this.state
      // console.log({componentDidMount}, {staveIndex}, {noteObject});
      let noteWidth = window.innerWidth*.6/noteCount;
      let noteKey =  note.split('-')[0];
      // let delayTime = 500*i;
      // if (componentDidMount) {
      //   console.log(noteObject[staveIndex]);
      //   let noteDuration = noteObject[staveIndex][i-1].noteDuration;
      //   delayTime = Tone.Time(noteDuration)*1000;
      // }

      // console.log({delayTime});

      let {noteDelay} = this.state;
      let noteDelayForThis = [0,...noteDelay[staveIndex]];
      console.log({noteDelayForThis});
      let delaySoFar = 0;
      if (playNotes) {

        for (var j = 0; j < i; j++) {

          delaySoFar = delaySoFar + noteDelayForThis[j];
        }
      }

      console.log({i},{delaySoFar},{note});

      let {waitBeforeShow, notesVisibility} = this.state
      return(
        <div>
        <Delayed key={i} id={i} waitBeforeShow={delaySoFar*1000}>
            <div id = {'note' + i} className="noteBox">
            <Animated animationIn="fadeIn" animationOut="zoomOut" isVisible={notesVisibility}>
              <OneNoteVoice
                noteTags = {note}
                noteWidth = {noteWidth}
                />
            </Animated>
            <Animated animationIn="flipInX" animationOut="zoomOut" isVisible={notesVisibility}>
                <h2 id = {'noteText' + i} className="noteTextBox" onClick={() => this.setClassForNoteBG(i)}>
                {noteKey}
                </h2>
            </Animated>

            </div>
        </Delayed>
        <Delayed key={'tone'+i} id={'tone'+i} waitBeforeShow={delaySoFar*1000}>
        {notesPlayEnded?
          null
          :
          <OneNoteSound
            noteIndex = {i}
            playThisNote = {this.playThisNote}
            />
        }
        </Delayed>
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
            <h2 className="lyricBox">{lyric}</h2>
          </Animated>
          <div className="notesContainter">
            {backButton}
            {notesBox}
            {frontButton}
          </div>

        </div>
      )

    }


    directionButtonClicked = (direction) => {
      // this.inputElement.focus();
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
        refresh: false,
        showLine: true,
        playNotes: true,
        notesPlayEnded: false,
        noteClass: [],
        // noteText: notesTone,
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
        })
      }





    }
    render() {

        let {showAll, stave_notes, staveIndex, showButtonText, refresh, scrollView,
           showLine, noteText, notesPlayed, playNotes, firstTime, notesVisibility, time} = this.state
        // let stave_note = stave_notes[0].split(',')

        // if (!notesVisibility) {
        //   this.setState({
        //     notesVisibility: true
        //   })
        // }

        // if (playNotes){
        //   this.playNotesAlt();
        // }
        let header = (
          <div className="notesHeaderBox">
            {/* <h4 onClick={this.playNotes}>click</h4> */}
            <h4 id='backToTop' onClick={this.backToTop}>back</h4>
            <h1 className="notesHeaderText">{this.state.notes_title}</h1>
            {/* <h2 className="notesHeaderText" onClick={() => this.showAllClicked()}> {showButtonText} </h2> */}
          </div>
        )




      // if (!componentDidMount) {
      //   return(
      //     <div>
      //     <MIDISounds
      //             ref={(ref) => (this.midiSounds = ref)}
      //             appElementName="root" instruments={[3,771]}
      //             isVisible={false}
      //             />
      //     </div>
      //   )
      // } else {
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
                    {playNotes?
                      <Animated  animationIn="fadeIn" animationOut="fadeInRight" isVisible={showLine}>
                          {this.lineBox(stave_notes[staveIndex],staveIndex)}
                      </Animated>
                      :null
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
                  <SingleNote
                    notes= {"C/4"}
                    duration={"q"}
                  />
                  <SingleNote
                    notes= {"C/5"}
                    duration={"h"}
                  />  
                  <SingleNote
                    notes= {"C/4"}
                    duration={"w"}
                  />
                  <SingleNote
                    notes= {"C/5"}
                    duration={"h"}
                  />
                  <SingleNote
                    notes= {"C/5"}
                    duration={"8"}
                  />                                          
                  <SingleNote
                    notes= {"C/4"}
                    duration={"16"}
                  />  
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
