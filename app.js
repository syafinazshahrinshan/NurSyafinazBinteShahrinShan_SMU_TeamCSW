/*
# Assumptions: 
1. User always inputs the correct time format
2. One month has 28 days
3. Salary is in the form of value/min
4. Robot work in minutes, seconds not included 
5. Robot shift ends in hours, minutes are ignored (eg. end shift timing = 15:00:00 not 15:10:00)
6. Robot can minimally work for 1 hours and for a maximum of 12 months 
7. Year remains constant (eg. the robot cannot work from 2038-12-31 to 2039-01-01)
8. For every eight hours, the robot needs to take an hour of unpaid break (or part thereof)
9. standardDay, standardNight, extraDay, extraNight values follow the ones shown in the sample PDF
*/

const express = require("express");
const app = express();
const totalRate = require(__dirname + "/logic.js")

app.set("view engine", "ejs");

app.use(express.urlencoded({
    extended: true
}));

app.use(express.static("public"));

// finish ejs files

// Sending file path from server to client
app.get('/', function(req, res) {
    res.render("index");
})

app.post('/', function(req, res) {
    // from form
    const start = req.body.StartDateTime;
    const end = req.body.EndDateTime;

    // shift = {"start": "2038-03-03T07:00:00", "end": "2038-04-03T23:00:00"}
    let shift = {
        "start": start, 
        "end": end
    }

    let rate = totalRate(shift)

    res.render('output', {
        start: start,
        end: end,
        rate: rate
    })
    
})

app.listen(3000, function() {
    console.log("Server started on port 3000");
})