import React, { Component } from 'react';
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import MarkerClusterer from 'react-google-maps/lib/components/addons/MarkerClusterer';
import axios from 'axios';

class LoadAllMarkers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ops: []
    }
  }

  componentDidMount() {
    axios.get('/api/opportunities')
      .then(response => {
        this.setState({
          ops: response.data
        });
      });
  }

  render() {
    const OpportunityMap = withGoogleMap(props => (
      <GoogleMap
        defaultCenter={{ lat: 39.828300, lng: -98.579500 }}
        defaultZoom={4}
      >
        <MarkerClusterer
          onClick={props.onMarkerClustererClick}
          averageCenter
          enableRetinaIcons
          gridSize={60}
        >
          {this.state.ops.map(marker => (
            <Marker
              key={marker._id}
              position={{ lat: marker.location.lat, lng: marker.location.lng }}
            />
          ))}
        </MarkerClusterer>
      </GoogleMap>
    ))
    return (
      <div>
        <OpportunityMap
          containerElement={<div style={{ height: `900px`, width: '1700px' }} />}
          mapElement={<div style={{ height: `100%` }} />}
        />
      </div>
    );
  }
};
export default LoadAllMarkers;