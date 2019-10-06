import React from "react";
import './_button.scss'

class Button extends React.Component {

    onButtonClick = () => {
        this.props.onButtonClick()
    }

    render() {
        return (
            <button className="bx--btn bx--btn--ghost refresh" type="button" onClick={this.props.onButtonClick}>{this.props.text}</button>
        );
    }
}

export default Button;
