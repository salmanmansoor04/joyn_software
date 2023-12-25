import React from 'react'
import { GoogleMap, LoadScript, Polyline, Marker, InfoWindow, HeatmapLayer } from '@react-google-maps/api';

let colors = ['#FF0000', '#00FF00', '#FFFF00', '#FFA500', '#0000FF', '#808080', '#FF5733', '#33C9FF', '#7EFF33', '#FF0000', '#00FF00', '#FFFF00', '#FFA500', '#0000FF', '#808080', '#FF5733', '#33C9FF', '#7EFF33'];
let cableName = [];
let color2 = ['ff0000ff', 'ff00ff00', 'ff00ffff', 'ff0080ff', 'fff0000', '506E6E6E', '#FF0000', '#00FF00', '#FFFF00', '#FFA500', '#0000FF', '#808080', '#FF5733', '#33C9FF', '#7EFF33'];

class PolylineMap extends React.Component {

    render() {

        return (
            <>
                {this.props.mappedmarkers.map((valuepre, index) => {
                    return (
                        <div key={index}>
                            {Object.entries(valuepre).map(([key, value]) => {
                                return (
                                    <div key={key}>
                                        {key !== 'detail' && key != 'id' && key !== 'subtrack' && key !== 'OFC/tower' && this.props.markersShowArray.includes('N/W Elements') &&
                                            <div>
                                                <Marker
                                                    onClick={() => this.markerClicked(value, valuepre.detail, valuepre)}
                                                    icon={{
                                                        url: `https://joyndigital.com/Latitude/public/FiberAppMakrer/${key}.png`,
                                                        scaledSize: { width: 20, height: 20 },
                                                        anchor: { x: 5, y: 20 }
                                                    }}
                                                    title={key.substr(4)}
                                                    position={{
                                                        lat: value[0],
                                                        lng: value[1],

                                                    }}
                                                />
                                            </div>

                                        }
                                        {key == 'OFC/tower' && this.props.markersShowArray.includes('N/W Elements') &&
                                            <div>
                                                <Marker
                                                    onClick={() => this.markerClicked(value, valuepre.detail, valuepre)}
                                                    icon={{
                                                        url: `https://joyndigital.com/Latitude/public/FiberAppMakrer/${key}.png`,
                                                        scaledSize: { width: 40, height: 40 },
                                                        anchor: { x: 5, y: 20 }
                                                    }}
                                                    title={key.substr(4)}
                                                    position={{
                                                        lat: value[0],
                                                        lng: value[1],

                                                    }}
                                                />
                                            </div>

                                        }
                                    </div>
                                );
                            })}

                        </div>
                    )
                })}
            </>
        )
    }

}

export default PolylineMap