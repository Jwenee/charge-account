import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
import './bootstrap.min.css';
import Home from './containers/Home';
import Create from './containers/Create';
import { ID, parseDate, flatternArr } from './utility'


export const AppContext = React.createContext()

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      items: {},
      categories: {},
      isLoading: false,
      currentDate: parseDate()
    }
    this.actions = {
      getInitalData: async () => {
        this.setState({
          isLoading: true
        })
        const { currentDate } = this.state
        const getUrlWithData = `/items?monthCategory=${currentDate.year}-${currentDate.month}&_sort=timestamp&_order=desc`
        const results = await Promise.all([axios.get('/categories'), axios.get(getUrlWithData)])        
        const categories = results[0].data
        const items = results[1].data
        this.setState({
          items: flatternArr(items),
          categories: flatternArr(categories),
          isLoading: false
        })
        return items
      },
      getEditData: async (id) => {
        // const {items, categories} = this.state
        let promiseArr = [axios.get('/categories')]
        // if (Object.keys(categories).length === 0) {
        //   promiseArr.push()
        // }
        // const itemsAlreadyFeched = Object.keys(items).indexOf(id) > -1
        if (id) {
          const getUrlWithID = `/items/${id}`
          promiseArr.push(axios.get(getUrlWithID))
        } 
        const results = await Promise.all(promiseArr)
        const categoriesRes = results[0].data
        const editItem = id ? results[1].data : null
        if (id) {
          this.setState({
            categories: flatternArr(categoriesRes),
            items: {...this.state.items, [id]: editItem}
          })
        }else {
          this.setState({
            categories: flatternArr(categoriesRes)
          })
        }
        return {
          categories: flatternArr(categoriesRes),
          editItem: editItem ? editItem : null
        }
      },
      selectNewMonth: async (year, month) => {
        const getUrlWithData = `/items?monthCategory=${year}-${month}&_sort=timestamp&_order=desc`
        const items = await axios.get(getUrlWithData)
          this.setState({
            items: flatternArr(items.data),
            currentDate: {year, month}
          })
        return items
      },
      deleteItem: async (item) => {
        const deleteItem = await axios.delete(`/items/${item.id}`)
        delete this.state.items[item.id]
        this.setState({
          items: this.state.items
        })
        return deleteItem
      },
      createItem: async (data, categoryId) => {
        const newId = ID()
        const parseTime = parseDate(data.date)
        data.monthCategory = `${parseTime.year}-${parseTime.month}`
        data.timestamp = new Date(data.date).getTime()
        const newItem = await axios.post('/items', {...data, id: newId, cid: categoryId})
        this.setState({
          items: {...this.state.items, [newId]: newItem.data}
        })
        return newItem
      },
      updateItem: async (item, updateCategoryId) => {
        const updateItem = {
          ...item,
          cid: updateCategoryId,
          timestamp: new Date(item.date).getTime()
          }
        const modifedItem = await axios.put(`/items/${item.id}`, updateItem)
        this.setState({
          items: { ...this.state.items, [modifedItem.id]: modifedItem.data }
        })
        return modifedItem.data
      }
    }
  }
  render() {
    return (
      <AppContext.Provider value={{
        state: this.state,
        actions: this.actions
      }}>
        <Router>
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
            </header>
            <Route path="/" exact component={Home} />
            <Route path="/create" component={Create} />
            <Route path="/edit/:id" component={Create} />
          </div>


        </Router>
      </AppContext.Provider>
    );
  }
}

export default App;
