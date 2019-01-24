// Taken from https://stackoverflow.com/questions/31626852/how-to-add-konami-code-in-a-website-based-on-html
// Methodology provided by w.stoettinger (https://stackoverflow.com/users/5095697/w-stoettinger)

$(function(){ 
    // a key map of allowed keys
      // on your keyboard, keys pressed return a specific numerical value
      // these indicate which key presses will be tracked
    var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    65: 'a',
    66: 'b'
  };

  // the 'official' Konami Code sequence
    // the keys the user presses are compared to this sequence 
  var konamiCode = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b', 'a'];

  // a variable to remember the 'position' the user has reached so far.
    // used to track how far the user is in the konami code sequence
  var konamiCodePosition = 0;

  // add keydown event listener
  document.addEventListener('keydown', function (e) {
    // get the value of the key code from the key map
    var key = allowedKeys[e.keyCode];
    // get the value of the required key from the Konami Code
    var requiredKey = konamiCode[konamiCodePosition];
    
    // compare the pressed key with the required key from the Konami Code
    if (key == requiredKey) {
      
      // if the pressed key is a match, 
        // move to the next key in the konami code sequence
      konamiCodePosition++;
      
      // if the last key is reached successfully, activates the activateCheats function
      if (konamiCodePosition == konamiCode.length) {
        activateCheats();
        // reset the position of the Konami Code
        konamiCodePosition = 0;
      }
    } else {
      // reset the position of the Konami Code
      konamiCodePosition = 0;
    }
  }); 

  function activateCheats() {
    var audio = new Audio('assets/konamiSecret.mp3');
    audio.play(); 
  }
})