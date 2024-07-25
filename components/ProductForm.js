import axios from "axios";
import { useRouter } from "next/router";
import { SnackbarProvider, useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({_id, title : exTitle,
    description: exDescription, 
    price: exPrice,
    images: exImages,
    category: exCategory,
    properties: exprop
    }){

    const [title, setTitle] = useState(exTitle || '');
    const [description, setDescription] = useState(exDescription || '');
    const [ price, setPrice] = useState(exPrice || '');
    const [images, setImages] = useState(exImages || []);
    const [ goToProducts, setGoToProducts] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const router = useRouter();
    const {enqueueSnackbar} = useSnackbar();
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState(exCategory || '');
    const [productProperties, setProductProperties] = useState(exprop || {});
    
    useEffect(() => {
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        });

    }, []);

    async function saveProduct(ev){
        ev.preventDefault();
        const data = {title, description, price, images, category, properties: productProperties};
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

    function updateImagesOrder(images){
        setImages(images);
    }

    function setProductProp(propName, value){
        setProductProperties(prev => {
            const newProductProps = {...prev};
            newProductProps[propName] = value;

            return newProductProps;
        })
    }

    const propertiesToFill = [];
    if(categories.length > 0 && category){
        let selectedCategoryInfo = categories.find(({_id}) => _id === category);
        propertiesToFill.push(...selectedCategoryInfo.properties);
        while(selectedCategoryInfo.parent?._id){
            const par = categories.find(({_id}) => _id === selectedCategoryInfo.parent?._id);
            propertiesToFill.push(...par.properties);
            selectedCategoryInfo = par;
        }
    }

    return (
        
            <form onSubmit = {saveProduct}>
            
            <label>Product name</label>
            <input type = "text" placeholder = "Product name"
                value = {title}
                onChange = {ev => setTitle(ev.target.value)}
            />
            <label>Category</label>
            <select value = {category} onChange = {ev => setCategory(ev.target.value)}>
                <option value = ''>No category</option>
                {categories.length > 0 && categories.map(category => (
                    <option value = {category._id}>{category.categoryName}</option>
                ))}
            </select>
            {propertiesToFill.length > 0  && propertiesToFill.map(p => (
                <div className="">
                <label>{p.name[0].toUpperCase()+p.name.substring(1)}</label>
                <select value ={productProperties[p.name]} 
                    onChange = {(ev) => setProductProp(p.name, ev.target.value)}>
                    {p.values.map(v => (
                        <option value = {v}>{v}</option>
                    ))}
                </select>
                </div>
            ))}
            <label>Photos</label>
            <div className = 'mb-2 flex flex-wrap gap-2'>
               <ReactSortable 
                list = {images} 
                className = 'flex flex-wrap gap-2'
                setList = {updateImagesOrder}>
               {!!images?.length && images.map(link => (
                    <div key = {link} className = 'h-24 bg-white'>
                        <img src = {link} alt = 'product image' className = 'rounded-xl'/>
                    </div>
                ))
                }
               </ReactSortable>
                {isUploading && (
                    <div className = 'h-24 flex justify-center items-center rounded-xl p-1'>
                        <Spinner/>
                    </div>
                )}
                <label className = 'mt-0 w-24 h-24 rounded-xl flex flex-col items-center justify-center text-sm text-gray-600 border border-gray-300 shadow-sm cursor-pointer'>
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