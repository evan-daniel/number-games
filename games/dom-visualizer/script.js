let forceBackendUrl = false; 
let words; 
let timeCounter = 0, staticTimeCounter = 0, winsCounter = 0; 
let stopwatchEnabled = true; 
const elements = []; 
let safeAttr = ['id', 'class']; 

window.addEventListener('DOMContentLoaded', async () => {
    words = await loadWords(); 
    document.querySelector('template').content.querySelectorAll('*').forEach(element => elements.push(element)); 
    
    populateProblemDom(); 
    document.querySelector('interface').focus(); 
    document.querySelector('interface').addEventListener('keyup', evaluateInput); 
    document.addEventListener('keydown', documentKeydown => documentKeydown.key === 'Tab' ? documentKeydown.preventDefault() : ''); 
    window.setInterval(stopwatch, 1000); 
    document.querySelector('play-again').addEventListener('click', populateNewGame); 
}); 

const loadWords = () => new Promise(resolve => {
    const xhr = new XMLHttpRequest(); 
    xhr.open('GET', 'words.json'); 
    xhr.responseType = 'json'; 
    xhr.addEventListener('load', () => resolve(xhr.response)); 
    xhr.send(); 
}); 

const populateProblemDom = () => {
    const problemElement = document.querySelector('problem'); 
    problemElement.innerHTML = ''; 
    let lastChild = problemElement; 
    let descendantElement = problemElement; 
    const wordsSubset = [];
    safeAttr = ['id', 'class']; 
    for(let i = 0; i < 3; i++) wordsSubset.push(words.data[Math.floor(Math.random() * 2500)]);
    for(let i = 0; i < Math.floor(Math.random() * 8) + 2; i++) {
        let child = document.createElement(elements[Math.floor(Math.random() * elements.length)].tagName); 
        if(Math.random() < 0.16) child.id = words.data[Math.floor(Math.random() * 2500)]; 
        while(Math.random() < 0.33) {
            const newClass = wordsSubset[Math.floor(Math.random() * wordsSubset.length)]; 
            if(!(child.className.indexOf(newClass) + 1)) child.className += `${child.className ? ' ' : ''}${newClass}`; 
        }
        while(Math.random() < 0.16) {
            for(let i = 0; i < 2; i++) safeAttr.push(words.data[Math.floor(Math.random() * 2500)]); 
            child.setAttribute(safeAttr[safeAttr.length - 1], safeAttr[safeAttr.length - 2]); 
        }
        
        const nonParentingElements = ['P', 'H4', 'IMG']; 
        (Math.random() < 0.33 ? descendantElement : Math.random() < 0.5 && lastChild !== problemElement ? lastChild.parentElement : lastChild).appendChild(child); 
        lastChild = child; 
        while(child !== problemElement && Math.random() < 0.75) child = child.parentElement; 
        descendantElement = child; 
    }
    explicitDom('problem'); 
}; 

const explicitDom = parentElementString => {
    document.querySelector(parentElementString).querySelectorAll(`*:not(head)`).forEach(element => {
        let indent = 0; 
        let el = element; 
        while (el.tagName !== parentElementString.toUpperCase()) {
            indent++; 
            el = el.parentElement; 
        }

        const attr = element.attributes; 
        const attrMap = {}; 
        for(let key in attr) {
            const nodeName = attr[key].nodeName; 
            if(nodeName !== 'id' && nodeName !== 'class' && nodeName !== undefined) {
                attrMap[nodeName] = attr[key].nodeValue; 
            }
        }
        let attrString = ''; 
        for(let key in attrMap) {
            attrString = `[${key}="${attrMap[key]}"]` + attrString; 
        }

        element.prepend(` ${element.tagName}${attrString}${element.id ? `#${element.id}` : ''}${element.className ? `.${element.className.replace(/\s/g, '.')}` : ''}`); 
        const outlineFrame = document.createElement('outline-frame'); 
        do {
            outlineFrame.innerText += ' │'; 
        } while(indent--); 
        element.prepend(outlineFrame); 
    }); 
}; 

const evaluateInput = interfaceKeydown => {
    if(interfaceKeydown.keyCode === 9) {
        const range = window.getSelection().getRangeAt(0); 
        const spaces = document.createTextNode('\u00a0\u00a0\u00a0\u00a0'); 
        range.insertNode(spaces); 
        range.setStartAfter(spaces); 
        range.setEndAfter(spaces); 
    }
    let html = document.querySelector('interface').innerText.replace(/\u00a0|\r*\n*/g, ''); 
    html.replace('"', ''); html.replace('"', ''); 
    document.querySelector('preview').innerHTML = DOMPurify.sanitize(html, {ALLOWED_ATTR: safeAttr}); 
    explicitDom('preview'); 
    if(document.querySelector('problem').textContent.replace(/\s/g, '') !== document.querySelector('preview').textContent.replace(/\s/g, '')) return; 
    stopwatchEnabled = false; 
    document.querySelector('interface').setAttribute('contenteditable', 'false'); 
    winsCounter++; 
    document.querySelector('wins > span').innerText = winsCounter; 
    document.querySelector('average-time span').innerText = (winsCounter * 60 / staticTimeCounter).toFixed(2); 
    const score = (Math.pow(winsCounter, 2) * 60 / staticTimeCounter).toFixed(2); 
    document.querySelector('score > span').innerText = score; 
    document.querySelector('problem-dom').className = 'success'; 
    localStorage.setItem('domVisualizerWins', +localStorage.getItem('domVisualizerWins') + 1); 
    if(!localStorage.getItem('domVisualizerHighScore') || +localStorage.getItem('domVisualizerHighScore') < +score) {
        localStorage.setItem('domVisualizerHighScore', score); 
    }
    sendWin(); 
}; 

const populateNewGame = () => {
    stopwatchEnabled = true; 
    timeCounter = 0; 
    document.querySelector('interface').setAttribute('contenteditable', 'true'); 
    document.querySelector('interface').innerText = ''; 
    populateProblemDom(); 
    document.querySelector('preview').innerHTML = ''; 
    document.querySelector('problem-dom').className = ''; 
}; 

const stopwatch = () => {
    if(stopwatchEnabled) {
        staticTimeCounter++; 
        document.querySelector('time span').innerText = timeCounter++
    }
}; 

const sendWin = () => {
    const message = {
        Name: localStorage.getItem("name"), 
        Game: "dom_visualizer"
    }; 
    if(!message.Name) return;
    
    const xhr = new XMLHttpRequest(); 
    xhr.open('POST', !forceBackendUrl && window.location.hostname === 'localhost' ? 'http://localhost:8080/web-dev-games' : 'https://web-dev-games-mr44t3zfia-uc.a.run.app/web-dev-games'); 
    xhr.setRequestHeader('Content-Type', 'application/json'); 
    xhr.send(JSON.stringify(message)); 

    xhr.onreadystatechange = () => {
        if(xhr.readyState === 4 && xhr.status === 200) {
            const response = JSON.parse(xhr.responseText); 
            console.log('XHR response: ', response); 
        }
    }; 
}; 