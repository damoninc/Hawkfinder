import React from "react";

interface IProps {
  title?: string;
  buttonName?: string;
  outsideSubmit?: (val?: string) => void;
  outsideChange?: (val?: string) => void;
}

interface IState {
  value?: string;
}

/**
 * React Component for creating a textfield and sending the information
 *  in the textfield back up the chain to where it is called
 *
 * @class NameForm
 * @extends {React.Component<IProps, IState>}
 *
 * @property outsideSubmit : Function - subscriber for when form is submitted
 * @property outsideChange : Function - subscriber for when form is changed
 */
class SearchForm extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { value: "" };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event: any) {
    if (this.props.outsideChange != null) {
      this.props.outsideChange(this.state.value);
    }
    this.setState({ value: event.target.value });
  }

  handleSubmit(event: any) {
    if (this.props.outsideSubmit != null) {
      this.props.outsideSubmit(this.state.value);
    }
    alert(this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          {this.props.title}
          <input
            type="text"
            value={this.state.value}
            onChange={this.handleChange}
          />
        </label>
        <input type="submit" value={this.props.buttonName} />
      </form>
    );
  }
}

export default SearchForm;
