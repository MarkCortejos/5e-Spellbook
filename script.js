const spellApp = {
// Object to store important variables
	
};

spellApp.init = function(){
// On iniialize, get all spells
  spellApp.getAllSpells();
};

spellApp.getAllSpells = function() {
// GET request from api
$.ajax({
	url: 'https://api-beta.open5e.com/spells/',
	method: 'GET',
	dataType: 'json'
}).then(function(data) {
	// Only some spells are received, need to grab them from other URLs
	spellApp.spellsCount = data.count
	spellApp.allSpellsArray = data.results
	spellApp.acquireSpells(data)
	})
}

spellApp.acquireSpells = function(data) {
// Function that takes in the requested data, compares the count of spells 
 // already saved to our allSpellsArray to the total count of spells returned.
 // If we don't have all the spells yet, it fetches the rest of the spells 
 // from the necessary URLs until we have them all.
	if (spellApp.allSpellsArray.length >= spellApp.spellsCount === true) {
		return spellApp.allSpellsArray
	} else {
		fetch(data.next
		).then(function(response){
			return response.json()
		}).then(function(data){
			spellApp.allSpellsArray = spellApp.allSpellsArray.concat(data.results)
			spellApp.acquireSpells(data)
		})
	}
}

spellApp.filterByClass = function(data, arrayClassesChecked) {
// Function that filters the allSpellsArray by class
 // Takes in an array of classes, sorts them, and joins them into a string
 // in order to compare them to the dnd_class property
	const spellsByClass = []
	const strClassesChecked = arrayClassesChecked.sort().join(", ")
	data.forEach(function(spell){

		if (spell.dnd_class.toLowerCase().includes(strClassesChecked.toLowerCase()) === true) {
				spellsByClass.push(spell)
		}
	})
	return spellsByClass

}

spellApp.filterByLevel = function(data, arrayLevelsChecked) {
// Function that filters the allSpellsArray by level
 // Takes in an array of levels and compares them to the level property 
	const spellsByLevel = []

	data.forEach(function(spell){
		for (i=0; i < arrayLevelsChecked.length; i++) {
			if (spell.level.toLowerCase().includes(arrayLevelsChecked[i].toLowerCase()) === true) {
				spellsByLevel.push(spell)
			}
		}
	})
	return spellsByLevel
}
	

spellApp.displaySpellsList = function(data) {
// displays a list of spells with an array of objects as an argument
 // if the array is empty, outputs that nothing was found
	$(`#displayedSpells`).empty();
	if (data.length !== 0) {
		const spellListHtml = data.map(function(spell) {
			let spellListLine = `
							<p class='listedSpell' value=${spell.slug}>
								<span>${spell.name}</span>	
								<span>${spell.school}</span>	
								<span>${spell.page}</span>	
							</p>`;
			return spellListLine;
		}).join('');
		$(`#displayedSpells`).append(spellListHtml);		
	} else {
		const noSpellsHtml = `
							<p>Hmm... it seems the spellbook cannot find spells that match your chosen criteria, spellcaster...</p>
							<p>Perhaps change your spell criteria and try again?</p>`;
		$(`#displayedSpells`).append(noSpellsHtml)
		};
};

spellApp.displaySelectedSpell = function(selectedSpellSlug) {
// displays a specific spell clicked on from the spell list into the spell description window
	$(`#selectedSpell`).empty()
	const selectedSpell = spellApp.allSpellsArray.filter(function(data){
		return data.slug === selectedSpellSlug
	})[0]

	const selectedSpellHtml =  `
						<div class="spellDisplayed">
							<h3 class="descLine">
								<span>Spell: ${selectedSpell.name} (${selectedSpell.school})</span>	
								<span>Level: ${selectedSpell.level}</span>
							</h3>
							<p class="descLine">
								<span><u>Casting Time</u>: ${selectedSpell.casting_time}</span>	
								<span><u>Duration</u>: ${selectedSpell.duration}</span>	
								<span><u>Concentration</u>: ${selectedSpell.concentration}</span>	
							</p>
							<p class="descLine">
								<span><u>Range</u>: ${selectedSpell.range}</span>	
								<span><u>Components</u>: ${selectedSpell.components}</span>	
								<span><u>Ritual</u>: ${selectedSpell.ritual}</span>	
							</p>

							<p><u>Materials</u>: ${selectedSpell.material}</p>
							<p><u>Description</u>: ${selectedSpell.desc}</p>
							<p><u>Higher Level Casting</u>: ${selectedSpell.higher_level}</p>

							
							<p class="descLine">
								<span><u>Classes</u>: ${selectedSpell.dnd_class}</span>
								<span><u>Page</u>: ${selectedSpell.page}</span>
							</p>
						</div>`;
	$(`#selectedSpell`).append(selectedSpellHtml);
};


// doc ready begins
$(function(){
	spellApp.init();

	setTimeout(function() { 
		spellApp.displaySpellsList(spellApp.allSpellsArray); 
	}, 2000);

	$('#displayedSpells').on('click', '.listedSpell', function() {
		const selectedSpellSlug = $(this).attr('value')
		spellApp.displaySelectedSpell(selectedSpellSlug)
	});

	$('.searchForm').on('submit', function(event) {
		event.preventDefault();
		const searchedSpellList = []
		const searchedSpell = $('input[name=searchBar]').val().toLowerCase()

		spellApp.allSpellsArray.forEach(function(element) {
			if (element.name.toLowerCase().includes(searchedSpell) === true) {
				return searchedSpellList.push(element)
			}
		})

		spellApp.displaySpellsList(searchedSpellList)
	})

	$('.pickClass, .pickLevel').on('change', function (event) {
		event.preventDefault();

		const selectedClasses = []
		const selectedLevels = []

		$('.pickClass input[name=class]:checked').each(function(){
			selectedClasses.push($(this).val())
		})

		$('.pickLevel input[name=level]:checked').each(function(){
			selectedLevels.push($(this).val())
		})

		const spellsByClass = spellApp.filterByClass(spellApp.allSpellsArray,selectedClasses)
		const spellsByLevel = spellApp.filterByLevel(spellApp.allSpellsArray, selectedLevels)
	
		// combines and sorts filters
		const combinedFilters = spellsByLevel.concat(spellsByClass).sort(function(a,b) {
  			if (a.slug < b.slug) {
    			return -1
  			} else if (a.slug > b.slug) {
    			return 1
  			} else {  				
  				return 0;
  			}
		})
		

		// Couldn't figure out a way to remove duplicates
		 // Maybe go through the array index by index, 
		 // checking to see if array[i] === array[i+1] || array[i-1]
		 // then splicing array[i] if true?
		spellApp.displaySpellsList(combinedFilters)
		

	});

}); // doc ready end