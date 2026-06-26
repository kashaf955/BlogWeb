const {createHmac , randomBytes} = require('crypto');
const jwt = require('jsonwebtoken');
const {Schema , model} = require('mongoose');

const JWT_SECRET = process.env.JWT_SECRET || 'blogweb6789ujjjsdhuaisdasbue2937328483kfndsfhsh@#$%$%^E';

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profileImageURL: {
        type: String,
        default: '/images/download.jpg',
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER',
    },
},
{timestamps: true});

userSchema.pre('save', function() {
    if (!this.isModified('password'))
        return;
    const salt = randomBytes(16).toString('hex');
    this.salt = salt;
    this.password = createHmac('sha256', salt)
        .update(this.password)
        .digest('hex');
});

function createTokenForUser(user) {
    return jwt.sign(
        {
            _id: user._id,
            email: user.email,
            role: user.role,
        },
        JWT_SECRET,
        {expiresIn: '1h'}
    );
}

userSchema.statics.matchPasswordAndCreateToken = async function(email, password) {
    const user = await this.findOne({email});
    if (!user) throw new Error('User not found');

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHashed = createHmac('sha256', salt)
        .update(password)
        .digest('hex');

    if (hashedPassword !== userProvidedHashed) throw new Error('incorrect password');

    return createTokenForUser(user);
};


const User = model('User', userSchema);

module.exports = User;