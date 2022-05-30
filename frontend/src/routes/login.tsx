import { useContext, useState } from "react";
import { ShopContext } from "../providers/shop";

export default function Cart() {
    const { login } = useContext(ShopContext);

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    function onLogin() {
        login!(email, password)
    }

    return (
        <div className="container mx-auto">
            <h1>Login</h1>



            <form className='py-2' onSubmit={e => {e.preventDefault();}}>

                <label htmlFor="email" className="block text-xs uppercase font-bold opacity-50">email</label>                
                <input name="email" id="email" className="form-select appearance-none px-3 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 w-28"
                    onChange={($event) => setEmail!($event.target.value)}
                    value={email}
                />
                <div className="p-1" />
                <label htmlFor="password" className="block text-xs uppercase font-bold opacity-50">password</label>                
                <input type="password" name="password" id="password" className="form-select appearance-none px-3 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 w-28"
                    onChange={($event) => setPassword!($event.target.value)}
                    value={password}
                />

                <div className="p-2 text-sm" >     
                    fake auth: any valid email and password will work                               
                </div>
                <button className="border p-2 px-4 w-28" onClick={onLogin}>Login</button>

            </form>



        </div>
    )
    
}