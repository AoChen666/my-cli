import React,{Component} from 'react';
import ReactDom from 'react-dom';
import {a} from '../common/common.js';

import './index.less';

export default class Index extends Component{

  render(){
    // console.log(w,22)
    return (

      <div className="box">
       <div className="box1">{a}</div>
        
      </div>
    )

  }

}

ReactDom.render(
  <Index />,
  document.getElementById('root')
);