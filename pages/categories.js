import Layout from "@/components/Layout";
import axios from "axios";
import Link from "next/link";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";

export default function Categories(){
    const [ categoryName, setCategoryName] = useState('');
    const [ parent, setParent] = useState('');
    const [categories, setCategories] = useState([]);
    const [edited, setEdited] = useState(null);
    const {enqueueSnackbar} = useSnackbar();
    const [ properties, setProperties] = useState([]);

    async function fetchCategories(){
        axios.get('/api/categories').then((response) => {
            setCategories(response.data);
        });
    }

    useEffect(() =>{
        fetchCategories();
    }, []);

    async function saveCategory(ev){
        ev.preventDefault();

        const data = {
            categoryName,
            parent,
            properties: properties.map(p => ({name :p.name, 
                values : p.values.split(','),
            })),
        };
        if(edited){
            const _id = edited._id;
            data._id = _id;
            await axios.put('/api/categories?id='+_id, data);
            enqueueSnackbar('Category editted successfully!', {variant: 'success'});
            setEdited(null);
        }

        else{
            await axios.post('/api/categories', data);
        }
        setCategoryName('');
        setParent('');
        setProperties([]);
        fetchCategories();
    }

    function editCategory(category){
        setEdited(category);
        setCategoryName(category.categoryName);
        setParent(category.parent? category.parent._id : '');
        setProperties(category.properties.map(({name, values}) => (
            {name,
                values: values.join(',')
            }
        )));
        
    }

    function addProperty(){
        setProperties(prev => {
            return [...prev, {name: '', values: ''}]
        });
    }

    function handlePropertyNameChange(index, property, newName){
        setProperties(prev =>{
            const properties = [...prev];
            properties[index].name = newName;
            return properties;
        });
    } 

    function handlePropertyValueChange(index, property, newValues){
        setProperties(prev =>{
            const properties = [...prev];
            properties[index].values= newValues;
            return properties;
        });
        
    } 

    function removeProperty(index){
        setProperties(prev => {
            const newProperties = [...prev].filter((p, pIndex) => {
                return pIndex != index;
            });
            return newProperties
        });
    }
    
    return(
        <Layout>
            <h1>Categories</h1>
            <form onSubmit = {saveCategory}>
            <label>{edited? `Edit category ${edited.categoryName}`:'New category Name'}</label>
            <div className = 'flex gap-1'>
            <input  
                type = "text" 
                placeholder = {'Category name'}
                value = {categoryName}
                onChange = {(ev) => setCategoryName(ev.target.value)}
                />
                <select
                    onChange = {ev => setParent(ev.target.value)}
                    value = {parent}>
                    <option value = '0'>No parent category</option>
                    {categories.length > 0 && categories.map(category => (
                        <option key = {category._id} value = {category._id}>{category.categoryName}</option>
                    ))}
                </select>
                </div>
                <div className = 'mb-2'>
                    <label className = 'block'>Properties</label>
                    <button onClick = {addProperty} type = 'button' className = 'btn-default text-sm'>Add new property</button>
                    {properties.length > 0 && properties.map((property, index) => (
                        <div className = 'mt-2 flex gap-1'>
                            <input type = 'text' 
                                value = {property.name} 
                                onChange = {(ev) => handlePropertyNameChange(index, property, ev.target.value)}
                                placeholder = 'property name : (example:color)'/>
                            <input type = 'text' 
                                value = {property.values} 
                                onChange = {(ev) => handlePropertyValueChange(index, property, ev.target.value)}
                                placeholder = 'values, comma separated'/>
                                <button 
                                    type = 'button'
                                    onClick = {ev => removeProperty(index)}
                                    className = 'btn-default mb-1'>Remove</button>
                        </div>
                    ))}
                </div>
            <div className = 'flex gap-1'>
                {edited && (
                    <button type = 'button' onClick = {() =>{
                         setEdited(null);
                         setCategoryName('');
                         setParent('');
                         setProperties([]);
                    }} className = 'btn-default'>Cancel</button>
                )

                }
            <button type = 'submit' className = 'btn-primary'>Save</button>
            </div>
            
            </form>
            {!edited && (
                <table className= 'basic mt-4'>
                <thead>
                    <tr>
                        <td>Catgory Name</td>
                        <td>Parent Category</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {categories.length > 0 && categories.map(category => (
                        <tr key = {category._id}>
                            <td>{category.categoryName}</td>
                            <td>{category.parent? category.parent.categoryName : 'No parent category'}</td>
                            <td className = 'flex'>                                
                            <button onClick = {() => editCategory(category)}
                                className = 'flex btn-change mr-1'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                     <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                                    Edit 
                                </button>
                                <Link className = 'btn-primary' href = {'/categories/delete/'+category._id}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>

                                    Delete
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>
            )}
            

        </Layout>


    )
}