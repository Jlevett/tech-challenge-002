import React, { Component } from "react";
import PropTypes from "prop-types";

class InputComponent extends Component {

    //Will render the InputComponent if the inputObject has changed.
    shouldComponentUpdate(nextProps) {
        //Check if object is the same object or a different object.
        if(nextProps.inputObject === this.props.inputObject) {
            return false;
        } else {
            //Update the render counter for this InputComponent
            this.props.renderCountUpdate(this.props.index);
            return true;
        }
    }

    render() {
        return (
            <input
                id={this.props.name}
                type={this.props.type}
                value={this.props.value === null ? "" : this.props.value}
                onChange={event => this.props.onInputUpdate(this.props.name, event.target.value, this.props.index)}
            />
        );
    }
}

export default InputComponent;

InputComponent.propTypes = {
        type: PropTypes.string,
        name: PropTypes.string,
        label: PropTypes.string,
        value: PropTypes.string,
        index: PropTypes.number,
        onInputUpdate: PropTypes.func,
        renderCountUpdate: PropTypes.func,
        inputObject: PropTypes.object
    }