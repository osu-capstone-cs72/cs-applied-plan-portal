import React, {Component} from "react";

class List extends Component {
  // Initialize the state
  constructor(props){
    super(props);
    this.state = {
      list: {}
    }
  }

  // Fetch the list on first mount
  componentDidMount() {
    this.getList();
  }

  // Retrieves the list of items from the Express app
  getList = () => {

    fetch("/api/course/courseCode/cs101")
    .then(res => res.json())
    .then(obj => {
        console.log(obj);
        alert(JSON.stringify(obj));
      }
    );
    
  }

  render() {
    const { list } = this.state;

    return (
      <div className="App">
   {/* Check to see if any items are found*/}
       {/* Render the list of items */}
        <h1>List of Items</h1>
      </div>
    );
  }
}

export default List;

/*
 {list.length ? (
  <div>
    {list.map((item) => {
      return(
        <div>
          {item}
        </div>
      );
    })}
  </div>
) : (
  <div>
    <h2>No List Items Found</h2>
  </div>
)
}
*/