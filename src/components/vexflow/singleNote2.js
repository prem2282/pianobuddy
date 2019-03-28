

import Vex from 'vexflow';
import React, {Component} from 'react';
import './scroll.css'
const VF = Vex.Flow;
const visibleNoteGroups = [];

export default class SingleNote2 extends Component {

    constructor(props) {
        super(props);

        this.state = {
            x: 0,
            y: 0,

        };
    };

    findWidth = (duration) => {
        let {noteCount} = this.props
        let noteWidth = window.innerWidth*.8/noteCount;

        if (duration === 'q') {
            return noteWidth;
        }
        if (duration === 'h') {
            return noteWidth*2;
        }
        if (duration === 'w') {
            return noteWidth*4;
        }
        if (duration === '8') {
            return noteWidth/2;
        }
        if (duration === '16') {
            return noteWidth/2;
        }

     }

     findBeatCount = (duration) => {
        if (duration === 'q') {
            return 1;
        }
        if (duration === 'h') {
            return 2;
        }
        if (duration === 'w') {
            return 4;
        }
        if (duration === '8') {
            return .5;
        }
        if (duration === '16') {
            return .25;
        }

     }

     componentDidMount() {

        let {notes, noteid} = this.props
        console.log({notes});
        let keynotes = notes.map((note) => {
          let noteDetails = note.split('/');

          let noteLetter = noteDetails[0];
          let noteOctave =  noteDetails[1];
          let noteDuration = noteDetails[2];
          let noteAcc = null;
          if (noteDetails.length === 4) {
            noteAcc = noteDetails[3];
          }
          let staveWidth = this.findWidth(noteDuration);
          let beatsCount = this.findBeatCount(noteDuration);


          return({
              noteLetter:noteLetter,
              noteOctave:noteOctave,
              noteDuration:noteDuration,
              noteAcc:noteAcc,
              staveWidth:staveWidth,
              beatsCount: beatsCount,
          })
        })

        console.log({keynotes});
        let totalWidth = 0;
        keynotes.forEach((note) => {
          totalWidth = totalWidth + note.staveWidth
        })
        console.log({totalWidth});
        let totalBeatsCount = 0;
        keynotes.forEach((note) => {
          totalBeatsCount = totalBeatsCount + note.beatsCount
        })
        console.log({totalBeatsCount});
        var div = document.createElement('div');
        var renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
        var stave = new VF.Stave(-2, 0, totalWidth+4)
        renderer.resize(totalWidth, 100);
        var context = renderer.getContext();

        // And get a drawing context:
        var context = renderer.getContext();

        //comment the below line if the staves are not to be rendered. only the note will be rendered.
        stave.setContext(context).draw();

        let staveNotes = keynotes.map((note) => {

          let {noteLetter, noteAcc, noteDuration, noteOctave} = note
          console.log({noteLetter},{noteAcc} ,{noteDuration}, {noteOctave});
          let noteStr = noteLetter+"/"+noteOctave;
          console.log(noteStr);
          let staveNote = null;
          if (noteAcc) {
              staveNote = new VF.StaveNote({clef: "treble", keys: [noteStr], duration: noteDuration }).addAccidental(0, new VF.Accidental(noteAcc))
          } else {
              staveNote = new VF.StaveNote({clef: "treble", keys: [noteStr], duration: noteDuration })
          }

          return(staveNote)

        })


        if (totalBeatsCount <= 1 && staveNotes.length>1) {
            let beam = new VF.Beam(staveNotes)
            Vex.Flow.Formatter.FormatAndDraw(context, stave, staveNotes);
            beam.setContext(context).draw()
            this.refs.outer.appendChild(div);
        } else {
            var voice = new VF.Voice({num_beats: totalBeatsCount,  beat_value: 4});
            voice.addTickables(staveNotes);
            var formatter = new VF.Formatter().joinVoices([voice]).format([voice], totalWidth);
            voice.draw(context,stave);
            this.refs.outer.appendChild(div);
        }

    }



    render() {

        return(
          <div ref="outer"  style={{
              border: "0px blue solid",
              padding: 0,
              paddingLeft: 0,
              borderRadius: 0,
              background: 'transparent',
              display: "inline-block",
          }}>
          </div>
        )

    }

}

// Input Examples
// <div className="flexNotes">
//   <SingleNote2
//     notes= {["C/5/16"]}
//   />
//   <SingleNote2
//     notes= {["C/5/8","D/5/8"]}
//   />
//   <SingleNote2
//     notes= {["C/5/q","D/5/8","D/5/8"]}
//   />
//   <SingleNote2
//     notes= {["C/5/16","D/5/16","E/5/16"]}
//   />
//   <SingleNote2
//     notes= {["C/5/16","D/5/16","E/5/16","E/5/16"]}
//   />
//   <SingleNote2
//     notes= {["C/5/h","D/5/h"]}
//   />
//   <SingleNote2
//     notes= {["C/5/w"]}
//   />
// </div>
