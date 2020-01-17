import React from 'react'
import EditPlan from './EditPlan'
import CourseContainer from './CourseContainer'

export default class StudentCreatePlan extends React.Component {

    render(){
        return(
        <div className="student-create-plan">
            <EditPlan />
            <CourseContainer />
        </div>
        );
    }
}