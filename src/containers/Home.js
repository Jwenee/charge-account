import React, { Fragment } from 'react';
import Ionicon from 'react-ionicons';
import { withRouter } from 'react-router-dom';
import PriceList from '../components/PriceList';
import TotalPrice from '../components/TotalPrice';
import CreateBtn from '../components/CreateBtn';
import MonthPicker from '../components/MothPicker';
import { Tabs, Tab } from '../components/Tabs';
import Loading from '../components/Loading';
import PieChart from '../components/PieChart'
import withContext from '../WithContext';
import { LIST_VIEW, CHART_VIEW, TYPE_OUTCOME, TYPE_INCOME } from '../utility';

const tabsText = [LIST_VIEW, CHART_VIEW]

const generateChartDataByCategory = (items, type = TYPE_INCOME) => {
  let categoryMap = {}
  items.filter(item => item.category.type === type).forEach(item => {
    if (categoryMap[item.cid]) {
      categoryMap[item.cid].value += (item.price *  1)
      categoryMap[item.cid].items.push(item.id)
    } else {
      categoryMap[item.cid] = {
        name: item.category.name,
        value: item.price * 1,
        items: [item.id]
      }
    }
  })
  return Object.keys(categoryMap).map(mapKey => ({...categoryMap[mapKey]}))
}

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tabView: tabsText[0]
    }
  }
  componentDidMount() {
    this.props.actions.getInitalData()
  }

  render() {
    const { data } = this.props
    const { items,categories, currentDate, isLoading } = data
    const { tabView } = this.state
    const itemsWithCategory = Object.keys(items).map(id => {
      items[id].category = categories[items[id].cid]
      return items[id]
    })
    const chartOutcomeDataByCategory = generateChartDataByCategory(itemsWithCategory, TYPE_OUTCOME)
    const chartIncomeDataByCategory = generateChartDataByCategory(itemsWithCategory, TYPE_INCOME)
    let totalIncome = 0, totalOutcome =0
    itemsWithCategory.forEach(item => {
      if (item.category.type === TYPE_OUTCOME) {
        totalOutcome += item.price
      } else {
        totalIncome += item.price
      }
    })
    return (
      <Fragment>
        <div className="row align-items-center" style={{margin:0}}>
          <div className="col">
            <MonthPicker
              year={currentDate.year}
              month={currentDate.month}
              onChange={this.changeDate}
            />
          </div>
          <div className="col">
            <TotalPrice
              income={totalIncome}
              outcome={totalOutcome}
            />
          </div>
        </div>
        <div className="content-area py-3 px-3">
          { isLoading &&
            <Loading/>
          }
          { !isLoading &&
            <Fragment>
              <Tabs activeIndex={0} onTabChange={this.changeView}>
                <Tab>
                  <Ionicon
                    className="rounded-circle mr-2"
                    fontSize="25px"
                    color={'#007bff'}
                    icon='ios-paper'
                  />
                列表模式
                </Tab>
                <Tab>
                  <Ionicon
                    className="rounded-circle mr-2"
                    fontSize="25px"
                    color={'#007bff'}
                    icon='ios-pie'
                  />
                图表模式
                </Tab>
              </Tabs>
              <CreateBtn onClick={this.createItem} />
              { tabView === LIST_VIEW &&
                <PriceList
                  items={itemsWithCategory}
                  onModifyItem={this.modifyItem}
                  onDeleteItem={this.deleteItem}
                />
              }
              { tabView === CHART_VIEW &&
                <Fragment>
                  <PieChart title=" 本月支出" categoryData={chartOutcomeDataByCategory} />
                  <PieChart title=" 本月收入" categoryData={chartIncomeDataByCategory} />
                </Fragment>
              }
              { ((tabView === LIST_VIEW || CHART_VIEW)  && itemsWithCategory.length === 0 ) &&
                <h3 className="text-center mt-3">本月暂时还没有数据</h3>                                              
              }
          </Fragment>
          }
        </div>
      </Fragment>
    )
  }
  changeView = (index) => {
    this.setState({
      tabView: tabsText[index]
    })
  }
  changeDate = (year, month) => {
    this.props.actions.selectNewMonth(year,month)
  }
  createItem = () => {
    this.props.history.push('/create')
  }
  modifyItem = (modItem) => {
    this.props.history.push(`/edit/${modItem.id}`)
  }
  deleteItem = (delItem) => {
    this.props.actions.deleteItem(delItem)
  }
}

export default withRouter(withContext(Home));