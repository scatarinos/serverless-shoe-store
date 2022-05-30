import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../providers/shop';
import { Shoe } from '../providers/shop.reducer';
export default function Shop() {

    
    const { state: { shoes, brands,  brandFilter, cart }, setBrandFilter,  fetchShoes, addToCart } = useContext(ShopContext);
        

    useEffect(() => {
        if (fetchShoes) {
            fetchShoes()
        }        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [brandFilter])


    function onAdd(shoe: Shoe, size: string) {
        addToCart!({shoe, size})
    }

    return (
        <div className="container mx-auto py-4">
            <h1 >Shoe List</h1>

            <form className='py-2'>

                <label htmlFor="brand" className="block text-xs uppercase font-bold opacity-50">Filter by Brand</label>

                <select name="brand" id="brand" className="form-select appearance-none px-3 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 w-28"
                    onChange={($event) => setBrandFilter!($event.target.value)}
                    value={brandFilter}
                >
                    <option key={'empty'} value={''}>{'All'}</option>    
                    {brands.map(brand => (
                        <option key={brand} value={brand}>{brand}</option>    
                    ))}
                </select>
            </form>


            <ul className="flex flex-col w-full py-4">
                <li className="flex flex-row justify-between">
                    <div className="w-1/4 uppercase text-sm border p-2"><span className="text-gray-400">reference</span></div>
                    <div className="w-1/4 uppercase text-sm border p-2 text-center"><span className="text-gray-400">brand</span></div>
                    <div className="w-1/4 uppercase text-sm border p-2 text-center"><span className="text-gray-400">price</span></div>
                    <div className="w-1/4 uppercase text-sm border p-2 text-center"><span className="text-gray-400">sizes</span></div>
                </li>
                {shoes.map((shoe, index) => (
                    <li className="flex flex-row justify-between" key={index}>
                        <div className="w-1/4 uppercase text-sm border p-2">{ shoe.reference }</div>
                        <div className="w-1/4 uppercase text-sm border p-2 text-center">{ shoe.brand }</div>
                        <div className="w-1/4 uppercase text-sm border p-2 text-center">{ shoe.price }</div>
                        <div className="w-1/4 uppercase text-sm border p-2 text-left ">
                            <ul className='flex flex-row flex-wrap'>
                                <li>
                                    {(shoe.sizes || []).map(size => (
                                        <button key={size} className='p-2 m-1 border' onClick={() => onAdd(shoe, size)}>{size}</button>
                                    ))}                                                                    
                                </li>
                            </ul>
                        </div>
                    </li>
                
                ))}
            </ul>

                      
        </div>
    );
  } 