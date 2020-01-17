import React from 'react'
import '../public/index.css'


export default class Course extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            full: false
        }

        this.arrowButton = this.arrowButton.bind(this);
    }

    arrowButton(){
        this.setState({
            full: !this.state.full
        })
    }

    render(){
        return(
        <div className="course">
            <p>{this.props.code} - {this.props.title}</p>
            {this.state.full && <p>Credit hours: {this.props.hours}</p>} 
            {this.state.full && <p>{this.props.description}</p>} 
            {this.state.full && <p>Prerequisites: {this.props.prereqs}</p>}
            <button className="btn btn-add">+ Add to plan</button> 
            {this.state.full ? <button onClick={this.arrowButton}><i className="fad fa-angle-double-up"></i></button>
            : <button onClick={this.arrowButton}><i className="fad fa-angle-double-down"></i></button>}
        </div>
        );
    }
}