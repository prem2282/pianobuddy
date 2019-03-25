import Vex from 'vexflow';
import React, {Component} from 'react';
// import {Animated} from 'react-animated-css';
import NoteFormation from './noteFormation';


const VF = Vex.Flow;
// let   noteCount = 0;
export default class OneNoteVoice extends Component {

    constructor(props) {
        super(props);

        this.state = {
            x: 0,
            y: 0,


        };
    };

    noteFormation = (noteStr) => {

      // console.log({noteStr});
      let {cleff, keys, duration, acc, noteCount} = NoteFormation(noteStr);

      let note =  new VF.StaveNote({clef: cleff, keys: keys, duration: duration ,})

      if(acc) note.addAccidental(0, new VF.Accidental(acc));
      // console.log({noteCount}, {note});
    //   noteCount = noteCount;

      return {
        note: note,
        noteCount: noteCount
      }


    }
    componentDidMount() {

        let {noteWidth, noteTags} = this.props;
        const svgContainer = document.createElement('div');

        var renderer = new VF.Renderer(svgContainer, VF.Renderer.Backends.SVG);
        let context = renderer.getContext();

        let {note, noteCount} = this.noteFormation(noteTags)
        // let notes = this.props.noteTags.map(noteTag => {
        //   return this.noteFormation(noteTag).note
        // })
        //
        // noteCount = this.props.noteTags.map(noteTag => {
        //   return this.noteFormation(noteTag).noteCount
        // })

        let notes = [note]

        let boxWidth = noteCount*noteWidth
        let stave = new VF.Stave(-2, 0, boxWidth+3);
        renderer.resize(boxWidth, 100);
        // Create a voice in 4/4 and add above notes
        // console.log({noteCount}, {notes}, {boxWidth});

        var voices = [
        	new VF.Voice({num_beats: noteCount,  beat_value: 4}).addTickables(notes),
        	]

        // Format and justify the notes to 400 pixels.
        var formatter = new VF.Formatter().joinVoices(voices).format(voices, boxWidth);


        stave.setContext(context).draw();
        // voice.draw(context, stave);
        voices.forEach(function(v) { v.draw(context, stave); })
        this.refs.outer.appendChild(svgContainer);
    }

    // makeSystem(vf, width, count) {
    //     const system = vf.System({ x:width*count, y: this.state.y, width: width, spaceBetweenStaves: 100 });
    //   //  this.setState({x: this.state.x + width});
    //     return system;
    // }

    render() {
        return <div ref="outer" style={{
            border: "0px blue solid",
            padding: 0,
            paddingLeft: 0,
            borderRadius: 0,
            background: 'transparent',
            display: "inline-block",
        }}>
        </div>;
    }

}
