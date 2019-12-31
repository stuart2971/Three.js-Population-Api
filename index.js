const express = require('express')
const { findPopulationInCountry } = require("./FetchPopulationData.js")

const app = express()

app.use(express.json())
app.use(express.urlencoded())
app.use(express.static("public"))


app.post('/country', function(req, res){
    let country = req.body.countryInput
	findPopulationInCountry(country, (populationData) => {
        res.send(populationData);
    })
	
});

app.listen(3000, () => {
    console.log("Listening on port 3000")
})


