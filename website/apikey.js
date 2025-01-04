fetch('../apikey.txt')
  .then(response => response.text())
  .then(apiKey => {
    const script = document.getElementById('google-maps-script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
  })
  .catch(error => {
    console.error('Error loading API key:', error);
  });
