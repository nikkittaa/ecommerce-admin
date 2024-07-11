import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";

export default async function handler(req, res){
    const {method} = req;

    await mongooseConnect();
    
    if(method == 'POST'){
        const {categoryName, parent, properties} = req.body;
        
        const categoryDoc = await Category.create({categoryName, parent: parent || null, properties});
        res.json(categoryDoc);
    }

    if(method == 'GET'){
        if(req.query?.id){
            res.json(await Category.findOne({_id:req.query.id}).populate('parent'));
        }else{
            res.json(await Category.find().populate('parent'));
        }
    }

    if(method == 'DELETE'){
        if(req.query?.id){
            await Category.deleteOne({_id:req.query.id});
            res.json(true);
        }
    }

    if(method === 'PUT'){
        var {categoryName, parent, _id, properties} = req.body;
        if(parent === '0'){
            parent = null;
        }
        await Category.updateOne({_id}, {categoryName, parent: parent || null, 
            properties,
        });
        res.json(true);
      }
}