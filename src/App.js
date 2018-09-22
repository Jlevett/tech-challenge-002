import React, { Component } from 'react';
import FormComponent from './components/FormComponent.js';

const schema = [{
    type:"text",
    name:"firstName",
    label:"First name",
    bannedCharacters: /[^\w ]/,
},{
    type:"text",
    name:"phoneNumber",
    label:"Phone number",
    bannedCharacters: /[^\d ]/,
},{
    type:"number",
    name:"age",
    label:"Age",
    bannedCharacters: /[^\d]/,
}];

class App extends Component {
  render() {
    return (
      <div className="App">
        <FormComponent schema={schema}/>
        <FormComponent schema={schema}/>
      </div>
    );
  }
}

export default App;


