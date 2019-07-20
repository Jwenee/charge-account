import React from 'react';
import PropTypes from 'prop-types';
import { padLeft, range } from '../utility'


class MonthPicker extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isOpen: false
    }
  }
  componentDidMount() {
    document.addEventListener('click', this.handleClick, false)
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick, false)
  }
  handleClick = (event) => {
    if (this.node.contains(event.target)) {
      return
    }
    this.setState({
      isOpen: false
    })
  }
  toggleDropDown = (event) => {
    event.preventDefault()
    this.setState({
    isOpen: !this.state.isOpen,
    selectYear: this.props.year
    })
  }

  generateClass = (num1, num2) => {
    return (num1 === num2) ? 'dropdown-item active' : 'dropdown-item'
  }

  selectYear = (event, yearNumber) => {
    event.preventDefault()
    this.setState({
      selectYear: yearNumber
    })
  }

  selectMonth = (event, monthNumber) => {
    event.preventDefault()
    this.setState({
      isOpen: false
    })
    this.props.onChange(this.state.selectYear, monthNumber)
  }

  render() {
    const { year, month } = this.props
    const { isOpen, selectYear } = this.state
    const monthRange = range(12, 1)
    const yearRange = range(9, -4).map(num => num + year)
    return (
      <div className="dropdown month-picker-component" ref={(ref) => {this.node = ref}}>
        <h5>选择月份</h5>
        <button className="btn btn-secondary dropdown-toggle"
          id="dropdownMenuButton"
          onClick={this.toggleDropDown}
        >
          {`${year}年 ${padLeft(month)}月`}
        </button>
        { isOpen && 
          <div className="dropdown-menu" style={{display: 'block'}} aria-labelledby="dropdownMenuButton">
            <div className="row">
              <div className="col border-right">
                {yearRange.map((yearNumber, index) => 
                  <div key={index}                     
                    onClick={(event) => {this.selectYear(event, yearNumber)}}
                    className={this.generateClass(yearNumber, selectYear)}
                    style={{cursor: 'pointer'}}
                  >
                    {yearNumber}年
                  </div>
                )}
              </div>
              <div className="col">
                {monthRange.map((monthNumber, index) =>
                  <div key={index} 
                    onClick={(event) => {this.selectMonth(event, monthNumber)}}
                    className={this.generateClass(monthNumber, month)}
                    style={{cursor: 'pointer'}}
                  >
                    {padLeft(monthNumber)}月
                  </div>
                )}
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
}

MonthPicker.propTypes = {
  year: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired
}

export default MonthPicker;