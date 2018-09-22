import React, { Component } from "react";
import PropTypes from "prop-types";

import InputComponent from "./InputComponent.js";

class FormComponent extends Component {

	componentWillMount() {
		this.setIntialState();
	}

	//Set the intial "State"
	//1. Deep copy the this.props.schema into FormComponents state to maintain immutability for this.props.
	//   This is necessary as a 'key value pair is to be added to the array object elements.
	//2. Create counters array and set all to zero.
	setIntialState = () => {
		this.setState((prevState, props) => {
			let tempObj = {};
			//Following immutability principles create a deep copy of the schema Array and its object elements
			let tempSchemaArray = this.createSmartDeepCopySchema(props, 'all');
			//Add 'key-value' pair 'value: null'
			tempSchemaArray.forEach(input => {
				input.value = null;
			});
			//Add array as key-value pair to tempObj
			tempObj.schema = tempSchemaArray;
			//The counters array are initialized to zero and added to tempObj as a key value pair
			//Note: The counters array increments element value each time a respective InputComponent renders.
 			tempObj.counters = new Array(props.schema.length).fill(0);
			return tempObj;
		});
	}

	//Triggered from "onChange event" from input field in InputComponent
	onInputUpdate  = (key, value, index) => {
		//If not a bannedCharacter then continue, input will only show sanitised data
		if(!this.state.schema[index].bannedCharacters.test(value)) {
			this.setState(prevState => {
				//Following immutability principles create a smart deep copy of the schema Array and its object elements
				//Only the object that contains the value that is being changed is copied, the rest of the array
				//are references to the orginal objects
				let tempSchemaArray = this.createSmartDeepCopySchema(prevState, index);
				//Update "value" within copied object within copied array
				tempSchemaArray[index].value = value;
				//Return the modified smart deep copied schema "key-value" pair in an object

				return {schema: tempSchemaArray};
			});
		}
	}

	//Returns schema string object.
	//Note: Converts all RegEx to a string.as JSON.stringify converts RegEx to empty object {}.
	schemaAsString = () => {
		let deepCopiedSchema = this.createSmartDeepCopySchema(this.state, 'all');
		deepCopiedSchema.forEach(input => {
			input.bannedCharacters = input.bannedCharacters.toString();
		});
		return JSON.stringify(deepCopiedSchema, false, 2);
	}

	//Set the "value" of the input fields back to null if it is not already and reset the counters to 0.
	clear = () => {
		this.setState(prevState => {
			let tempSchemaArray = this.createSmartDeepCopySchema(prevState, 'clear');
			//Set "value" to null for each copied object element within the copied array, if not already null.
			tempSchemaArray.forEach(input => {
				if(input.value !== null) {
					input.value = null;
				}
			});
			//Create a new counters array.
			let tempCountersArray = this.setCountersToResetValues(prevState);
			//Return modified copied schema and counter "key-value" pairs in object
			return {
					schema: tempSchemaArray,
					counters: tempCountersArray
				};
		});
	}

	//Returns deep copy of the prevState schema array and containing objects.
	//Existing Objects that are not to be mutated are referenced into the new array
	//and not deep copied. This is done to avoid excess object creation.
	createSmartDeepCopySchema = (object, condition) => {
		//Create a new array
		let tempSchemaArray = [];
		//Iterate over schema objects
		object.schema.forEach((input, index) => {
			//Conditional filter to determine if deep copying is required.
			if(condition === index || condition === 'all'
				|| (input.value !== null && condition === 'clear')) {
				//Create a new object, include key-value pairs from input
				let tempObject = Object.assign({}, input);
				//Add new object reference to array
				tempSchemaArray.push(tempObject);
			}
			else {
				//Deep copy not required. Reference to object is added to array.
				tempSchemaArray.push(input);
			}
		});
		return tempSchemaArray;
	}

	//Creates a new counters array.
	//Iterates over each input in the schema,
	//1. If input.value is null, then that components does not render and renderCountUpdate
	//   will not be called, hence count value is 0
	//2. But if input.value !== null then that components render and renderCountUpdate will be
	//   called, hence value is -1 to compensate for additional count
	setCountersToResetValues = (prevState) => {
		let tempCountersArray = [];
		prevState.schema.forEach(input => {
			tempCountersArray.push(input.value !== null ? -1 : 0);
		});
		return tempCountersArray;
	}

	//Called when the InputComponent is about to be rendered.
	//Updates the counter while respecting immutability principles with this.state
	renderCountUpdate = (index) => {
		this.setState(prevState => {
			//Copy array using spread operator to prevent array object being mutated directly,
			//thus obeying immutable principles.
			let previousCounts = [...prevState.counters];
			//increment count for specific InputComponent
			previousCounts[index] = ++previousCounts[index];
			//return modified copied counter "key-value" pairs in object
			return {counters: previousCounts}
		});
	}

	render() {
		return (
			<form style={{borderStyle: "solid", margin: "15px 15px 15px 15px"}}>
				{this.state.schema.map((input, index) => (
					<div key={input.name + index}>
						<label htmlFor={input.name}>{input.label}</label>
						<br/>
						<InputComponent
							type={input.type}
							name={input.name}
							label={input.label}
							value={input.value}
							index={index}
							onInputUpdate={this.onInputUpdate}
							renderCountUpdate={this.renderCountUpdate}
							inputObject={input}
						/>
						<br/>
						<a>{`Render Count: ${this.state.counters[index]}`}</a>
						<br/>
						<br/>
					</div>
				))}
				<p><button onClick={event => {event.preventDefault(); this.clear();}}>Clear</button></p>
				<pre>{this.schemaAsString()}</pre>
			</form>
		);
	}
}

export default FormComponent;

FormComponent.propTypes = {
        schema: PropTypes.array
	}