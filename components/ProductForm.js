import axios from "axios";
import { useRouter } from "next/router";
import { SnackbarProvider, useSnackbar } from "notistack";
import { useState } from "react";
import Spinner from "./Spinner";

export default function ProductForm({_id, title : exTitle,
    description: exDescription, 
    price: exPrice,
    images: exImages,
    }){

    const [title, setTitle] = useState(exTitle || '');
    const [description, setDescription] = useState(exDescription || '');
    const [ price, setPrice] = useState(exPrice || '');
    const [images, setImages] = useState(exImages || []);
    const [ goToProducts, setGoToProducts] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const router = useRouter();
    const {enqueueSnackbar} = useSnackbar();
    
    
    async function saveProduct(ev){
        ev.preventDefault();
        const data = {title, description, price, images};
        if(_id){
            await axios.put('/api/products', {...data, _id});
            enqueueSnackbar('Product editted successfully!', {variant: 'success'});
        }else{
            await axios.post('/api/products', data);
            enqueueSnackbar('Product added successfully!', {variant: 'success'});
        }
       
        setGoToProducts(true);

    }

    if(goToProducts){
        router.push('/products');
    }

    async function uploadImages(ev){
        setIsUploading(true);
        const files = ev.target?.files;
        if(files?.length > 0){
            const data = new FormData();
            for(const file of files){
                data.append('file', file);
            }
            const res = await axios.post('/api/upload', data);
            //console.log(res.data);
            setImages(oldImages => {
                return [...oldImages, ...res.data];
            })

        }
        setIsUploading(false);
    }
    return (
        
            <form onSubmit = {saveProduct}>
            
            <label>Product name</label>
            <input type = "text" placeholder = "Product name"
                value = {title}
                onChange = {ev => setTitle(ev.target.value)}
            />
            <label>Photos</label>
            <div className = 'mb-2 flex flex-wrap gap-2'>
                {!!images?.length && images.map(link => (
                    <div key = {link} className = 'h-24'>
                        <img src = {link} alt = 'product image' className = 'rounded-xl'/>
                    </div>
                ))
                }
                {isUploading && (
                    <div classNmae = 'h-24 flex justify-center items-center rounded-xl p-1'>
                        <Spinner/>
                    </div>
                )}
                <label className = 'w-24 h-24 rounded-xl flex flex-col items-center justify-center text-sm text-gray-600 bg-gray-300 cursor-pointer'>
                <input type = 'file' onChange = {uploadImages} className = 'hidden'/>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg>Upload
                
                </label>
                
            </div>
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