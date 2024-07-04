import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

export default function ProductForm({_id, title : exTitle,
    description: exDescription, 
    price: exPrice}){

    const [title, setTitle] = useState(exTitle || '');
    const [description, setDescription] = useState(exDescription || '');
    const [ price, setPrice] = useState(exPrice || '');
    const [ goToProducts, setGoToProducts] = useState(false);
    const router = useRouter();
    
    
    async function saveProduct(ev){
        ev.preventDefault();
        const data = {title, description, price};
        if(_id){
            await axios.put('/api/products', {...data, _id});
        }else{
            await axios.post('/api/products');
        }
       
        setGoToProducts(true);
    }

    if(goToProducts){
        router.push('/products');
    }
    return (
        
            <form onSubmit = {saveProduct}>
            
            <label>Product name</label>
            <input type = "text" placeholder = "Product name"
                value = {title}
                onChange = {ev => setTitle(ev.target.value)}
            />
            <label>Description</label>
            <textarea placeholder = "Description"
                value = {description}
                onChange = {ev => setDescription(ev.target.value)}
            />
            <label>Price (in INR)</label>
            <input type = "number" placeholder = "Price"
                value = {price}
                onChange = {ev => setPrice(ev.target.value)}
            />
            <button type = 'submit' className = 'btn-primary'>Save</button>
            </form>
        
    )
}