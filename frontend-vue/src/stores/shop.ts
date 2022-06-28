import { defineStore, storeToRefs } from "pinia";
import { useAuthStore } from './auth'
import { useRouter } from 'vue-router'

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

export interface IShop {
    shoes: Shoe[]
    brands: string[]
    brandFilter: string
    cart: ICartItem[]
    feedback: any
}

export interface ICartItem {
    shoe: Shoe,
    size: string
  }  
  

export const useShopStore = defineStore('shop', {
  state: () => ({
    shoes: [],
    brands: [],
    cart: [],
    brandFilter: '',
    feedback: {}
  } as IShop),

  actions: {
    async fetchShoes(initial?: boolean) {
        const apiURL = import.meta.env.VITE_API_URL

        const brandQuery = this.brandFilter ? `&brand=${this.brandFilter}`: ''
        const url = `${apiURL}shoes?dummy=${1}${brandQuery}`
        const response = await fetch(url, { method: 'GET'})
        const data: IShoe[] = await response.json()
        const shoes = data.map(s => new Shoe(s))
        this.shoes = shoes      
        if (initial) {
            const brands: string[] = Array.from(new Set(shoes.map(shoe => shoe.brand)))
            this.brands = brands
          }    
    },
    addToCart(item: ICartItem) {
        this.cart = [
            ...this.cart,
            item
        ]
    },

    removeFromCart(index: number) {
        const newCart = [...this.cart]
        newCart.splice(index, 1)
        this.cart = newCart
        console.log('removeFromCart', index)
    },
    

    async createOrder(data: any, onFinish: Function) {

        const apiURL = import.meta.env.VITE_API_URL
        const url = `${apiURL}orders`

        const token = useAuthStore().token

        console.log(':::: token', token)

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token,
          },
          body: JSON.stringify(data)            
        }) 
  
        const feedback = await response.json()
        console.log(':::: feedback from createOrder ', feedback)
        this.feedback = feedback
        this.cart = []
        onFinish()
      }
      

  },
});

/*

*/
