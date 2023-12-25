import React from 'react'
import { GoogleMap, LoadScript, Polyline, Marker, InfoWindow, HeatmapLayer } from '@react-google-maps/api';

let myInterval
class OtdrMap extends React.Component {

    state = {

        offset: '0%'
    }

    otdrMapClicked = (e, file) => {
        let position = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        this.props.otdrMapClicked(position, file)

    }

    render() {

        return (
            <>
                 {this.props.otdrResults.map((value, index) => {
                                return (
                                    <div key={index}>
                                        <Polyline
                                            path={value.line}
                                            options={{
                                                strokeOpacity: 0,
                                                icons: [
                                                    {
                                                        icon: {
                                                            path: "M 0,0 1.5,0 M 1.5,0 1.5,2 M 1.5,2 0, 2  ",
                                                            strokeColor: "#FF3855",
                                                            strokeWeight: 3,
                                                            strokeOpacity: 1,
                                                            scaledSize: { width: 10, height: 10 },
                                                        },
                                                        offset: this.state.offset,
                                                        repeat: "10px",
                                                    }
                                                ]
                                            }}
                                        />
                                        <Marker
                                            onClick={(e) => this.otdrMapClicked(e, value.pdf_file)}
                                            icon={{
                                                url: `otdr.jpg`,
                                                scaledSize: { width: 30, height: 20 },
                                                anchor: { x: 20, y: 0 }
                                            }}
                                            title={value.length + ' ' + 'km'}
                                            position={value.locA}
                                        />
                                        <Marker
                                            onClick={(e) => this.otdrMapClicked(e, value.pdf_file)}
                                            icon={{
                                                url: `otdr.jpg`,
                                                scaledSize: { width: 30, height: 20 },
                                                anchor: { x: 20, y: 0 }
                                            }}
                                            title={value.length + ' ' + 'km'}
                                            position={value.locB}
                                        />
                                    </div>
                                )
                            })} 
            </>
        )
    }

    componentDidMount(){
        let count = 0;
        myInterval = setInterval(() => {
            count = (count + 1) % 200;
            this.setState({
                offset: count / 2 + "%",
            })
        }, 50)
    }

    componentWillUnmount(){
        clearInterval(myInterval);
    }
}

export default OtdrMap