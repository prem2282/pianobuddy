import Vex from 'vexflow';
import React, {Component} from 'react';
import './scroll.css'
import NoteFormation from './noteFormation';
import MIDISounds from 'midi-sounds-react';
import {Animated} from 'react-animated-css';
const VF = Vex.Flow;
const visibleNoteGroups = [];
const svgContainer = document.createElement('div');
var renderer = new VF.Renderer(svgContainer, VF.Renderer.Backends.SVG);
var stave = new VF.Stave(0, 0, 10000)
.addClef('treble');

// Configure the rendering context.
renderer.resize(600, 100);
var context = renderer.getContext();

var tickContext = new VF.TickContext();

export default class ScrollView2 extends Component {

    constructor(props) {
        super(props);

        this.state = {
            notes: null,
            x: 0,
            y: 0,
            scrollStarted: false,
            noteNumbers: [4,10,20,10,3,25,3,4,3,4,4,4,4,4,4,]

        };
    };

    noteFormation = (noteStr) => {

      // console.log({noteStr});
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

    initializeNotes = () => {
      // var durations = ['8', '4', '2', '1'];

      let input =  this.props.notes;


      let noteTags = input.split(',')
      let notes = noteTags.map(noteTag => {
        return this.noteFormation(noteTag).note
      })


      tickContext.preFormat().setX(400);
      this.setState({
        notes : notes,
        scrollStarted: false
      })
    }
    componentDidMount() {

        stave.setContext(context).draw();
        this.initializeNotes();

        this.refs.outer.appendChild(svgContainer);
        this.inputElement.focus();
    }


    onRightNote = (event) => {

      if (visibleNoteGroups.length>0) {

        let firstGroup = visibleNoteGroups[0];
        const tmatrix = window.getComputedStyle(firstGroup).transform;
        const xvalue = tmatrix.split(',')[4].trim();
        console.log({xvalue})

        console.log(event.key);

        if (xvalue < -300) {
          console.log("can execute now");
          let group = visibleNoteGroups.shift();
          console.log('group', group);
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
          console.log("cant remove");
        }

      } else {
        // this.initializeNotes();
        // this.onAddNote();
      }


    }

    resetScroll = () => {
      this.initializeNotes();
      this.inputElement.focus();
      // this.onAddNote();
    }

    timeDuration = (durationText) => {
      switch (durationText) {
        case 'q':
          return 500
          break;
        case 'h':
          return 1000
          break;
        case 'w':
          return 2000
          break;
        default:

      }
    }

    onAddNote = () => {

      let notes = this.state.notes;

      // this.midiSounds.playChordNow(3, [this.state.noteNumbers[0]+60], .5);
      // console.log("playing note:", this.state.noteNumbers[visibleNoteGroups.length]+60 )

    	let note = notes.shift();
      // console.log('note', note);
      this.setState({
        notes: notes,
        scrollStarted: true,
      })
    	if(note) {
      // var context = renderer.getContext();
      console.log({note});
      const group = context.openGroup();
      visibleNoteGroups.push(group);
    	note.draw();
      context.closeGroup();
    	group.classList.add('scroll');
      const box = group.getBoundingClientRect();
    	group.classList.add('scrolling');

      // console.log("duration", note.duration)
      let duration = this.timeDuration(note.duration);

      window.setTimeout(() => {
        this.onAddNote();
    	}, duration);

    	// If a user doesn't answer in time make the note fall below the staff
    	window.setTimeout(() => {
    		const index = visibleNoteGroups.indexOf(group);
    		if(index === -1) return;
    		group.classList.add('too-slow');
        visibleNoteGroups.shift();
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

    render() {

        let {notes, scrollStarted} = this.state
        if (notes &&  !scrollStarted) {
          console.log("scrollStarted");
          this.onAddNote();
        }

        return(
          <div style={{
              border: "0px blue solid",
              padding: 0,
              paddingLeft: 30,
              borderRadius: 0,
              marginBottom: 0,
              background: 'Aqua',
              display: "inline-block",
          }}>
            <div ref="outer" >
            </div>
            <div id="controls">
              <div id='add-note' className="noteTextBox" onClick={this.onAddNote}>Add Note</div>
              <div id='right-answer' className="noteTextBox" ref={(inp) => {this.inputElement = inp}} onKeyUp={(e) => this.onRightNote(e)}>Right Answer</div>
              <div id='reset' className="noteTextBox" onClick={this.resetScroll}>Reset</div>
              <Animated  animationIn="fadeOut" animationOut="fadeOut" isVisible={false}>
                      <MIDISounds 
                                  ref={(ref) => (this.midiSounds = ref)} 
                                  appElementName="root" instruments={[3]} 
                                  isVisible={false}
                                  />
              </Animated>

            </div>
          </div>
        )

    }

}
