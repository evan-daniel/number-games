import { mod_index_mult as pi, mod_index_mult_cursor as seed } from '/settings/hard-coded.js'; 
import { pi_uint8 as pi_digits } from '/settings/default_text.js'; 

window.addEventListener('DOMContentLoaded', () => {

    let abacus_bounds; 
    const resize = () => {
        abacus_bounds = document.querySelector('.abacus').getBoundingClientRect(); 
    }
    window.addEventListener('resize', resize); 
    resize(); 
    
    let mousedown = -1; 
    let count = 0; 

    const w = (window.innerHeight - document.querySelector('.count').getBoundingClientRect().height) * 0.01; 
    document.documentElement.style.setProperty('--gh',  `${w}px`); 

    const abacus_values = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; 
    let lastTouched = 0; 

    document.querySelectorAll('.column').forEach((abacus, abacusIndex) => {

        const beads = abacus.querySelectorAll('.column > svg'); 
        const bead_tops = []; 

        beads.forEach((bead, beadIndex) => {
            let drag_start = 0; 
            let bead_start = bead_tops[beadIndex]; 
            const bead_height = 0.14; 
        
            bead.addEventListener('mousedown', beadMousedown => {
                if(mousedown !== -1) {
                    return; 
                }
                mousedown = beadIndex; 

                drag_start = beadMousedown.clientX; 
                bead_start = bead_tops[beadIndex]; 
            }); 
            
            bead.addEventListener('touchstart', beadTouchstart => {
                beadTouchstart.preventDefault(); 
                drag_start = beadTouchstart.targetTouches[0].clientX; 
                bead_start = bead_tops[beadIndex]; 
            }); 

            const move = y => {
                const delta = (drag_start - y); 
                const top = bead_start + delta / abacus_bounds.width; 
                bead_tops[beadIndex] = top; 
                // console.log('MOVY', beadIndex, bead_start, drag_start, bead_tops[beadIndex])
        
                if(!beadIndex) {
                    bead_tops[0] = Math.max(0, Math.min(bead_height, bead_tops[0])); 
                    beads[0].style.right = `${bead_tops[0] * 100}%`; 
                    return; 
                }
                
                for(let i = 0; i < 5; i++) {
                    let index = delta < 0 ? beads.length - 1 - i : i; 
                    if(beadIndex && index === 0) continue; 
                    
                    if(1 < index && delta < 0) bead_tops[index - 1] = Math.min(bead_tops[index - 1], bead_tops[index] - bead_height); 
                    else if(index < 4) bead_tops[index + 1] = Math.max(bead_tops[index] + bead_height, bead_tops[index + 1]); 
        
                    if(index === 0) bead_tops[index] = Math.max(0, Math.min(bead_height, bead_tops[index])); 
                    else bead_tops[index] = Math.max(0.02 + bead_height * (index + 1), Math.min(0.02 + bead_height * (index + 2), bead_tops[index])); 
                    
                    beads[index].style.right = `${bead_tops[index] * 100}%`; 
                }
            }; 
            bead.addEventListener('mousemove', beadMousemove => {
                if(typeof bead_start !== 'number' || mousedown !== beadIndex) {
                    return; 
                }
                
                beadMousemove.preventDefault(); 
                move(beadMousemove.clientX); 
            }); 
            bead.addEventListener('touchmove', beadTouchmove => {
                beadTouchmove.preventDefault(); 
                move(beadTouchmove.targetTouches[0].clientX); 
            }); 

        }); 

        const lift = () => {
            let number = 0; 
            if(0.07 < bead_tops[0]) number = 5; 
            if(bead_tops[1] < 0.37) number += 1; 
            if(bead_tops[2] < 0.51) number += 1; 
            if(bead_tops[3] < 0.65) number += 1; 
            if(bead_tops[4] < 0.79) number += 1; 
            
            abacus_values[abacusIndex] = number; 
            lastTouched = count ? (abacusIndex - seed[count - 1]) : abacusIndex; 
            if(lastTouched < 0) {
                lastTouched += 10; 
            }
        }; 
        abacus.addEventListener('mouseup', () => {
            lift(); 
        }); 
        abacus.addEventListener('touchend', documentTouchend => {
            if(documentTouchend.targetTouches.length === 0) {
                lift(); 
            }
        }); 

        const reset = () => {
            const value = !count ? '1' : +pi[count - 1].toString().padStart(10, '0').charAt(abacusIndex); 
            abacus_values[abacusIndex] = value; 
            
            bead_tops[0] = 0; 
            bead_tops[1] = 0.44; 
            bead_tops[2] = 0.58; 
            bead_tops[3] = 0.72; 
            bead_tops[4] = 0.86; 

            const bh = 0.14; 
            if(4 < value) {
                bead_tops[0] += bh; 
            }
            
            for(let i = 1; i < 5; ++i) {
                if(i - 1 < value % 5) {
                    bead_tops[i] -= bh; 
                }
            }
            
            beads.forEach((bead, index) => {
                bead.style.right = `${bead_tops[index] * 100}%`; 
            }); 
        }; 
        reset(); 
        document.querySelector('.last-correct').addEventListener('click', reset); 
        document.querySelector('#cursor-picker').addEventListener('input', reset); 

    }); 

    // RESET INTERFACE CONVENIENCE
    const resetInterface = () => {
        document.querySelector('.cursor').innerText = count; 
        document.querySelector('.abacus').querySelectorAll('.selected').forEach(selected => selected.classList.remove('selected')); 
        document.querySelectorAll('.column')[count ? 9 - seed[count - 1] : 0].classList.add('selected'); 

        console.log(`ANSWER: ${pi[count]}`)
    }

    
    // MAIN CHECK INPUT
    console.log(pi[count]); 
    const check_input = interaction_end => { 
        if(interaction_end.target.classList.contains('last-correct')) {
            return; 
        }
        
        let input = `${abacus_values[0]}${abacus_values[1]}${abacus_values[2]}${abacus_values[3]}${abacus_values[4]}${abacus_values[5]}${abacus_values[6]}${abacus_values[7]}${abacus_values[8]}${abacus_values[9]}`; 
        console.log(`INPUT: ${input}`); 
        if(input === pi[count].toString().padStart(10, '0')) {
            if(count && pi[count - 1] === pi[count]) {
                if(9 - pi_digits[count] !== lastTouched) {
                    return; 
                }
            }
            
            ++count; 
            resetInterface(); 
        }
    }; 
    document.addEventListener('touchend', check_input); 
    document.addEventListener('mouseup', check_input); 

    // CURSOR PICKER
    const picker = document.querySelector('#cursor-picker'); 
    picker.addEventListener('input', input => {
        count = picker.value; 
        resetInterface(); 
    }, true); 

    document.addEventListener('mouseup', () => mousedown = -1, true); 
}); 