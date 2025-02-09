import dbClient from "../utils/db.js";
import sha1 from 'sha1';


export default class UserController {

    static async postNew(req, res) {
        const email = req.body ? req.body.email : null;
    const password = req.body ? req.body.password : null;

        if (!email) {
            res.status(400).json({error: 'missing email'});
            return;
        }

        if (!password) {
            res.status(400).json({error: 'missing password'});
        }

        const user = await (await dbClient.userCollection()).findOne({ email });

        if (user){
            res.status(400).json({error: 'Already exists'});
            return;
        }

        const insertInfo = await (await dbClient.userCollection()).insertOne({email, password: sha1(password)});

        const userId =  insertInfo.insertedId.toString();
        res.status(200).json({ email: user.email, id: user._id.toString()});
    }
}