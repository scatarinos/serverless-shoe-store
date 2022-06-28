import { defineStore } from "pinia";


export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuth: false,
    email: '',
    token: '',
  }),
  actions: {
    async login(email: string, password: string, onSuccess: Function) {
        const apiURL = import.meta.env.VITE_API_URL

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
          this.isAuth = true
          this.email = email
          this.token = token
          onSuccess()      
        }
        this.isAuth = true
    },
    logout() { 
        this.isAuth = false
        this.email = ''
        this.token = ''
    },
  },
});

/*
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
*/