
import Vex from 'vexflow';
import React, {Component} from 'react';
import './scroll.css'
const VF = Vex.Flow;
const visibleNoteGroups = [];


export default class SingleNote extends Component {

    constructor(props) {
        super(props);

        this.state = {
            x: 0,
            y: 0,

        };
    };

    findWidth = (duration) => {
        if (duration === 'q') {
            return 60;
        } 
        if (duration === 'h') {
            return 120;
        }
        if (duration === 'w') {
            return 240;
        } 
        if (duration === '8') {
            return 40;
        } 
        if (duration === '16') {
            return 40;
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

        let {notes, duration} = this.props

        var div = document.getElementById("single")
        let staveWidth = this.findWidth(duration);
        let beatsCount = this.findBeatCount(duration);
        var renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
        var stave = new VF.Stave(-2, 0, staveWidth+4)
        renderer.resize(staveWidth, 100);
        var context = renderer.getContext();
        
        // And get a drawing context:
        var context = renderer.getContext();
        stave.setContext(context).draw();

        var staveNotes = [
            // A quarter-note C.
            new VF.StaveNote({clef: "treble", keys: [notes], duration: duration }),
          ];

        var voice = new VF.Voice({num_beats: beatsCount,  beat_value: 4});
        voice.addTickables(staveNotes);
        var formatter = new VF.Formatter().joinVoices([voice]).format([voice], staveWidth);

        // Render voice
        voice.draw(context, stave);
    }



    render() {

        return(
          <div id='single'>
          </div>
        )

    }

}
