import React, { Component } from 'react';
import {Button} from 'antd';

import './sheetMusic.css';
// import {flatioData} from './flatIOdata';

class FlatRender extends Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = { file: null };
  }

  handleClick(event) {
    const file = event.target.value;
    this.setState(state => state.file = file);
  }





  render() {

    console.log(window.innerHeight)
    let {notes} = this.props.flatIOdata
    let songUrl = notes
    console.log(this.props);

    return (
      <div>
        <div className="sh-back">
          {/* <select onChange={this.handleClick.bind(this)}>
            <option value={flatioData[0].address}>{flatioData[0].name}</option>
            <option value={flatioData[1].address}>{flatioData[1].name}</option>
          </select> */}
          {songUrl?
          <div>
            <div className="iframe-top">
              <Button type="primary" shape="round" size="large" onClick={this.props.backButton}>Back</Button>
            </div>
            <iframe src={songUrl} height={window.innerHeight - 50} width='100%'
             allowfullscreen="true"></iframe>
            <div className="iframe-hide">

            </div>
          </div>            
          :null
          }
        </div>

      </div>

    );
  }
}

export default FlatRender;
