import React from 'react'

import '../styles/Spinner.css'

class Spinner extends React.Component {

    render() {
        return (
            <div className="spinner"> 

                <div style={{fontSize: '100px', color: 'rgba(0, 110, 255, 0.959)', heigth : '100px', width: '40px', float:'left', fontFamily: "'Lucida Console', 'Courier New', monospace"}}>J</div>

                <div className="sk-circle" style={{float: 'left', marginTop: '10px', marginLeft: '20px'}}>
                    <div className="sk-circle1 sk-child"></div>
                    <div className="sk-circle2 sk-child"></div>
                    <div className="sk-circle3 sk-child"></div>
                    <div className="sk-circle4 sk-child"></div>
                    <div className="sk-circle5 sk-child"></div>
                    <div className="sk-circle6 sk-child"></div>
                    <div className="sk-circle7 sk-child"></div>
                    <div className="sk-circle8 sk-child"></div>
                    <div className="sk-circle9 sk-child"></div>
                    <div className="sk-circle10 sk-child"></div>
                    <div className="sk-circle11 sk-child"></div>
                    <div className="sk-circle12 sk-child"></div>
                </div>

            </div>
        )
    }

}

export default Spinner;