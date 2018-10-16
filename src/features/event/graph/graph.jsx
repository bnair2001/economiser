import React, { Component } from 'react';
import PieChart from 'react-simple-pie-chart';
import { Header, Segment } from 'semantic-ui-react'


class Graph extends Component {
  render() {

    
    return (
      <div className="App">
      <Header attached='top' content='GRAPH : '/>
      <Segment attached>
      <p>Graph based on your expenses : </p>
      <PieChart
  slices={[
    {
      color: '#6699f6',
      value: 20,
    },
    {
      color: '#F0F8FF',
      value: 10,
    },
  ]}
/>
 
        </Segment>
      </div>
    );
  }
}

export default Graph;