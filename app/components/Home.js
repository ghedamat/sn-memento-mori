import React from 'react';
import ComponentManager from 'sn-components-api';

var lastUUID;

export default class Home extends React.Component {

  constructor(props) {
    super(props);
    let permissions = [{name: "stream-context-item"}];
    this.componentManager = new ComponentManager(permissions, function () {
      // on ready
    });

    this.state = {
      data: []
    };
    this.componentManager.streamContextItem((note) => {
      let data;
      try {
        data = JSON.parse(note.content.text);
      } catch (err) {
        data = new Array(80 * 52);
        data.fill(false)
      }
      if (note.uuid !== lastUUID) {
        // Note changed, reset last values
        lastUUID = note.uuid;
        this.setState({note: note, data: data});
      }
    });

    this.save = this.save.bind(this);
    this.clicked = this.clicked.bind(this);
  }

  save() {
    let note = this.state.note;
    let data = this.state.data;
    note.content.text = JSON.stringify(data);
    console.log('save')
    this.componentManager.saveItemWithPresave(note, () => {
    });
  }

  clicked(index) {
    let data = [...this.state.data];
    data[index] = !data[index]
    this.setState({data: data});
    this.save();
  }

  render() {
    return (
      <div class="container">
        <div class="text-center mt-2">
          <h1 class="title"> Memento Mori </h1>
          <a href="https://scrawnytobrawny.com/28251" target="_blank" class="underline">Inspired by Craig Weller</a>
        </div>

        <div id="buttons">
          <Years clicked={this.clicked} data={this.state.data} />
        </div>
      </div >
    )
  }

}

function Year(props) {
  let weeks = [];
  let year = props.year;
  for (let i = year * 52; i < (year * 52) + 52; i++) {
    let past = props.data[i];
    weeks.push(<button onClick={() => {props.clicked(i)}} className={'week-btn ' + (past ? 'bg-black' : 'bg-gray-500')}>{year}:{(i % 52) + 1}</button>);
  }
  return (
    <span class="year">{weeks}</span>
  )
}

function Years(props) {
  let years = [];
  for (let i = 0; i < 80; i++) {
    years.push(<Year clicked={props.clicked} year={i} data={props.data} />);
  }
  return (
    <span class="years">{years}</span>
  )
}

