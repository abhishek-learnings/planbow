import db from '../../config/MongoConfig'
import jwt from 'jsonwebtoken'
import bcrypt, { hash } from 'bcryptjs'
import verifyToken from '../../middelware/auth'


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
                                res.status(201).json({ token: token });

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

                            res.status(200).json({ token: token });
                        }
                        else {
                            res.status(400).send("Invalid Credentials");
                        }
                    })
                    // Create token

                }
                else {
                    res.status(400).send("Invalid Credentials");
                }

            });



        } catch (err) {
            console.log(err);
        }
    });

    app.post("/refresh", verifyToken, (req, res) => {
        const token =
            req.body.token || req.query.token || req.headers["x-access-token"];

        if (!token) {
            return res.status(401).end()
        }

        var payload
        try {
            payload = jwt.verify(token, TOKEN_KEY)
        } catch (e) {
            if (e instanceof jwt.JsonWebTokenError) {
                return res.status(401).end()
            }
            return res.status(400).end()
        }
        // (END) The code uptil this point is the same as the first part of the `welcome` route

        // We ensure that a new token is not issued until enough time has elapsed
        // In this case, a new token will only be issued if the old token is within
        // 30 seconds of expiry. Otherwise, return a bad request status
        // const nowUnixSeconds = Math.round(Number(new Date()) / 1000)
        // if (payload.exp - nowUnixSeconds > 30) {
        //     return res.status(400).end()
        // }

        // Now, create a new token for the current user, with a renewed expiration time
        const newToken = jwt.sign({ user_id: payload.user_id, email: payload.email }, TOKEN_KEY, {

            expiresIn: "2h",
        })

        // Set the new token as the users `token` cookie
        // res.cookie("token", newToken, { maxAge: jwtExpirySeconds * 1000 })
        // res.end()
        res.status(200).json({ token: newToken });
    })

    app.post("/sso-login", async (req, res) => {
        try {
            // Get user input
            const { email, googleId, imageUrl, name, givenName } = req.body;


            // Validate if user exist in our database
            db.User.findOne({ email }, (err, doc) => {

                if (doc) {
                    if (googleId === doc.googleId) {
                        const token = jwt.sign(
                            { user_id: doc._id, email },
                            TOKEN_KEY,
                            {
                                expiresIn: "2h",
                            }
                        );

                        res.status(201).json({ token: token });
                    }
                    else {
                        res.status(400).send("Invalid Credentials");
                    }


                    // Create token

                }
                else {
                    db.User.insert({
                        googleId: googleId,
                        name: name,
                        givenName: givenName,
                        imageUrl: imageUrl,
                        email: email.toLowerCase(), // sanitize: convert email to lowercase
                    }, (err, doc) => {

                        if (doc) {
                            const token = jwt.sign(
                                { user_id: doc._id, email },
                                TOKEN_KEY,
                                {
                                    expiresIn: "2h",
                                }
                            );
                            res.status(201).json({ token: token });

                        }


                    });
                }

            });



        } catch (err) {
            console.log(err);
        }
    });


    app.post("/me", async (req, res) => {
        const token =
            req.body.token || req.query.token || req.headers["x-access-token"];

        if (!token) {
            return res.status(401).end()
        }

        var payload
        try {
            payload = jwt.verify(token, TOKEN_KEY)
            let email = payload.email
            db.User.findOne({ email }, (err, doc) => {

                if (doc) {
                    delete doc._id
                    res.status(201).json({ profileObj: doc });

                } else {
                    res.status(400).send("Invalid Credentials");
                }
            });

        } catch (e) {
            if (e instanceof jwt.JsonWebTokenError) {
                return res.status(401).end()
            }
            return res.status(400).end()
        }
    });

    app.get("/welcome", verifyToken, (req, res) => {
        res.status(200).send("Welcome 🙌 ");
    });

    // // This should be the last route else any after it won't work
    // app.use("*", (req, res) => {
    //     res.status(404).json({
    //         success: "false",
    //         message: "Page not found",
    //         error: {
    //             statusCode: 404,
    //             message: "You reached a route that is not defined on this server",
    //         },
    //     });
    // });

    return app
}