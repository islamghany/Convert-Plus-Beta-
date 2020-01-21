import React, { useState } from "react";
import Box from "../modales/box";
import TwoWayChange from "../modales/twoWayChange";
import { useForm } from "react-hook-form";
class NumberSystem extends React.Component {
  state = {
    type: "",
    binary: "0",
    decimal: "0",
    octal: "0",
    hexadecimal: "0",
    optionSelected:'decimal'
  };
  onSubmit = e => {
    e.preventDefault();

    if (this.state.type === "binary") {
      const num = this.state.binary;

      this.setState({
        octal: parseInt(num, 2).toString(8),
        decimal: parseInt(num, 2),
        hexadecimal: parseInt(num, 2)
          .toString(16)
          .toUpperCase()
      });
    } else if (this.state.type === "decimal") {
      let num = parseInt(this.state.decimal,10);
      if(num>0){
      this.setState({
        octal: num.toString(8),
        binary: num.toString(2),
        hexadecimal: num
          .toString(16)
          .toUpperCase()
      });
      }
      else {
      	num =  Math.abs(num);
      	let res = num ^ parseInt((new Array(num.toString(2).length+1)).join('1'),2);
      	res = (res+1).toString(2);
      	this.setState({
        octal: parseInt(res, 2).toString(8),
        binary:parseInt(res, 2).toString(2),
        hexadecimal: parseInt(res, 2)
          .toString(16)
          .toUpperCase()
      });
      }
    } else if (this.state.type === "hexadecimal") {
      const num = this.state.hexadecimal;
      this.setState({
        octal: parseInt(num, 16).toString(8),
        binary: parseInt(num, 16).toString(2),
        decimal: parseInt(num, 16).toString(10)
      });
    } else if (this.state.type === "octal") {
      const num = this.state.octal;
      this.setState({
        hexadecimal: parseInt(num, 8)
          .toString(16)
          .toUpperCase(),
        binary: parseInt(num, 8).toString(2),
        decimal: parseInt(num, 8).toString(10)
      });
    }
  };
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  setType = e => {
    this.setState({
      type: e
    });
  };
  render() {
    return (
      <div className="box__wrapper">
       <h1>converting Base</h1>
        <div className="box__container">

        <Box
          type="binary"
          setType={this.setType}
          value={this.state.binary}
          pattern="[0-1]+"
          onSubmit={this.onSubmit}
          handleChange={this.handleChange}
        />
        <Box
          type="decimal"
          value={this.state.decimal}
          pattern="[-0-9]+"
          setType={this.setType}
          onSubmit={this.onSubmit}
          handleChange={this.handleChange}
        />
        <Box
          type="octal"
          value={this.state.octal}
          pattern="[0-7]+"
          setType={this.setType}
          onSubmit={this.onSubmit}
          handleChange={this.handleChange}
        />
        <Box
          type="hexadecimal"
          value={this.state.hexadecimal}
          pattern="[A-Fa-f0-9]+"
          setType={this.setType}
          onSubmit={this.onSubmit}
          handleChange={this.handleChange}
        />
        </div>
        <h1>calculations</h1>
        <div className="box__container">
          <TwoWayChange />
        </div>
      </div>
    );
  }
}

export default NumberSystem;
