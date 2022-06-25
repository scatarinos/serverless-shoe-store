import { useReducer } from 'react'
import { reducer, initialState} from './shop.reducer'
import { render, screen, renderHook } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

  
function TestComponent() {
    const [state, dispatch] = useReducer(reducer, initialState)
    return (
        <>
            <div>shoes count:{state.shoes.length}</div>
            <button onClick={() => dispatch({
                type: 'SET_SHOES',
                payload: {shoes: [{}]}
            })}>dispatch</button>            
        </>
    )
    
}
describe('SET_SHOES', () => {
    it('should set shoes correctly', () => {
        render(<TestComponent />)
        const element = screen.getByText(/shoes count:0/i);
        expect(element).toBeInTheDocument();
    
        const button = screen.getByRole('button')
        // fireEvent.click(button)
        userEvent.click(button)
    
        const element2 = screen.getByText(/shoes count:1/i);
        expect(element2).toBeInTheDocument();            
    }) 
})

describe('SET_SHOES: RenderHook', () => {
    it('should set shoes correctly', () => {
        const { result } = renderHook(() => useReducer(reducer, initialState))

        act(() => {                    
            const dispatch = result.current[1]
            dispatch({
                type: 'SET_SHOES',
                payload: {shoes: [{}]}
            })            
        })
        
        let [ s ] = result.current 
        expect(s.shoes.length).toBe(1)
        expect(result.current[0].shoes.length).toBe(1)        
    }) 
})


export {}