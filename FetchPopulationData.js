const {CountryApi} = require('country-api')

//Stole from StackOverflow -- used to map numbers from 0 - largest country population to 0 - 200
const scale = (num, in_min, in_max, out_min, out_max) => {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
function findLargestCountry(data){
    let largest = data[0]
    for(let i = 0; i < data.length; i++){
        if(largest.population < data[i].population)
            largest = data[i]
    }
    return largest
}

const countryFinder = new CountryApi()
const findPopulationInCountry = (country = "", callback) => {
    countryFinder.byNamePrefix(country)
    .then((data) => {
        let largestCountry = findLargestCountry(data)
        let scaled = (scale(largestCountry.population, 0, 1377422166, 0, 200))
        callback({ 
            name: largestCountry.name,
            population: largestCountry.population, 
            scaled: scaled 
        })
    })
}

module.exports = {findPopulationInCountry}
 
