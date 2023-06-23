import { pi_uint8 as pi_digits } from '/settings/default_text.js'; 
import audio from '/lib/audio.js'; 

window.addEventListener('DOMContentLoaded', DOMContentLoaded => {
    
    document.querySelector('#numpad-container').style.height = `${window.innerHeight}px`; 
    audio.init(audio.scales.BASETEN_110); 
    
    let pi_cursor_left = 0, pi_cursor_right = 0; 
    const set_pi_cursors = side => {
        let feedback = document.querySelector(`#feedback-${side}`); 
        if(!feedback) {
            feedback = document.createElement('div'); 
            feedback.classList.add('feedback'); 
            feedback.id = `feedback-${side}`; 
            document.querySelector(`#numpad-${side} .numpad-button[value=a]`).appendChild(feedback); 
        }
        feedback.innerText = side === 'left' ? pi_cursor_left : pi_cursor_right; 
    }; 
    set_pi_cursors('left'); 
    set_pi_cursors('right'); 
    const handle_numpad_touchstart = (touchstart, side) => {
        if(touchstart.target.classList.contains('numpad-num')) {
            if(+touchstart.target.getAttribute('value') === (side === 'left' ? pi_digits[pi_cursor_left] : pi_digits[pi_cursor_right])) {
                side === 'left' ? ++pi_cursor_left : ++pi_cursor_right; 
                set_pi_cursors(side); 
                touchstart.target.style.backgroundColor = `#00F`; 
                let cardinal = +touchstart.target.getAttribute('value'); 
                if(typeof cardinal === 'number' && -1 < cardinal < 10) {
                    if(side === 'right') {
                        cardinal += 10; 
                    }
                    // audio.start_note(cardinal, 32); 
                }
            } else {
                touchstart.target.style.backgroundColor = `#F00`; 
            }
        } 
    }; 
    
    const handle_numpad_touchend = (touchend, side) => {
        if(touchend.target.classList.contains(`numpad-num`)) {
            let cardinal = +touchend.target.getAttribute('value'); 
            if(typeof cardinal === 'number' && -1 < cardinal < 10) {
                if(side === 'right') {
                    cardinal += 10; 
                }
                audio.end_note(cardinal); 
            }
            touchend.target.style.backgroundColor = ``; 
        }
    }; 
    
    document.querySelector('#numpad-left').addEventListener('touchstart', touchstart => handle_numpad_touchstart(touchstart, 'left')); 
    document.querySelector('#numpad-right').addEventListener('touchstart', touchstart => handle_numpad_touchstart(touchstart, 'right')); 
    document.querySelector(`#numpad-left`).addEventListener('touchend', touchend => handle_numpad_touchend(touchend, 'left')); 
    document.querySelector(`#numpad-right`).addEventListener('touchend', touchend => handle_numpad_touchend(touchend, 'right')); 

    document.querySelector('#numpad-left').addEventListener('mousedown', touchstart => handle_numpad_touchstart(touchstart, 'left')); 
    document.querySelector('#numpad-right').addEventListener('mousedown', touchstart => handle_numpad_touchstart(touchstart, 'right')); 
    document.querySelector(`#numpad-left`).addEventListener('mouseup', touchend => handle_numpad_touchend(touchend, 'left')); 
    document.querySelector(`#numpad-right`).addEventListener('mouseup', touchend => handle_numpad_touchend(touchend, 'right')); 
}); 