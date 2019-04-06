import Vex from 'vexflow';
import React, {Component} from 'react';
import './scroll.css'
import NoteFormation from './noteFormationNew';
import NoteForTone from './noteForTone';
import MIDISounds from 'midi-sounds-react';
import {message} from 'antd';
import {Animated} from 'react-animated-css';
const VF = Vex.Flow;
// const visibleNoteGroups = [];
let errorCount = 0;
const svgContainer = document.createElement('div');
var renderer = new VF.Renderer(svgContainer, VF.Renderer.Backends.SVG);
var stave = new VF.Stave(0, 0, window.innerWidth)
.addClef('treble');

// Configure the rendering context.
renderer.resize(window.innerWidth, 100);
var context = renderer.getContext();
let bpm = 120;

message.config(
  {
    bottom:100,
    duration: 1,
    maxcount: 3
  }
)
var tickContext = new VF.TickContext();

export default class ScrollView2 extends Component {

    constructor(props) {
        super(props);

        // let noteObjects = [...this.props.notes[0]]
        this.state = {
            notes: null,
            staveIndex: 0,
            x: 0,
            y: 0,
            scrollStarted: false,
            noteObjects: null,
            noteRotation: null,
            keyInputDetails: this.props.keyInputDetails,
            visibleNoteGroups: [],
            firstTimeRender: true,
            showErrorPage: false,


        };
    };

    noteFormation = (noteStr) => {


      let {cleff, keys, duration, acc, noteCount} = NoteFormation(noteStr);

      let note =  new VF.StaveNote({clef: cleff, keys: keys, duration: duration ,}).setContext(context).setStave(stave);
      if(acc) note.addAccidental(0, new VF.Accidental(acc));
      tickContext.addTickable(note)
      noteCount = noteCount;
      return {
        note: note,
        noteCount: noteCount
      }


    }

    initializeNotes = (staveIndex) => {

      let noteStave = this.props.notes[staveIndex];
      let notes = noteStave.map(note => {
        return this.noteFormation(note).note
      })


      tickContext.preFormat().setX(700);
      this.setState({
        notes : notes,
        scrollStarted: false,
        firstTimeRender: false,
        noteObjects: [...this.props.notes[staveIndex]],
        noteRotation: [...this.props.notes[staveIndex]],
      })
    }
    componentDidMount() {


        stave.setContext(context).draw();
        this.initializeNotes(this.state.staveIndex);

        this.refs.outer.appendChild(svgContainer);
    }


    onNoteInput = () => {

      let {visibleNoteGroups,  noteRotation} = this.state
      if (visibleNoteGroups.length>0) {

        let firstGroup = visibleNoteGroups[0];
        const tmatrix = window.getComputedStyle(firstGroup).transform;
        const xvalue = tmatrix.split(',')[4].trim();

        // let { noteObjects} = this.state;
        console.log({noteRotation})
        let noteCurrent = noteRotation[0];
        let notePressed = this.props.keyInputDetails.note
        console.log({notePressed},{noteCurrent})
        if (notePressed.name === noteCurrent.noteLetter && notePressed.octave === noteCurrent.noteScale) {

          if (xvalue < -600) {
            console.log("can execute now");
            message.error('good job!');
            let group = visibleNoteGroups.shift();
            noteRotation.shift()
            this.setState({
              visibleNoteGroups: visibleNoteGroups,
              noteRotation: noteRotation,
            })

            group.classList.add('correct');


            // The note will be somewhere in the middle of its move to the left -- by
            // getting its computed style we find its x-position, freeze it there, and
            // then send it straight up to note heaven with no horizontal motion.
            const transformMatrix = window.getComputedStyle(group).transform;
            // transformMatrix will be something like 'matrix(1, 0, 0, 1, -118, 0)'
            // where, since we're only translating in x, the 4th property will be
            // the current x-translation. You can dive into the gory details of
            // CSS3 transform matrices (along with matrix multiplication) if you want
            // at http://www.useragentman.com/blog/2011/01/07/css3-matrix-transform-for-the-mathematically-challenged/
            const x = transformMatrix.split(',')[4].trim();

            // And, finally, we set the note's style.transform property to send it skyward.
            group.style.transform = `translate(${x}px, -800px)`;

            // this.onAddNote();
          } else {
            message.error('too early');
          }
        } else {
          message.error('wrong key');
          errorCount = errorCount + 1;
        }

      } else {
        // this.initializeNotes();
        // this.onAddNote();
      }


    }

    resetScroll = () => {
      this.initializeNotes();
    }

    timeDuration = (durationText) => {
      switch (durationText) {
        case 'q':
          return 60/bpm*1000
          break;
        case 'h':
          return 2*(60/bpm*1000)
          break;
        case 'w':
          return 4*(60/bpm*1000)
          break;
        case '8':
          return .5*(60/bpm*1000)
          break;

        default:

      }
    }

    onAddNote = () => {

      let {notes, visibleNoteGroups, noteRotation} = this.state;


      let note = notes.shift();
      this.setState({
        notes: notes,
        scrollStarted: true,

      })
    	if(note) {
      // var context = renderer.getContext();
      const group = context.openGroup();
      visibleNoteGroups.push(group);
    	note.draw();
      context.closeGroup();
    	group.classList.add('scroll');
      const box = group.getBoundingClientRect();
    	group.classList.add('scrolling');
      this.setState({
        visibleNoteGroups:visibleNoteGroups
      })
      let duration = this.timeDuration(note.duration);

      window.setTimeout(() => {
        this.onAddNote();
    	}, duration);

    	// If a user doesn't answer in time make the note fall below the staff
    	window.setTimeout(() => {
    		const index = visibleNoteGroups.indexOf(group);
    		if(index === -1) return;
        group.classList.add('too-slow');
        errorCount = errorCount+1;
        visibleNoteGroups.shift();
        noteRotation.shift()
        this.setState({
          visibleNoteGroups:visibleNoteGroups,
          noteRotation:noteRotation,
        })


        // this.onAddNote();
    	}, 5000);
      } else {
        // this.initializeNotes();
        // this.onAddNote();
      }
    };

    // makeSystem(vf, width, count) {
    //     const system = vf.System({ x:width*count, y: this.state.y, width: width, spaceBetweenStaves: 100 });
    //   //  this.setState({x: this.state.x + width});
    //     return system;
    // }

    showErrorPage = () => {
      
      this.setState({
        showErrorPage: true,
      })

      window.setTimeout(() => {

        this.setNextLine(false);

      }, 2000);
  
    }

    setNextLine = (addIndex) => {
      //addIndex can be true or false
      //if true - next line will be given. (add 1 to index)
      //if false - same line will be given. (no add to index)
      let {staveIndex} = this.state
      let {stavesCount} = this.props
      console.log({staveIndex});


      errorCount = 0;


      if (staveIndex < stavesCount-1) {
        if (addIndex) {
          staveIndex = staveIndex+1
        }

        let noteStave = this.props.notes[staveIndex];
        let notes = noteStave.map(note => {
          return this.noteFormation(note).note
        })
  
        tickContext.preFormat().setX(700);

        this.setState({
          scrollStarted: false,
          staveIndex: staveIndex,
          firstTimeRender:false,
          notes : notes,
          noteObjects: [...this.props.notes[staveIndex]],
          noteRotation: [...this.props.notes[staveIndex]],
          showErrorPage: false,
        })
        // this.initializeNotes(staveIndex)
      } else {
        //all lines completed
        this.props.scrollCompleted()
      }


    }
    scrollEnded = () => {

      let {showErrorPage} = this.state
      let {keyBoardConnection} = this.props
      console.log('scrollEnded');
      if (keyBoardConnection) {
        if (!showErrorPage) {
          if (errorCount > 2) {
            this.showErrorPage();
          } else {
            //setting true here tell the function to add 1 to index. other wise same line will be repeated.
            //in case of error, same line has to be repeated.
            this.setNextLine(true);
          }
        }
      } else {
        //if key board is not connection, there is no way to check the key input.
        //So, this will always give the next line without checking for errors.
        //this way user can manually practice the scroll view
        this.setNextLine(true);
      }




      // this.props.showNextLyric();
    }

    checkforInput = () => {

      let {showErrorPage} = this.state
      if (this.state.keyInputDetails === this.props.keyInputDetails) {

      } else {

        if (!showErrorPage) {
          this.onNoteInput()

          this.setState({
            keyInputDetails :this.props.keyInputDetails,
          })
        }


      }
    }
    render() {



        let {notes, scrollStarted, showErrorPage, visibleNoteGroups, staveIndex, firstTimeRender} = this.state


        if (visibleNoteGroups.length>0) {
            this.checkforInput();
        } else {
          if (scrollStarted && !firstTimeRender) {
              this.scrollEnded();
          }

        }

        if (notes &&  !scrollStarted) {

          this.onAddNote();
        }

        let lyric = this.props.lyrics[staveIndex]
        if (!lyric) {
          lyric = 'line ' + String(staveIndex + 1)
        }
        return(
          <div>
            <Animated animationIn="fadeIn" animationOut="zoomOut" isVisible={!showErrorPage}>
              <h2>{lyric}</h2>
              <div className="scrollStaveBox" >
                <div className="scrollStave" ref="outer" ></div>
                <div className="scrollStave dummyStave"></div>
              </div>
            </Animated>
            <Animated animationIn="fadeIn" animationOut="zoomOut" isVisible={showErrorPage}>
              <div className="scrollStaveBox" >
                <h2>Too many errors</h2>
                <h2>Let's do that again</h2>
              </div>
            </Animated>           
          </div>
        )

    }

}


// <div id="controls">
// <div id='add-note' className="noteTextBox" onClick={this.onAddNote}>Add Note</div>
// <div id='right-answer' className="noteTextBox" ref={(inp) => {this.inputElement = inp}} onClick={(e) => this.onRightNote(e)}>Right Answer</div>
// <div id='reset' className="noteTextBox" onClick={this.resetScroll}>Reset</div>
//
//
// </div>
