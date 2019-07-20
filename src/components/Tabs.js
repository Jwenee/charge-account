import React from 'react'
import PropTypes from 'prop-types'

export class Tabs extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeIndex: props.activeIndex
    }
  }
  tabChange = (event, index) => {
    event.preventDefault()
    this.setState({
      activeIndex: index
    })
    this.props.onTabChange(index)
  }
  render() {
    const { children } = this.props
    const { activeIndex } = this.state
    return ( 
      <ul className="nav nav-tabs nav-fill my-4">
        {React.Children.map(children, (child, index) => {
          const activeColor = (activeIndex === index) ? '#000' : '#777'
          return (
            <li className="nav-item">
              <div
                onClick={(event) => { this.tabChange(event, index)}}
                className="nav-link"
                style={{cursor:'pointer', color:activeColor}}
              >
                {child}
              </div>
            </li>
          )
        })}
      </ul>
    )
  }
}
Tabs.propTypes = {
  activeIndex: PropTypes.number.isRequired,
  onTabChange: PropTypes.func.isRequired,
}

export const Tab = ({ children }) => <React.Fragment>{children}</React.Fragment>

