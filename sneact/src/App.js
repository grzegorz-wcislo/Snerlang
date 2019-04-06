import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Circle, Rect, Stage, Layer } from 'react-konva';
import Konva from  'konva';

class Snake extends Component{
  state = {
    
    length: 3,
    movement: ["down", "down"],
    positions: [{x: 15, y: 15}, {x: 15, y: 15}, {x: 15, y: 15}],
    leap: 30,
    color: 'black',
    direction: "down"
  };
  constructor(props)
  {
    
    super(props);
    console.log(this.state.positions)
    this.loop();
    console.log(this.state.positions)
  }

  
  loop(){
    const time = setInterval(()=>{
      console.log(this.state.positions)
      let newhead = this.state.positions[this.state.length-1]
      const [head, ...tail]  = this.state.positions
      console.log(newhead)
      console.log(tail)
      
      let newnewhead
      if(this.state.direction==="down"){
        newnewhead = {...newhead, y: newhead.y + this.state.leap}
        newhead.y=newhead.y+this.state.leap
      }
      if(this.state.direction==="up"){
        newhead.y=newhead.y-this.state.leap
      }
      if(this.state.direction==="left"){
        newhead.x=newhead.x-this.state.leap
      }
      if(this.state.direction==="right"){
        newhead.x=newhead.x+this.state.leap
      }
      console.log(newnewhead)
      this.setState({positions: [...tail, newnewhead]})
    },1000)
  }
  render(){
    return(
      <>
      {this.state.positions.map(({x, y}) => (
        <Rect
          x={x}
          y={y}
          width={20}
          height={20}
          fill={this.state.color}
          shadowBlur={5} />
        
      ))}
      </>
    );
  }


}

class App extends Component {
  render() {
    return (
      <div className="App">
      <p className="App-bg">
          
          <Stage width={300} height={700}>
          <Layer>
          <Snake />
          </Layer>
          </Stage>
          
          
      </p>
      </div>
    );
  }
}

export default App;
