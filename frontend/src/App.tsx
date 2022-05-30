import React, { useContext, useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from "react-router-dom";
import { ShopContext } from './providers/shop'

function App() {

  const [initialLoad, setInitialLoad] = useState(false)
  const { pathname }  = useLocation()
  const apiURL = process.env.REACT_APP_API_URL ?? 'NO_API'

  const { state: { cart, auth }, fetchShoes, logout} = useContext(ShopContext);

  useEffect(() => {
    if (fetchShoes && ! initialLoad) {
      fetchShoes(true)
      setInitialLoad(true)
    }
  }, [fetchShoes, initialLoad],)


  return (
    <div className="container mx-auto p-8">
      <header className="container mx-auto py-8">
      <nav className="text-sm uppercase flex flex-row justify-between">
          <ul className="flex flex-row">
            <li className={['/', '/shop'].includes(pathname) ? 'font-bold': ''} ><Link to="/shop">Shop</Link></li>
            <li className="px-1">|</li>
            <li className={['/cart'].includes(pathname) ? 'font-bold': ''} ><Link to="/cart">{`Cart ${cart.length ? '(' + cart.length + ')' : ''} `}</Link></li>
          </ul>
          <ul className="flex flex-row">
            { !auth.isLogged && <li className='justify-self-end' >
              <Link to="/login">Login</Link>
            </li> }
            { auth.isLogged && <li className='justify-self-end' >
                <span onClick={() => logout!()} >Logout ({auth.email}) </span></li> }
          </ul>
      </nav>    
      <hr />
    </header> 
    <Outlet />
    <footer className='pt-8'>
      <hr className="p-2" />
      <p className='text-sm'>apiUrl: {apiURL}</p>
    </footer>     
    </div>
  );
}

export default App;
