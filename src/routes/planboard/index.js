import mongojs from 'mongojs'
import db from '../../config/MongoConfig'
import { success, internalServerError } from "../../config/responsetemplate";
import verifyToken from '../../middelware/auth'



export default (app) => {




    app.post("/create", verifyToken, (request, response) => {
        let { planboardName, description, date, team } = request.body
        let currentDate = new Date();
        let createdOn = currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1) + "-" + currentDate.getDate() + " " + currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();



        db.Planboard.findOne({ planboardName }, (err, doc) => {

            if (doc) {
                return response.status(409).send("Planboard with the same name already exist.");
            }
            else {
                db.Planboard.insert({
                    planboardName,
                    description,
                    date,
                    team,
                    createdOn
                }, (err, doc) => {

                    if (err) {
                        internalServerError(response, err)
                    }
                    else {
                        success(response, doc)
                    }


                });



            }
        });
    })

    app.post("/get-plan-list", verifyToken, (request, response) => {
        

        db.Planboard.find().sort({_id: -1}, function (err, docs) {
           if(err){
            success(response, "no planboard")
           }
           if(docs){
            success(response, docs)
           }
        })
    })

    app.post("/update", verifyToken, (request, response) => {
        let { id, planboardName, description, date, team } = request.body
        let currentDate = new Date();
        let createdOn = currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1) + "-" + currentDate.getDate() + " " + currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();


        db.Planboard.findAndModify({
            query: { _id: mongojs.ObjectId(id) },
            update: { 
                $set: { planboardName, description,
                    date,
                    team,
                    createdOn 
                } 
            },
            new: true
        }, function (err, doc, lastErrorObject) {
            if (err) {
                internalServerError(response, err)
            }
            else {
                success(response, doc)
            }
        })
    })

    app.post("/delete", verifyToken, (request, response) => {
        let { id } = request.body
        
        db.Planboard.remove({ _id: mongojs.ObjectId(id)}
            
        , function (err, docs) {
            if (err) {
                internalServerError(response, err)
            }
            else {
                success(response, "success")
            }
        })
    })





    return app
}