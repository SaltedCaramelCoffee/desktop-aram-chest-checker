import React from "react";
import './_toggle.scss'

class Toggle extends React.Component {

  onToggleChange = event => {
      this.props.onChange();
  };

  render() {
    return (
      <div className="bx--form-item">
        <input className="bx--toggle-input bx--toggle-input" id="toggle" type="checkbox" onChange={this.onToggleChange} defaultChecked/>
        <label className="bx--toggle-input__label" htmlFor="toggle" aria-label="filter toggle">
          <span className="bx--toggle__switch">
            <svg className="bx--toggle__check" width="6px" height="5px" viewBox="0 0 6 5">
              <path d="M2.2 2.7L5 0 6 1 2.2 5 0 2.7 1 1.5z" />
            </svg>
            <span className="bx--toggle__text--off" aria-hidden="true"></span>
            <span className="bx--toggle__text--on" aria-hidden="true"></span>
          </span>
        </label>
      </div>
    )
  }
}
export default Toggle;
