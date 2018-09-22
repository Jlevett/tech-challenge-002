import React, { Component } from "react";
import PropTypes from "prop-types";

import InputComponent from "./InputComponent.js";

class FormComponent extends Component {

	componentWillMount() {
		this.setIntialState();
	}

	//Set the intial "State"
	//1. Deep copy the this.props.schema into FormComponents state
	//   This is necessary as a 'key value pair is to be added to the array object elements
	//2. Create counters array and set to 0.
	setIntialState = () => {
		this.setState((prevState, props) => {
			let tempObj = {};
			let tempSchemaArray = [];
			props.schema.forEach(input => {
				let tempObject = Object.assign({}, input)
				tempObject.value = null;
				tempSchemaArray.push(tempObject);
			});
			tempObj.schema = tempSchemaArray;
			//The counters array increments element value each tme respective
			//a InputComponent renders
 			tempObj.counters = new Array(props.schema.length).fill(0);
			return tempObj;
		});
	}

	//Triggered from "onChange event" in input field
	onInputUpdate  = (key, value, index) => {
		if(!this.props.schema[index].bannedCharacters.test(value)) {
			this.setState(prevState => {
				//Following immutability principles create a smart deep copy of the schema Array
				//and its object elements
				let tempSchemaArray = this.createOptimizedDeepCopySchema(prevState, index);
				//Modify "value" within copied object within copied array
				tempSchemaArray[index].value = value;
				//return modified copied schema "key-value" pair in object
				return {schema: tempSchemaArray};
			});
		}
	}

	//Returns deep copy of the prevState schema array and containing objects.
	//Existing Objects that are not to be mutated are referenced into the new array
	//and not deep copied. This is done to avoid excess object creation.
	createOptimizedDeepCopySchema = (state, condition) => {
		let tempSchemaArray = [];
		state.schema.forEach((input, index) => {
			let tempObject = Object.assign({}, input)
			if(condition === index || condition === 'schemaAsString'
				|| (input.value !== null && condition==='clear')) {
				tempSchemaArray.push(tempObject);
			} else {
				tempSchemaArray.push(input);
			}
		});
		return tempSchemaArray;
	}

	//Set the "value" of the input fields back to null
	clear = () => {
		this.setState(prevState => {
				let tempSchemaArray = this.createOptimizedDeepCopySchema(prevState,'clear');
				//Set "value" to null for each copied object element within the copied array
				tempSchemaArray.forEach(input => {
					if(input.value !== null) {
						input.value = null;
					}
				})
				let tempCountersArray = this.setCountersToResetValues(prevState);
				//return modified copied schema and counter "key-value" pairs in object
				return {
						schema: tempSchemaArray,
						counters: tempCountersArray
					};
			});

	}

	//Creates a new counters array.
	//Iterates over each input in the schema,
	//if input.value is null, then that components render and renderCountUpdate will not be called, hence value is 0
	//But if input.value !== null then that components render and renderCountUpdate will be called, hence value is -1 to compensate
	setCountersToResetValues = (prevState) => {
		let tempCountersArray = [];
		prevState.schema.forEach(input => {
			tempCountersArray.push(input.value !== null ? -1 : 0);
		});
		return tempCountersArray;
	}

	//Called when the InputComponent is about to be rendered.
	//Updates the counter while respecting immutability principles with this.state
	renderCountUpdate = (index) => {//ISSUe
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

	//Converts all RegEx to a string.
	//as JSON.stringify converts RegEx to empty object {}.
	//Returns string object.
	schemaAsString = () => {
		let deepCopiedschema = this.createOptimizedDeepCopySchema(this.state,'schemaAsString');
		deepCopiedschema.forEach(input =>{
			input.bannedCharacters = input.bannedCharacters.toString();
		})
		return JSON.stringify(deepCopiedschema, false, 2);
	}

	render() {
			return (
				<form style={{borderStyle: "solid"}}>
					{this.state.schema.map((input,index) => (
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

//TWO THINGS
//Update the readme file
//CREATE A SMART Callback function for both
//-->createOptimizedDeepCopySchema and setIntialState
//Can i refactor anything
//npm run deploy and remove homepage....