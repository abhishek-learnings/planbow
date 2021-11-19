import express from 'express'
const app = express();
//const movies = require('./movies');
import authentication from './Authentication'
app.use(express.json());


authentication(app)

app.get('/', (req,res) => {
    res.send('Welcome to planbow!!');
})












const port = process.env.PORT || '5000';
app.listen(port, () => console.log(`Server started on Port ${port}`));