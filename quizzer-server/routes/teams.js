const express   = require('express');
const path      = require('path');

const teamsRouter = express.Router();

teamsRouter.post('/login', async function(req,res, next){
    try {
        // TODO: voorbeeld post request
        if (req.body.password === "password") {

            res.json("Login")
        } else {
            res.json("Niet login")
        }
    } catch (err) {
        console.log(err);
    }
});


module.exports = teamsRouter;