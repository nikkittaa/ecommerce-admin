const { Schema, models, model, default: mongoose } = require("mongoose");

const CategorSchema = new Schema({
    categoryName: {type: String, required: true},
    parent: {type: mongoose.Types.ObjectId, ref: 'Category'},
    
});

export const Category = models.Category || model('Category', CategorSchema);