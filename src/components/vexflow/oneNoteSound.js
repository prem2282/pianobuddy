import Vex from 'vexflow';
import React, {Component} from 'react';
// import {Animated} from 'react-animated-css';
import NoteForMidiPlayer from './noteForMidiPlayer';
import NoteToNum from './noteToNum';
import MIDISounds from 'midi-sounds-react';
import Tone from 'tone';
// let   noteCount = 0;
export default class OneNoteSound extends Component {

    constructor(props) {
        super(props);

        this.state = {
            x: 0,
            y: 0,


        };
    };

    playNotesAlt = () => {

      let {noteObject} = this.props
      console.log({noteObject})
      let instrument = 3;
      let {noteString, noteDuration, noteScale} = noteObject
      console.log({noteString},{noteDuration},{noteScale});
      let noteNum = NoteToNum(noteString) + Number(noteScale)*12;
      console.log({noteNum});
      let duration = Tone.Time(noteDuration);
      console.log({duration});
      this.midiSounds.playChordNow(instrument, [noteNum], duration)


    }

    componentDidMount() {
      this.props.playThisNote(this.props.noteIndex)
    }

    render() {
        return <div>
                </div>
            ;
    }

}

        // <MIDISounds
        // ref={(ref) => (this.midiSounds = ref)}
        // appElementName="root" instruments={[3,771]}
        // isVisible={false}
        // />
