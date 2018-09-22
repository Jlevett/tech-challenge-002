# Tech Challenge Two

talk about the other approaches to immutability
    //https://medium.freecodecamp.org/handling-state-in-react-four-immutable-approaches-to-consider-d1f5c00249d5

## HOW TO RUN

### [APP HOSTED HERE. CLICK TO TRY IT OUT!](https://jlevett.github.io/tech-challenge-002/ "Live App Hosted Here")

### Run:
1. Download
2. npm install
2. npm start
3. Open  http://localhost:3000

### Run build version:
1. Download
2. npm install
3. npm run build
3. serve -s build
4. Open  http://localhost:5000

## CHALLENGE NOTES

Create a FormComponent that renders several InputComponents, including one for Text and Numbers. The form component should hold a complete copy of the values displayed by each of the individual inputs. The form’s data should be updated whenever a change is received from an Input (the form should pass an onInputUpdate function down). Upon receiving the data, the Form can choose to sanitise the value based on a provided RegExp. If the form changes the value, it should pass the modified value back to the inputs (via props). Through this update cycle, inputs should only show sanitised data. The form should follow immutability principles to ensure the number of re-renders is minimal, i.e. only the InputComponent reporting the change should re-render once the form’s internal data structure is modified. To demonstrate this, use a render count for each input that updates with each change. The form should support a clear function that causes its internal data to be reset. This should cause each of the inputs to clear themselves.

Some implementation details:

- The form should sanitise the data based on a “bannedCharacters” filter (see below for examples). This should applied when accepting updates from the inputs.

- The form should accept a schema via props to tell it what inputs to render, e.g.
```
[{
    type:”text”,
    name:”firstName”,
    label:”First name”,
    bannedCharacters: /[^\w ]/
},{
    type:”text”,
    name:”phoneNumber”,
    label:”Phone number”,
    bannedCharacters: /[^\d ]/
},{
    type:”number”,
    name:”age”,
    label:”Age”,
    bannedCharacters: /[^\d]/
}]
```
- The schema should be used as the basis for the forms internal state. Once initialised, the form’s internal state should look like:
```
[{
    type:”text”,
    name:”firstName”,
    label:”First name”,
    bannedCharacters: /[^\w ]/,
    value: null
},{
    type:”text”,
    name:”phoneNumber”,
    label:”phoneNumber”,
    bannedCharacters: /[^\d ]/,
    value: null
},{
    type:”number”,
    name:”age”,
    label:”Age”,
    bannedCharacters: /[^\d]/,
    value: null
}]
```
- The clear function will iterate through the internal state and set the value to null. The inputs will need to handle the null value appropriately.

- The labels should be rendered at a FormComponent, avoiding the need to render it in each of the components.

- The form should print out it’s internal state and provide a clear button, e.g.:
```
<form>
    // render inputs
    <p><button onClick={this.clear}>Clear</button></p>
    <pre>{JSON.stringify(this.state,false,2)</pre>
</form>
```
- Demonstrate you can have multiple forms on the same page.
