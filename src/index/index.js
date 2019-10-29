import React,{Component,lazy,Suspense} from 'react';
import ReactDom from 'react-dom';
import {a} from '../common/common.js';

import './index.less';

export default class Index extends Component{
  constructor(props){
    super(props);
    this.state={
      Search:null,
    }

  }
  addComponent = () => {
    // import('../search/index.js').then((Search)=>{
    //   console.log(Search,'Search')
    //   this.setState({Search:Search.default});
    // })
    const Search = lazy(()=>{return import('../search/index.js')});
    console.log(Search,'Search')
    this.setState({Search:Search});
  }
  render(){
    // console.log(w,22)
    const {Search} = this.state;
    return (
      <div className="box">
        <div className="box1">
          <button onClick={this.addComponent}>点我加载组件</button>
        </div>
        <Suspense fallback={null} >
        {Search &&  <Search />}
        </Suspense>
      </div>
    )
  }
}

ReactDom.render(
  <Index />,
  document.getElementById('root')
);