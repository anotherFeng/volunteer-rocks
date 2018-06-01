import React, { Component } from 'react';
import $ from 'jquery';
import axios from 'axios';
import ReactDOM from 'react-dom';
import Filter from './Filter.jsx';

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      opportunities: []
    }

    this.getOpps = this.getOpps.bind(this);
    this.createOpp = this.createOpp.bind(this);
  }

  componentDidMount() {
    this.getOpps();
  }

  getOpps() {
    axios.get('/opportunities')
      .then($.proxy(function(response) {
        this.setState({
          opportunities: '????'
        })
        console.log(response);
      }, this))
      .catch(function(err) {
        throw err;
      });
  }

  createOpp(orgInfo) {
    axios.post('/signUpOrg', orgInfo)
      .then(function (response) {
        console.log(response);
      })
      .catch(function(err) {
        throw err;
      });
  }


  render() {
    return (
      <div>
        <p>Bunch of Frooty Tooties</p>
        <div className='filter'>
          <Filter />
        </div>
      </div>
    );
  }
};

export default App;
ReactDOM.render(<App />, document.getElementById('app'));