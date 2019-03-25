import Vex from 'vexflow';
import React, {Component} from 'react';

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
        renderer.resize(65, 100);

        // And get a drawing context:
        var context = renderer.getContext();
        // Create a stave at position 10, 40 of width 400 on the canvas.
        var stave = new VF.Stave(0, 0, 65);
        stave.addClef("treble").addTimeSignature("4/4");

        stave.setContext(context).draw();
        // voice.draw(context, stave);
        // voices.forEach(function(v) { v.draw(context, stave); })
        this.refs.outer.appendChild(svgContainer);
    }

    makeSystem(vf, width, count) {
        const system = vf.System({ x:width*count, y: this.state.y, width: width, spaceBetweenStaves: 100 });
      //  this.setState({x: this.state.x + width});
        return system;
    }

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
