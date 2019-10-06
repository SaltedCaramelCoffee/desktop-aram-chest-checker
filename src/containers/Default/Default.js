import React from "react";
import "./_default.scss";

class Default extends React.Component {
    render() {
        return <div className="default">{this.props.message}</div>;
    }
}

export default Default;
