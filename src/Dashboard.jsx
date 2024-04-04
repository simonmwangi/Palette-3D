import React, { Component } from 'react';
import ColorPicker from './components/color_picker';
import MainSpace from './components/main_space';
import Navbar from './components/navbar';
import './Dashboard.module.css'

class MainDashboard extends Component {
  state = {
    colors: [
      { r: 241, g: 112, b: 19, a: 1 },
      { r: 0, g: 255, b: 0, a: 1 }, // Example colors
      { r: 0, g: 0, b: 255, a: 1 },
      { r: 0, g: 0, b: 255, a: 1 },
      { r: 0, g: 0, b: 255, a: 1 }
    ]
  }

  handleColorChange = (index, color) => {
    this.setState(prevState => {
      const colors = [...prevState.colors];
      colors[index] = color;
      return { colors };
    });
  }


  render() {
    return (
      <>
        {/* <Navbar /> */}

        <div className='sidebar'>
          <h2>SideBar</h2>
          <div className='absolute-content'>

          {[0, 1, 2, 3, 4].map(index => (
            <ColorPicker
              key={index}
              the_color={this.state.colors[index]}
              onChangeColor={(color) => this.handleColorChange(index, color.rgb)}
            />

          ))}
          </div>

        </div>
        <div className='main-content'>
          {/* 3D model container */}
          <MainSpace colors={this.state.colors}/>
        </div>
      </>
    );
  }
}

export default MainDashboard