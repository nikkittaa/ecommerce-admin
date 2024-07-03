import Layout from "@/components/Layout";
import Link from "next/link";

export default function Products(){
    return(
        <Layout>
            <Link className = 'bg-blue-900 text-white rounded-md p-2' href = {'/products/new'}>
                Add new products
            </Link>
        </Layout>
    );
}