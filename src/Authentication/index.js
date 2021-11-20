export default (app) => {
    

    app.get("/token",(req,res) => {
        res.send("Hi")
    })
    
    return app
}