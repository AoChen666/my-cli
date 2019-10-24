import React,{Component} from 'react';
import ReactDom from 'react-dom';

import './index.less';

export default class Index extends Component{

  render(){
    // console.log(w,22)
    return (

      <div className="box">
       <div className="box1"></div>
        
      </div>
    )

  }

}

ReactDom.render(
  <Index />,
  document.getElementById('root')
);