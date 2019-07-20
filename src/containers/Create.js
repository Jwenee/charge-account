import React from 'react';
import { PropTypes } from 'prop-types';
import { withRouter } from 'react-router-dom';
import CategorySelect from '../components/CategorySelect';
import { Tabs, Tab } from '../components/Tabs';
import PriceFrom from '../components/PriceForm';
import { TYPE_INCOME, TYPE_OUTCOME } from '../utility';
import withContext from '../WithContext';

const tabsText = [TYPE_OUTCOME,TYPE_INCOME]

class Create extends React.Component {
  constructor(props) {
    super(props)
    const {id} = props.match.params
    const {categories, items} = props.data
    this.state = {
      selectedTab: (id && items[id]) ? categories[items[id].cid].type : TYPE_OUTCOME,
      selectedCategory: (id && items) ? categories[items.cid] : null
    }
  }
  componentDidMount() {
    const {id} = this.props.match.params
    this.props.actions.getEditData(id).then(data => {
      const {editItem, categories} = data
      this.setState({
      selectedTab: (id && editItem) ? categories[editItem.cid].type : TYPE_OUTCOME,
      selectedCategory: (id && editItem) ? categories[editItem.cid] : null
      })
    })
  }
  tabChange = (index) => {
    this.setState({
      selectedTab: tabsText[index]
    })
  }
  cancelSubmit = () => {
    this.props.history.push('/')
  }
  submitForm = (data, isEditModel) => {
    if (!isEditModel) {
      // create
      this.props.actions.createItem(data, this.state.selectedCategory.id)
      this.props.history.push('/')
    } else {
      // update
      this.props.actions.updateItem(data, this.state.selectedCategory.id)
      this.props.history.push('/')
    }
  }
  selectCategory = (category) => {
    this.setState({
      selectedCategory: category
    })
  }

  render() {
    const {data} = this.props
    const { id } = this.props.match.params
    const { items, categories } = data
    const editItem = (id && items[id]) ? items[id] : {}
    const { selectedTab, selectedCategory } = this.state
    const filterCategories = Object.keys(categories)
    .filter((id => categories[id].type === selectedTab))
    .map(id =>  categories[id])
    const tabIndex = tabsText.findIndex(text => text === selectedTab)
    return (
      <div className="create-page py-3 px-3 rounded mt-3" style={{ background: '#fff' }}>
        <Tabs activeIndex={tabIndex} onTabChange={this.tabChange}>
          <Tab>支出</Tab>
          <Tab>收入</Tab>
        </Tabs>
        <CategorySelect 
          categories={filterCategories} 
          onSelectCategory={this.selectCategory} 
          selectedCategory={selectedCategory}
        />
        <PriceFrom
          onFormSubmit={this.submitForm}
          onCancelSubmit={this.cancelSubmit}
          item={editItem}
        />
      </div>
    )
  }
}

Create.propTypes = {
  data: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  history: PropTypes.object,
  match: PropTypes.object
}

export default withRouter(withContext(Create));