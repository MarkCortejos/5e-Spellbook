$.ajax({
  url: 'https://api-beta.open5e.com/spells/',
  method: 'GET',
  dataType: 'json'
}).then(function(data) {
  console.log('It worked!: ', data);
});

