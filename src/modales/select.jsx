import React from 'react';
import Select from 'react-select';
class Se extends React.Component {
  render() {
    return (
      <Select     
        onChange={this.props.handleChange}
        options={this.props.options}
        defaultValue={this.props.options[0]}
      />
    );
  }
}
export default Se;