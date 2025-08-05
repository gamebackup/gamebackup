function openGame(gameName) {
  const newWindow = window.open('about:blank', '_blank');
  
  const gameUrl = `/games/${gameName}/index.html`;

  fetch(gameUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Could not load game at path: ${gameUrl}`);
      }
      return response.text();
    })
    .then(htmlContent => {
      newWindow.document.open();
      newWindow.document.write(htmlContent);
      newWindow.document.close();
    })
    .catch(error => {
      console.error('Error loading game:', error);
      newWindow.close();
      alert(`Error loading game: ${gameName}. Check the console for details.`);
    });
}
