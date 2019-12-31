function retrieveDataFromApi(){    
    let country = $("#CountryInput").val()
    $.ajax({
        type: 'POST',
        data: JSON.stringify({ countryInput: country }),
        contentType: 'application/json',
        url: '/country',						
        success: function(data) {
            updatePopulation(data)
        }
    });
}
