import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";

export default function DeleteCategoryPage(){
    const [categoryInfo, setCategoryInfo] = useState(null);
    const router = useRouter();
    const {id} = router.query;
    const {enqueueSnackbar} = useSnackbar();

    useEffect(() => {
        if(!id){
            return;
        }
        
   
        axios.get('/api/categories?id='+id).then(response => {
            setCategoryInfo(response.data);
            //console.log(response.data);
        });
    }, [id]);


    function goBack(){
        router.push('/categories');
    }

    async function deleteCategory(){
        await axios.delete('/api/categories?id='+id);
        enqueueSnackbar('Category Deleted Succesfully', {variant: 'error'});
        goBack();
    }

    return(
        <Layout>
           <div className = 'flex justify-center items-center w-full h-full'>
           <div className = 'border border-blue-900 w-full rounded-lg text-center py-4'>
           <h1>Do you want to delete &apos;{categoryInfo?.categoryName}&apos; category permanently?</h1> 
            <div className = 'flex gap-3 justify-center py-2'>
                <button onClick = {deleteCategory} className = 'border bg-red-900 text-white p-2 rounded-xl w-full mx-2'>Yes</button>
                <button onClick = {goBack} className = 'border bg-gray-600 text-white p-2 rounded-xl w-full mx-2'>No</button>
            </div>
           </div>
           </div>
        </Layout>
    )
}
