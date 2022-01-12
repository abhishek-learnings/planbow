import express from 'express'
const app = express();
import cors from 'cors'
import routes from './routes'
app.use(express.json())
app.use(cors());



app.get('/', (req, res) => {
    res.send('Welcome to planbow!!');
})

routes(app)

const port = process.env.PORT || '5000';
app.listen(port, () => console.log(`Server started on Port ${port}`));