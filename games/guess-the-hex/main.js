const forceBackendUrl = false; 
const hexCharacters = '0123456789abcdef'; 

window.addEventListener('DOMContentLoaded', dOMContentLoaded => {
    document.querySelectorAll('enter-color > *').forEach((enterColorChild, rGBIndex) => {
        for(let i = 0; i < 16; i++) {
            const index = hexCharacters.charAt(i); 
            const colorButton = document.createElement('div'); 
            colorButton.style.backgroundColor = `#${['f00', '0f0', '00f'][rGBIndex].replace('f', hexCharacters.charAt(i))}`; 
            colorButton.innerHTML = index; 
            enterColorChild.append(colorButton); 
        }; 
    }); 
    
    let problemColor = newProblemColor(); 
    document.querySelector('accuracy > span').innerText = colorAccuracyPercent(problemColor, '000'); 
    
    let clicksCounter = 0; 
    let staticClicksCounter = 0; 
    let winsCounter = 0; 

    document.querySelector('enter-color').addEventListener('click', enterColorClick => {
        if(document.querySelector('problem-color').className == 'success') return; 
        const enterColorValue = enterColorClick.target.innerText; 
        document.querySelector('preview-color-' + enterColorClick.target.parentElement.tagName).innerText = enterColorValue; 
        
        enterColorClick.target.parentElement.querySelectorAll('.checked').forEach(checked => checked.className = ''); 
        enterColorClick.target.className = 'checked'; 
        document.querySelector('clicks > span').innerText = ++clicksCounter; 
        staticClicksCounter++; 
        document.querySelector('average-clicks > span').innerText = (staticClicksCounter/winsCounter).toFixed(2); 
        
        let previewColorHexValue = ''; 
        document.querySelectorAll('preview-color > *').forEach(previewColorChild => previewColorHexValue += previewColorChild.innerText ? previewColorChild.innerText : '0'); 
        document.querySelector('preview-color').style.backgroundColor = `#${previewColorHexValue}`; 

        const colorAccuracy = colorAccuracyPercent(problemColor, previewColorHexValue); 
        document.querySelector('accuracy span').innerText = colorAccuracy; 

        if(colorAccuracy === '100.00%') {
            document.querySelectorAll('problem-color > *').forEach((problemColorChild, problemColorIndex) => problemColorChild.innerText = problemColor.charAt(problemColorIndex)); 
            document.querySelector('problem-color').className = 'success'; 
            document.querySelector('wins > span').innerText = ++winsCounter; 
            document.querySelector('average-clicks > span').innerText = (staticClicksCounter/winsCounter).toFixed(2); 
            const score = Math.floor(Math.pow(winsCounter, 2)/staticClicksCounter * 100); 
            document.querySelector('wins-per-click > span').innerText = score; 
            localStorage.setItem('guessTheHexWins', +localStorage.getItem('guessTheHexWins') + 1); 
            if(!localStorage.getItem('guessTheHexHighScore') || +localStorage.getItem('guessTheHexHighScore') < +score) {
                localStorage.setItem('guessTheHexHighScore', score); 
            }
            sendWin(); 
        } 
    }); 

    document.querySelector('play-again').addEventListener('click', () => {
        problemColor = newProblemColor(); 
        document.querySelector('average-clicks > span').innerText = (staticClicksCounter/winsCounter).toFixed(2); 
        document.querySelector('problem-color').className = ''; 
        clicksCounter = 0; 
        document.querySelector('clicks > span').innerText = clicksCounter; 
        let previewColorHexValue = ''; 
        document.querySelectorAll('preview-color > *').forEach(previewColorChild => previewColorHexValue += previewColorChild.innerText ? previewColorChild.innerText : '0'); 
        document.querySelector('accuracy > span').innerText = colorAccuracyPercent(problemColor, previewColorHexValue); 
        document.querySelectorAll('problem-color > *').forEach(problemColorChild => problemColorChild.innerText = '?'); 
    }); 
}); 

const colorAccuracyPercent = (c1, c2) => {
    let diff = 0; 
    for(let i = 0; i < c1.length; i++) {
        diff += Math.abs(parseInt(c1.charAt(i), 16) - parseInt(c2.charAt(i), 16)); 
    }
    return ((1 - diff/48) * 100).toFixed(2) + '%'; 
}; 

const newProblemColor = () => {
    let problemColor = ''; 
    for(let i = 0; i < 3; i++) problemColor += hexCharacters.charAt(Math.floor(Math.random()*16)); 
    document.querySelector('problem-color').style.backgroundColor = `#${problemColor}`; 
    return problemColor; 
}; 

const sendWin = () => {
    const message = {
        Name: localStorage.getItem("name"), 
        Game: "guess_the_hex"
    }; 
    if(!message.Name) return;
    
    const xhr = new XMLHttpRequest(); 
    xhr.open('POST', !forceBackendUrl && window.location.hostname === 'localhost' ? 'http://localhost:8080/web-dev-games' : 'https://web-dev-games-mr44t3zfia-uc.a.run.app/web-dev-games'); 
    xhr.setRequestHeader('Content-Type', 'application/json'); 
    xhr.send(JSON.stringify(message)); 

    xhr.onreadystatechange = () => {
        if(xhr.readyState === 4 && xhr.status === 200) {
            const response = JSON.parse(xhr.responseText); 
            console.log('XHR response: ', response.Status); 
        }
    }; 
}; 