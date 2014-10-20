//Start with Object
var crimeApp = {};

//Creates Array of number of answers for each choice 
crimeApp.answerTally = function() {
   var answerA = $('.ansA:checked').length,
   answerB = $('.ansB:checked').length,
   answerC = $('.ansC:checked').length,
   answerD = $('.ansD:checked').length,
   answerE = $('.ansE:checked').length,
   answerArray = [];

   answerArray.push(answerA);
   answerArray.push(answerB);
   answerArray.push(answerC);
   answerArray.push(answerD);
   answerArray.push(answerE);

   console.log(answerArray);
   var biggest = Math.max.apply(null, answerArray);
   console.log(biggest);

   if (answerArray[0] === biggest) {
   	crimeApp.displayCrimes('A Hit and Run');
   } else if (answerArray[1] === biggest) {
   	crimeApp.displayCrimes('Selling Drug Paraphernalia');
   } else if (answerArray[2] === biggest) {
   	crimeApp.displayCrimes('Driving under the influence');
   } else if (answerArray[3] === biggest) {
   	crimeApp.displayCrimes('Drug Possession');
   } else if (answerArray[4] === biggest) {
   	crimeApp.displayCrimes('Fighting the Paparazzi');
   }
   

   // console.log('answer A: ' + answerA);
   // console.log('answer B: ' + answerB);
   // console.log('answer C: ' + answerC);
   // console.log('answer D: ' + answerD);
   // console.log('answer E: ' + answerE);
};


//Unique api key 
crimeApp.celebContainer = $('#celeb');

//Crime Array
crimeApp.crimeList = {
	'A Hit and Run': [],
	'Selling Drug Paraphernalia': [],
	'Driving under the influence': [],
	'Drug Possession': [],
	'Fighting the Paparazzi': []
};

//Create init function
crimeApp.init = function(){
	crimeApp.getCrimes();
	
	$('.submit').on('click', function(){
		// crimeApp.celebContainer.empty();
		crimeApp.answerTally();
	});
};

//AJAX Request for celeb crimes
crimeApp.getCrimes = function(offense){ 
	$.ajax({
		url: 'https://www.googleapis.com/freebase/v1/mqlread/?key=AIzaSyAO9FHrP7e7_S8Vzm-S2_2tsaD1rFlfTR8&query=[{ "type": "/celebrities/legal_entanglement", "/celebrities/legal_entanglement/celebrity":[],"/celebrities/legal_entanglement/offense":[]}]&lang=/lang/en', 
		type: 'GET',
		dataType: 'jsonp', 
		success: function(response){
			// crimeApp.getGifs(response.result);
			crimeApp.sortCrimes(response.result);
		}
	});
};

//AJAX Request for celeb gifs
crimeApp.getGifs = function(celebrity){ 
	$.ajax({
		url: 'http://api.giphy.com/v1/gifs/search', 
		type: 'GET',
		dataType: 'json',
		data: {
			q: celebrity, 
			api_key: 'dc6zaTOxFJmzC',
			limit: 1
		}, 
		success: function(response){
			
			console.log(response);
			deferred.resolve(response.data[0].images.downsized.url);
		}
	});
};

crimeApp.sortCrimes = function(celebrities) {
	$.each(celebrities, function(i, celebrity){
		// console.log(crime);
		var offenses = celebrity['/celebrities/legal_entanglement/offense'];
		var name = celebrity['/celebrities/legal_entanglement/celebrity'][0];
		if(offenses.length) { 
			if(offenses[0] === 'Hit and run'){
				crimeApp.crimeList['A Hit and Run'].push(name);
			} else if (offenses[0] === 'Selling Drug Paraphernalia'){
				crimeApp.crimeList['Selling Drug Paraphernalia'].push(name);
			} else if (offenses[0] === 'Driving under the influence'){
				crimeApp.crimeList['Driving under the influence'].push(name);
			} else if (offenses[0] === 'Drug possession'){
				crimeApp.crimeList['Drug Possession'].push(name);
			} else if (offenses[0] === 'Arrested for being in a fight with paparazzis in front of a restaurant.'){
				crimeApp.crimeList['Fighting the Paparazzi'].push(name);
			} 
		}
	});
};
var deferred;
//Displaying Crimes in Browser
crimeApp.displayCrimes = function(crime){ 
	var celebs = crimeApp.crimeList[crime];
	var random = Math.floor(Math.random()*(celebs.length));
	var theChosenCeleb = celebs[random];
	deferred = $.Deferred();
	deferred.then(function(url) {
		var image = $('<img>').attr('src', url).addClass('gif');
		crimeApp.celebContainer.find('.crime').append(image);
	})
	crimeApp.getGifs(theChosenCeleb);
	var name = $('<h2>').text(theChosenCeleb).addClass('celeb-name'); 
	var offense = $('<h2>').text(crime).addClass('celeb-crime');
	var snap = $('<h3>').text('Ohhh snap! You just got caught in:');
	var string = $('<h2>').html('<span class=celeb-crime>' + crime + '</span>' + ' with ' + '<span class=celeb-name>' + theChosenCeleb + '</span>');
	var crime = $('<div>').addClass('crime').append(snap, string);
	crimeApp.celebContainer.append(crime);  //Cached Selector
};



//jQuery Doc Ready
$(function(){
	crimeApp.init();
	$('.bxslider').bxSlider();

	//changing the answer bg on click
	$('.answer').on('click', function(){
		$(this).addClass('blue');
	});

	// smooth-scroll
	$('a.play').smoothScroll({
		offset: 60
	});
	

});