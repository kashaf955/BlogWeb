const {Schema , model} = require('mongoose');


const commentSchema = new Schema({
    body: {
        type: String,
        required: true,
        trim: true,
    },

    blogId: {
        type: Schema.Types.ObjectId,
        ref: 'Blog',
    },

    createdBy: {   
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
}
,
{timestamps: true}
);

const comment = model('Comment', commentSchema);
module.exports = comment;