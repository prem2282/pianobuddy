import Vex from 'vexflow';
import React, {Component} from 'react';
import {Animated} from 'react-animated-css';

const VF = Vex.Flow;

export default class Voice extends Component {

    constructor(props) {
        super(props);

        this.state = {
            x: 0,
            y: 0,

        };
    };

    componentDidMount() {


        const svgContainer = document.createElement('div');

        // const {notes} = this.props;


        var renderer = new VF.Renderer(svgContainer, VF.Renderer.Backends.SVG);

        // Size our svg:
        renderer.resize(200, 100);

        // And get a drawing context:
        var context = renderer.getContext();
        // Create a stave at position 10, 40 of width 400 on the canvas.
        var stave = new VF.Stave(0, 0, 200);
        // stave.addClef("treble").addTimeSignature("4/4");

        var notes = [
          // A quarter-note C.
          new VF.StaveNote({clef: "treble", keys: ["c/5"], duration: "q" }),

          // A quarter-note D.
          new VF.StaveNote({clef: "treble", keys: ["d/4"], duration: "q" }),

          // A quarter-note rest. Note that the key (b/4) specifies the vertical
          // position of the rest.
          new VF.StaveNote({clef: "treble", keys: ["b/4"], duration: "qr" }),

          // A C-Major chord.
          new VF.StaveNote({clef: "treble", keys: ["c/4", "e/4", "g/4"], duration: "q" })
        ];

        // var notes2 = [
        //   new VF.StaveNote({clef: "treble", keys: ["c/4"], duration: "w" })
        // ];

        // Create a voice in 4/4 and add above notes
        var voices = [
        	new VF.Voice({num_beats: 4,  beat_value: 4}).addTickables(notes),
        	]

        // Format and justify the notes to 400 pixels.
        var formatter = new VF.Formatter().joinVoices(voices).format(voices, 200);


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
            background: 'khaki',
            display: "inline-block",
        }}>
        </div>;
    }

}
