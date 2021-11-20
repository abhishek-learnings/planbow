import db from '../config/MongoConfig'
import jwt from 'jsonwebtoken'
import bcrypt, { hash } from 'bcryptjs'
import verifyToken from '../middelware/auth'


export default (app) => {


    const TOKEN_KEY = "MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAKmtiCFis3U6LdVIZmZfstxVVZp2ei4Rm4t6MoIEx0FB5fVc7dumjWnLd+Ofes/yojjIVKTHlBCv5/COR3QFC99fL6FPF0M"
        + "ltE6809obQ7G1OISXAwJPQxY1M0tR0zQZchNLzE/5D1Oy+coXNY77NpJAYk6buZy/nG9/NHrQSDC5AgMBAAECgYBYHYgeXlV3wVjf9BNJgtUt2xrzdieJGRe/3Ruxra2UVBaJz1KuyNWTZVjDWqS6r"
        + "PRVrKNYV1SrPc6jfB/bPmulIMYxblgRCy+DLmp0PL5BHDUQhqu21rbj49iR/cgTmi9ER6kR/3Uhv8D6lX44YDbC8O+nkRNXY/8faUkdm+aHqQJBAOkDSvtqq3Aq0N+ESolov+sPQafVpqZS5+ku4J/nD"
        + "LB18yGF91K0HLehbKEgjVeHRhRy5ud0i2cbFC+PHpW6ZMcCQQC6arjjwJNKuNjCcgGT2jVc5ZqkOi3VVZ3Tc/Pcjlh3RRl6jaQuQNlXuTq8lhFm6hR3ft+z8nGdqF6h+gFAWD5/AkANYCUDvaHNtId87"
        + "SkiLiMmKSAJtFf2oDezyP8X7rlpv7uPJxOFadVkLR4BOc8jQR6iud3LV4NRDdrgyARnb+WtAkB2zSjDTKkRx7esQ8epmDjF2TWyT7mB6axJY+4Xs0fByvGv3rCxIXbhpxQ9t02jzq34cYzTO0EY/oJAq/k8"
        + "LoC1AkEApE8SzXC1XzuMt17ozhwpMjhxTGajRv0pMr4GOVN21XQN66OM+q1UWZ9EsyUrpiSvkiS5ZGVeOarJLHmfebgN0w==";

    app.post("/register", (req, res) => {
        // Our register logic starts here

        try {
            // Get user input
            const { first_name, last_name, email, password } = req.body;

            // Validate user input
            if (!(email && password && first_name && last_name)) {
                res.status(400).send("All input is required");
            }

            // check if user already exist
            // Validate if user exist in our database
            db.User.findOne({ email }, (err, doc) => {

                if (doc) {
                    return res.status(409).send("User Already Exist. Please Login");
                }
                else {
                    //Encrypt user password
                    bcrypt.hash(password, 10, (err, hash) => {


                        db.User.insert({
                            first_name,
                            last_name,
                            email: email.toLowerCase(), // sanitize: convert email to lowercase
                            password: hash,
                        }, (err, doc) => {

                            if (doc) {
                                const token = jwt.sign(
                                    { user_id: doc._id, email },
                                    TOKEN_KEY,
                                    {
                                        expiresIn: "2h",
                                    }
                                );
                                res.status(201).json(token);

                            }


                        });


                    });
                }
            });


        } catch (err) {
            console.log(err);
        }
        // Our register logic ends here
    });



    app.post("/login", async (req, res) => {
        try {
            // Get user input
            const { email, password } = req.body;

            // Validate user input
            if (!(email && password)) {
                res.status(400).send("All input is required");
            }
            // Validate if user exist in our database
            db.User.findOne({ email }, (err, doc) => {

                if (doc) {

                    bcrypt.compare(password, doc.password, (err, result) => {
                        if (result) {
                            const token = jwt.sign(
                                { user_id: doc._id, email },
                                TOKEN_KEY,
                                {
                                    expiresIn: "2h",
                                }
                            );

                            res.status(200).json(token);
                        }
                        else{
                            res.status(400).send("Invalid Credentials");
                        }
                    })
                    // Create token

                }
                else{
                    res.status(400).send("Invalid Credentials");
                }

            });


           
        } catch (err) {
            console.log(err);
        }
    });

    app.get("/welcome", verifyToken, (req, res) => {
        res.status(200).send("Welcome 🙌 ");
    });

    // This should be the last route else any after it won't work
    app.use("*", (req, res) => {
        res.status(404).json({
            success: "false",
            message: "Page not found",
            error: {
                statusCode: 404,
                message: "You reached a route that is not defined on this server",
            },
        });
    });

    return app
}