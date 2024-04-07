'use strict'

import React from 'react'
import reactCSS from 'reactcss'
import { SketchPicker } from 'react-color'

class ColorPicker extends React.Component {
  state = {
    displayColorPicker: false,
    color: {
      r: '128',
      g: '128',
      b: '128',
      a: '1',
    },
  };

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false })
  };

  componentDidUpdate(prevProps) {
    console.log("Color Has Changed")
      // Check if the colors prop has changed
      // if (prevProps.the_color !== this.props.the_color) {
      //     // Update colors of meshes
      //     console.log("Yes", this.props.the_color)
      // }
  }
  updateColorProp(color) {
    this.setState( {color: color})

    console.log("THe color is", this.state.color)
  }


  render() {
    let { the_color, onChangeColor} = this.props;
    //this.state.color = the_color

    const styles = reactCSS({
      'default': {
        color: {
          width: '50px',
          height: '50px',
          borderRadius: '2px',
          background: `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b }, ${ this.state.color.a })`,
        },
        swatch: {
          padding: '5px',
          background: '#fff',
          borderRadius: '1px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer',
        },
        popover: {
          position: 'absolute',
          zIndex: '2',
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      },
    });

    return (
      <div>
        <div style={ styles.swatch } onClick={ this.handleClick }>
          <div style={ styles.color } />
        </div>
        { this.state.displayColorPicker ? <div style={ styles.popover }>
          <div style={ styles.cover } onClick={ this.handleClose }/>
          <SketchPicker color={ the_color } onChangeComplete={e => onChangeColor(e)} />
        </div> : null }

      </div>
    )
  }
}

export default ColorPicker