interface IAuth {
  email?: string
  token?: string
  isLogged?: boolean
}

export class Auth {
  email?: string
  token?: string
  isLogged: boolean

  constructor(data: IAuth) {
    const { email, token } = data
    this.email = email
    this.token = token
    this.isLogged = email && token ? true: false
  }
}

export interface IShoe {
    id: string,
    reference: string,
    price: number,
    brand: string,
    sizes: string[]
}

export class Shoe {
    id: string
    reference: string
    price: number
    brand: string
    sizes: string[]
  
    constructor(data: IShoe) {
      const { id, reference, price, brand, sizes } = data
      this.id = id
      this.reference = reference
      this.brand = brand
      this.price = price
      this.sizes = sizes
    }
}

export interface ICartItem {
  shoe: Shoe,
  size: string
}  

export interface IShop {
    shoes: Shoe[]
    brands: string[]
    brandFilter: string
    cart: ICartItem[]
    feedback?: any
    auth: IAuth    
}


  export const initialState: IShop = {
      shoes: [],
      brands: [],
      brandFilter: '',
      cart: [],
      feedback: {},
      auth: new Auth({})
      
  }
      
  export const reducer = (state: IShop, action: {type: string, payload: any}) => {
    switch(action.type) {
              
      case 'SET_BRAND_FILTER':
        return { ...state, brandFilter: action.payload.brandFilter }
  
      case 'SET_SHOES':  
        return {...state, shoes: action.payload.shoes }

      case 'SET_BRANDS':  
        return {...state, brands: action.payload.brands }

      case 'ADD_TO_CART': {
        const newCart = [...state.cart, action.payload.item ]
        return {...state, cart: newCart }
      }

      case 'CLEAR_CART': {
        return {...state, cart: [] }
      }

      case 'REMOVE_FROM_CART': {
        const newCart = [...state.cart]
        newCart.splice(action.payload.index, 1)
        return {...state, cart: newCart }
      }

      case 'SET_AUTH': {
        return {...state, auth: action.payload.auth}
      }

      case 'SET_FEEDBACK': {
        return {...state, feedback: action.payload.feedback}
      }

      default:
        return state
    }
  
  }