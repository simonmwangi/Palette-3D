import React, { Component,useEffect } from 'react';
import ColorPicker from './components/color_picker';
import MainSpace from './components/main_space';
import Navbar from './components/navbar';
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import './Dashboard.module.css'

class MainDashboard extends Component {
  state = {
    colors: [
      { r: 128, g: 128, b: 128, a: 1 },
      { r: 128, g: 128, b: 128, a: 1 },
      { r: 128, g: 128, b: 128, a: 1 },
      { r: 128, g: 128, b: 128, a: 1 },
    ], 
  }
  
  componentDidUpdate(prevProps, prevState) {
    console.log(prevProps.colors)
    console.log(prevState.colors)
    if (prevState.colors !== this.state.colors) {
      // Colors have changed, update the_color prop of ColorPicker
      // Assuming this.state.colors is an array of color objects
      this.state.colors.forEach((color, index) => {
        this.refs[`colorPicker${index}`].updateColorProp(color);
      });
    }
  }
  
  handleColorChange = (index, color) => {
    this.setState(prevState => {
      const colors = [...prevState.colors];
      colors[index] = color;
      return { colors };
    });
  }
  // Function to generate a random RGB color
  getRandomColor = () => {
    return {
      r: Math.floor(Math.random() * 256),
      g: Math.floor(Math.random() * 256),
      b: Math.floor(Math.random() * 256),
      a: 1
    };
  };

  // Function to randomize colors in the array and update state
  randomizeColors = () => {
    this.setState(prevState => {
      let colors = [...prevState.colors];

      colors = colors.map(() => this.getRandomColor());
      return {colors}
    });
    
    console.log(this.state.colors)
    this.state.colors.forEach((color, index) => {
       this.refs[`colorPicker${index}`].updateColorProp(color); //Deprecated
    });
    //this.components[0].props.the_color = this.state.colors[0] // Cannot change the prop attributes since they are read-only.
  };

  render() {
    // this.components = Array.from({ length: 4 }, (_, index) => (
    //   <ColorPicker
    //     key={index}
    //     the_color={this.state.colors[index]}
    //     onChangeColor={(color) => this.handleColorChange(index, color.rgb)}
    //   />
    // ));
    return (
      <>

        {/* <Navbar /> */}
        <div className="container-fluid">
          <div className="row flex-nowrap">
              <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
                  <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100" id="menu_settings">
                      <a href="/" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                          <span className="fs-5 d-none d-sm-inline">Palette 3D</span>
                      </a>
                      {this.state.colors.map((color, index) => (
                        <ColorPicker
                          key={index}
                          ref={`colorPicker${index}`}
                          the_color={color}
                          onChangeColor={(color) => this.handleColorChange(index, color.rgb)}
                        />
                      ))}
                        <hr/>
                        <div className="form-check form-switch">
                          <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault"/>
                          <label className="form-check-label">Change Colors Manually</label>
                        </div>
                        <input className="btn btn-primary" type="button" onClick={this.randomizeColors} value="Random Colors"></input>
                  <div className="dropdown pb-4">
                      <a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                          <img src="https://github.com/simonmwangi/Palette-3D/assets/33296663/74b9ffc7-0bd8-4558-95b7-ef90fa133e5c" alt="hugenerd" width="30" height="30" className="rounded-circle"/>
                          <span className="d-none d-sm-inline mx-1">Workspace</span>
                      </a>
                      <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
                          <li><a className="dropdown-item" href="#">Load 3D Model</a></li>
                          <li><a className="dropdown-item" href="#">Change Settings</a></li>
                          <li>
                              <hr className="dropdown-divider"/>
                          </li>
                          <li><a className="dropdown-item" href="https://github.com/simonmwangi/Palette-3D">Github Project Link</a></li>
                      </ul>
                  </div>
              </div>
          </div>
          <div className="col py-3" id="root">
            {/* 3D model container */}
            <canvas className="webgl"></canvas>
            <MainSpace colors={this.state.colors}/>

          </div>
      </div>
  </div>
      </>
    );
  }
}

export default MainDashboard
