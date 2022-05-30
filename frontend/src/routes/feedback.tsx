import { useContext } from "react";
import { ShopContext } from "../providers/shop";

export default function Feedback() {

    const { state: { feedback } } = useContext(ShopContext);

    return (
        <div className="container mx-auto">
            <h1>Feedback {feedback.message}</h1>

            <pre className="font-mono">
                { JSON.stringify(feedback.data, null, 2) }
            </pre>

        </div>
    )
}