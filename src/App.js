import React from "react";
import Axios from "axios";
import { observable } from "mobx";
import { observer } from "mobx-react";
import "./App.css";

const axios = Axios.create({
  baseURL: "http://localhost:8080"
});


const outcomes = {
  'not_found': 'You have not found the ring',
  'dead': 'Orc found, Frodo is dead.',
  'destroyed': 'Ring is destroyed.',
  'out': 'Falls out of the map. Nothing is found'
}

const store = observable({
  inputValue: '',
  get disableButton() {
    return store.inputValue === '';
  },
  result: {},
  validationError: false,
  display: () => {
    if (store.validationError !== true) {
      if (store.result.outcome) {
        return outcomes[store.result.outcome]
      }
      else {
        return 'INPUT YOUR MOVEMENTS THEN CLICK TO FIND THE RING'
      }
    }
    else {
      return 'Check your input movements, Must be comma separated values (n,s,e,w)'
    }
  },
  fetchResult: async (input) => {
    try {
      const result = await axios.post("/api/map/play", {
        movements: input
      });
      store.validationError = false;
      store.result = result.data;
    } catch (err) {
       store.validationError = true;
     }
  }
});


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          <input
            type="text"
            onChange={event => {
              store.inputValue = event.target.value;
            }}
          />
          <button
            onClick={() => {
              store.fetchResult(store.inputValue);
            }}
            disabled={store.disableButton}
          >
            Send your movements
          </button>
        </p>
        <p>
          {
           store.display()
          }
        </p>
      </header>
    </div>
  );
}

export default observer(App);
