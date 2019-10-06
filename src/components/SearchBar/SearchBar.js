import React from "react";

class SearchBar extends React.Component {

    onFormSubmit = event => {
        event.preventDefault();
        this.props.onSubmit(this.props.term);
    };

    onInputChange = event => {
        this.props.onChange(event.target.value);
    };

    render() {
        return (
            <div>
                <form onSubmit={this.onFormSubmit}>
                    <div className="bx--form-item bx--text-input-wrapper">
                        <label className="bx--label">{this.props.label}</label>
                        <div className="bx--text-input__field-wrapper">
                        <input
                            className="bx--text-input"
                            placeholder={this.props.placeholderText}
                            value={this.props.term}
                            onChange={this.onInputChange}
                            type="text"
                        />
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default SearchBar;
