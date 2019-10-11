import mongoose from 'mongoose';


mongoose.connect('mongodb://localhost:27017/setting-sett', {useNewUrlParser: true, 
useCreateIndex: true, useFindAndModify: false
});