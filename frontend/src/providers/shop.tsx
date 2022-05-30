import React, { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { IShop, initialState, reducer, IShoe, Shoe, ICartItem, Auth  } from "./shop.reducer";

interface IShopContext {
    state: IShop
    setBrandFilter?: Function
    fetchShoes?: Function
    addToCart?: Function
    removeFromCart?: Function
    createOrder?: Function
    login?: Function
    logout?: Function
  }

  
export const ShopContext = React.createContext<IShopContext>({state: initialState });
export const ShopProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  
  const apiURL = process.env.REACT_APP_API_URL ?? 'NO_API'

  const navigate = useNavigate();

  const value = {
    state,

    async fetchShoes(initial?: boolean) {
      const brandQuery = state.brandFilter ? `&brand=${state.brandFilter}`: ''
      const url = `${apiURL}shoes?dummy=${1}${brandQuery}`
      const response = await fetch(url, { method: 'GET'})
      const data: IShoe[] = await response.json()
      const shoes = data.map(s => new Shoe(s))      
      dispatch({type: 'SET_SHOES', payload: { shoes: shoes }})
      if (initial) {
        const brands: string[] = Array.from(new Set(shoes.map(shoe => shoe.brand)))
        dispatch({type: 'SET_BRANDS', payload: { brands: brands }})
      }
  },

    setBrandFilter(brandFilter: string) {
        dispatch({type: 'SET_BRAND_FILTER', payload: { brandFilter }})
    },

    addToCart(item: ICartItem) {
      dispatch({type: 'ADD_TO_CART', payload: { item }})      
    },

    removeFromCart(index: number) {
      dispatch({type: 'REMOVE_FROM_CART', payload: { index }})      
    },

    async login(email: string, password: string) {

      const url = `${apiURL}authentication`
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user: email,
          password: password
        })            
      }) 
      const { token } = await response.json()
      if (token) {
        const auth = new Auth({email, token})        
        dispatch({type: 'SET_AUTH', payload: { auth }})
        navigate("/", { replace: true });

      }
    },

    async logout() {
      const auth = new Auth({})        
      dispatch({type: 'SET_AUTH', payload: { auth }})
    },

    async createOrder(data: any) {

      const url = `${apiURL}orders`
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': state.auth.token,
        },
        body: JSON.stringify(data)            
      }) 

      const feedback = await response.json()
      dispatch({type: 'SET_FEEDBACK', payload: { feedback }})
      dispatch({type: 'CLEAR_CART', payload: {}})
      
      navigate("/feedback", { replace: true });
    
    }
  }

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  )
}