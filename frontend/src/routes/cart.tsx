import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../providers/shop";

export default function Cart() {

    const { state: { cart , auth }, removeFromCart, createOrder} = useContext(ShopContext);

    const [ name, setName ] = useState('')
    const [ address, setAddress ] = useState('')
    const [ city, setCity ] = useState('')
    const [ zip, setZip ] = useState('')


    function onCreateOrder() {
        const data = {
            "client": name,
            "shipping": {
                "address": address,
                "city": city,
                "zip": zip
            },       
            "lines": cart.map(l => ({
                "reference": l.shoe.reference,
                "size": l.size,
                "price": l.shoe.price

            })),
          }

          createOrder!(data)          
    
    }
    return (
        <div className="container mx-auto py-4">
            <h2>Shopping Cart</h2>
            
            <ul className="flex flex-col w-full py-4">
                <li className="flex flex-row justify-between">
                    <div className="w-1/4 uppercase text-sm border p-2"><span className="text-gray-400">reference</span></div>
                    <div className="w-1/4 uppercase text-sm border p-2 text-center"><span className="text-gray-400">brand</span></div>
                    <div className="w-1/4 uppercase text-sm border p-2 text-center"><span className="text-gray-400">price</span></div>
                    <div className="w-1/4 uppercase text-sm border p-2 text-center"><span className="text-gray-400">sizes</span></div>
                </li>
                {cart.map((item, index) => (
                    <li className="flex flex-row justify-between" key={index}>
                        <div className="w-1/4 uppercase text-sm border p-2">{ item.shoe.reference }</div>
                        <div className="w-1/4 uppercase text-sm border p-2 text-center">{ item.shoe.brand }</div>
                        <div className="w-1/4 uppercase text-sm border p-2 text-center">{ item.shoe.price }</div>
                        <div className="w-1/4 uppercase text-sm border p-2 text-center">
                            { item.size }
                            <button className="border p-1 m-1" onClick={() => removeFromCart!(index)}>-</button>
                        </div>
                    </li>                
                ))}
            </ul>
            { cart.length === 0 && <h1 className="text-center p-2">Empty Cart</h1>}

            { cart.length !== 0 && (auth.isLogged ?? false) &&

                <form className='py-2' onSubmit={e => {e.preventDefault();}}>

                    <label htmlFor="name" className="block text-xs uppercase font-bold opacity-50">name</label>                
                    <input required name="name" id="name" className="form-select appearance-none px-3 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 w-64"
                        onChange={($event) => setName($event.target.value)}
                        value={name}
                    />                
                    <div className="p-1" />
                    <label htmlFor="address" className="block text-xs uppercase font-bold opacity-50">address</label>                
                    <input name="address" id="address" className="form-select appearance-none px-3 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 w-64"
                        onChange={($event) => setAddress($event.target.value)}
                        value={address}
                    />                
                    <div className="p-1" />

                    <div className="p-1" />
                    <label htmlFor="city" className="block text-xs uppercase font-bold opacity-50">city</label>                
                    <input name="city" id="city" className="form-select appearance-none px-3 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 w-64"
                        onChange={($event) => setCity($event.target.value)}
                        value={city}
                    />                
                    <div className="p-1" />
                    <label htmlFor="zip" className="block text-xs uppercase font-bold opacity-50">zip</label>                
                    <input name="zip" id="zip" className="form-select appearance-none px-3 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 w-64"
                        onChange={($event) => setZip($event.target.value)}
                        value={zip}
                    />                
                    <div className="p-1" />
                </form>
            }

            {
                cart.length !== 0 && (auth.isLogged ?? false) &&
                <div className="container mx-auto">
                    <button className="border p-2" onClick={() => onCreateOrder()}>Create Order</button>
                </div>
            }
            {
                cart.length !== 0 && (!auth.isLogged ?? false) &&
                <div className="container">
                    <Link className="border p-2" to="/login">Please login to create order</Link>
                </div>
            }
        </div>
    );
  } 