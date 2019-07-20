import React from 'react';
import Ionicon from 'react-ionicons';
import PropTypes from 'prop-types';

class CategorySelect extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  selectCategory = (event, category) => {
    event.preventDefault()
    this.props.onSelectCategory(category)
  }
  render() {
    const { categories, selectedCategory } = this.props
    const selectedCategoryId = selectedCategory && selectedCategory.id
    return (
      <div className="category-select-component">
        <div className="row">
          {
            categories.map((category, index) => {
              const iconColor = (category.id === selectedCategoryId) ? '#fff' : '#555'
              const blackColor = (category.id === selectedCategoryId) ? '#347eff' : '#efefef'
              const activeClassName = (selectedCategoryId === category.id) ? 'category-item col-3 active' : 'category-item col-3'
              return (
                <div className={activeClassName}
                   key={index}
                   onClick={(event) => this.selectCategory(event, category)}
                >
                  <Ionicon 
                    className="rounded-circle"
                    style={{ backgroundColor: blackColor, padding: '5px'}}
                    fontSize="50px"
                    color={iconColor}
                    icon={category.iconName}
                  />
                  {category.name}
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}

CategorySelect.propTypes = {
  categories: PropTypes.array.isRequired,
  onSelectCategory: PropTypes.func.isRequired,
  selectedCategory: PropTypes.object
}
export default CategorySelect;