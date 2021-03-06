import './App.css'
import React, { Component } from 'react'
import Welcome from './pages/Welcome'
import Buy from './pages/Buy'
import Sell from './pages/Sell'
import ItemDetails from './pages/ItemDetails'
import Cart from './pages/Cart'
import { Switch, Route, NavLink } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from './globals'

export default class App extends Component {
  constructor() {
    super()
    this.state = {
      username: 'test',
      recentlyViewed: [],
      selectedListing: '',
      addedToCart: [],
      allSellers: [],
      currentSeller: {}
    }
  }

  componentDidMount() {
    this.getSellers()
  }

  //METHODS

  handleUsername = (event) => {
    this.setState({ username: event.target.value })
  }

  getSellers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/sellers`)
      this.setState({ allSellers: response.data.sellers })
    } catch (error) {
      console.log(error)
    }
  }

  createSeller = async () => {
    const existingUser = this.state.allSellers.filter((seller) => {
      return seller.seller === this.state.username
    })
    existingUser.length
      ? console.log('seller exists')
      : await axios.post(`${BASE_URL}/sellers`, {
          seller: this.state.username,
          customerRating: Math.ceil(Math.random() * 50) / 10
        })
    this.getSellerByName()
  }

  getSellerByName = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/sellers/${this.state.username}`
      )
      this.setState({ currentSeller: response.data.seller[0] })
      console.log(this.state.currentSeller._id)
    } catch (error) {
      console.log(error)
    }
  }

  viewListing = (event) => {
    console.log(event)
  }

  handleSelection = (id) => {
    this.setState({ selectedListing: id })
  }

  addToCart = async () => {
    const itemToAdd = await axios.get(
      `${BASE_URL}/listings/${this.state.selectedListing}`
    )
    const currentCart = this.state.addedToCart
    const newCart = [...currentCart, itemToAdd.data.listing]
    this.setState({ addedToCart: newCart })
    console.log(itemToAdd.data.listing)
  }

  removeFromCart = (id) => {
    const newCart = this.state.addedToCart.filter((item) => {
      return item._id !== id
    })
    this.setState({ addedToCart: newCart })
    console.log(this.state.addedToCart)
  }

  updateRecentlyViewed = async () => {
    const itemToAdd = await axios.get(
      `${BASE_URL}/listings/${this.state.selectedListing}`
    )
    const duplicate = this.state.recentlyViewed.filter((viewedItem) => {
      return viewedItem._id === itemToAdd.data.listing._id
    })
    console.log(duplicate)
    itemToAdd.data.listing && !duplicate.length
      ? this.setState({
          recentlyViewed: [...this.state.recentlyViewed, itemToAdd.data.listing]
        })
      : console.log('skipped')
  }

  render() {
    return (
      <div className="app">
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap"
          rel="stylesheet"
        ></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Heebo:wght@300&display=swap"
          rel="stylesheet"
        ></link>
        <header>
          <h1>barter</h1>
          <div className="menu">
            <div className="nav-container">
              <NavLink to="/buy" className="nav">
                Buy
              </NavLink>
              <NavLink to="/sell" className="nav">
                Sell
              </NavLink>
              <NavLink to="/cart" className="nav">
                Cart
              </NavLink>
            </div>
          </div>
        </header>
        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              <Welcome
                handleUsername={this.handleUsername}
                createSeller={this.createSeller}
              />
            )}
          />
          <Route
            path="/buy"
            render={(reactProps) => (
              <Buy
                recentlyViewed={this.state.recentlyViewed}
                viewListing={this.viewListing}
                handleSelection={this.handleSelection}
                updateRecentlyViewed={this.updateRecentlyViewed}
                {...reactProps}
              />
            )}
          />
          <Route
            path="/sell"
            render={(reactProps) => (
              <Sell
                username={this.state.username}
                {...reactProps}
                currentSeller={this.state.currentSeller}
                recentlyViewed={this.state.recentlyViewed}
                viewListing={this.viewListing}
                handleSelection={this.handleSelection}
                updateRecentlyViewed={this.updateRecentlyViewed}
              />
            )}
          />
          <Route
            path="/item-details/:id"
            render={(reactProps) => (
              <ItemDetails
                selectedListing={this.state.selectedListing}
                addToCart={this.addToCart}
                username={this.state.username}
                {...reactProps}
              />
            )}
          />
          <Route
            path="/cart"
            render={(reactProps) => (
              <Cart
                addedToCart={this.state.addedToCart}
                removeFromCart={this.removeFromCart}
                {...reactProps}
              />
            )}
          />
        </Switch>
        <div className="footer-div">
          <footer>
            <div className="footer-content">
              <h3 className="footer">Contact Us:</h3>
              <p className="footer">Phone: 111-111-1111</p>
              <p className="footer">Email: customerservice@freetrade.com</p>
            </div>
            <div className="footer-content2">
              <p className="footer">Copyright 2021</p>
              <p className="footer">Barter Inc.</p>
            </div>
          </footer>
        </div>
      </div>
    )
  }
}
