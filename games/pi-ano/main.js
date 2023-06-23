import { pi_string as pi } from '/settings/default_text.js'; 
import audio from '/lib/audio.js'; 

window.addEventListener('DOMContentLoaded', DOMContentLoaded => {

    let cursor = 0; 
    let Audio_Play = false; 
    // Audio_Play = true; 

    for(let i = 0; i < 12; i++) {
        const pianoKey = document.createElement('div'); 
        pianoKey.className = 'key'; 
        pianoKey.classList.add([1, 3, 5, 8, 10].indexOf(i) === -1 ? 'white' : 'black'); 
        const value = [0, 1, 2, 3, 4, 5, 7, 8, 9, 10].indexOf(i).toString(); 
        console.log(`${i} : ${value}`); 
        pianoKey.setAttribute('value', value); 
        if(value !== '-1') {
            pianoKey.innerText = value; 
        }
        document.querySelector('.piano-container').prepend(pianoKey); 
    }

    // AUDIO SETUP

    audio.init(); 

    // π BOOKKEEPING 

    const assert = assertion => {
        if(
            typeof +assertion !== 'number' 
            || +assertion < 0 
            || 9 < +assertion 
        ) {
            return; 
        }

        const correct = assertion === pi.charAt(cursor); 

        if(correct) {
            document.querySelector('.cursor').innerText = ++cursor; 
            let hint = ''; 
            for(let i = cursor - 8; i < cursor + 9; ++i) {
                hint += i < 0 ? '&nbsp;' : pi.charAt(i); 
            }
            document.querySelector('.hint').innerHTML = hint; 

            if(Audio_Play) {
                audio.start_note(+assertion, 64); 
            }
        }

        const key = document.querySelector(`.key[value = '${assertion}']`); 
        if(key) {
            key.style.backgroundColor = correct ? '#00F' : '#F00'; 
        }
    }; 
    
    document.querySelector('.piano-container').addEventListener('touchstart', touchstart => assert(touchstart.target.getAttribute('value'))); 
    document.querySelector('.piano-container').addEventListener('mousedown', mousedown => assert(mousedown.target.getAttribute('value'))); 
    document.addEventListener('keydown', keydown => !keydown.repeat && assert(keydown.key)); 
    
    const deassert = assertion => {
        if(typeof +assertion !== 'number' || +assertion < 0 || 9 < +assertion) {
            return; 
        }

        const key = document.querySelector(`.key[value = '${assertion}']`); 
        if(key) {
            key.style.backgroundColor = ''; 
        }
        audio.end_note(+assertion); 
    }; 
    document.querySelector('.piano-container').addEventListener('touchend', touchend => deassert(touchend.target.getAttribute('value'))); 
    document.querySelector('.piano-container').addEventListener('mouseup', mouseup => deassert(mouseup.target.getAttribute('value'))); 
    document.addEventListener('keyup', keyup => deassert(keyup.key)); 

    // CHANGE AUDIO SCALE

    document.querySelector('.audio_select').addEventListener('change', change => {
        console.log(change.target.value); 
        audio.end_all_notes(); 
        Audio_Play = false; 
        switch(change.target.value) {
            case 'no audio': 
                break; 
            case 'standard': 
                audio.set_scale(audio.scales.STANDARD_110); 
                Audio_Play = true; 
                break; 
            case 'base-ten': 
                audio.set_scale(audio.scales.BASETEN_110); 
                Audio_Play = true; 
                break; 
            case 'mult': 
                audio.set_scale(audio.scales.STANDARD_110); 
                Audio_Play = true; 
                console.log('NON LOGARITHMIC')
                break; 
        }
    }); 
}); 