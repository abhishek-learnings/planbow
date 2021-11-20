import mongojs from 'mongojs'

const uri = "mongodb+srv://admin:admin@cluster0.fy2uq.mongodb.net/planbow?retryWrites=true&w=majority";
let collections = ["planbow"]

let db = null
db=mongojs(uri, collections);

db.on('connect', () => {
   console.log('DB Connected!')
})
db.on('error', (err) => {
   console.log(err)
   logger.error(`Database error: ${err}`)
})


export default db