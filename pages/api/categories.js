import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";

export default async function handler(req, res){
    const {method} = req;

    await mongooseConnect();
    
    if(method == 'POST'){
        const {categoryName, parent} = req.body;
        
        const categoryDoc = await Category.create({categoryName, parent: parent || null});
        res.json(categoryDoc);
    }

    if(method == 'GET'){
        res.json(await Category.find().populate('parent'));
    }

    if(method == 'DELETE'){
        if(req.query?.id){
            await Category.deleteOne({_id:req.query.id});
            res.json(true);
        }
    }

    if(method === 'PUT'){
        const {categoryName, parent, _id} = req.body;
        await Product.updateOne({_id}, {categoryName, parent});
        res.json(true);
      }
}