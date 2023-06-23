import { pi_uint8 as pi, pi_bases } from '/settings/default_text.js'; 

window.addEventListener('DOMContentLoaded', () => {

    // CURSORS

    let cursor = 0; 
    let cursors = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; 
    let running_totals = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; 
    
    const pi_bases_keys = Object.keys(pi_bases); 
    
    for(let i = 1; i < 11; ++i) {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.classList.add('circle'); 
        svg.setAttribute('base', `${ i === 1 ? 'unary' : pi_bases_keys[i - 2] }`); 
        svg.setAttribute('value', `${ i % 10 }`)
        svg.setAttribute('viewBox', '-1 -1 2 2');
        i !== 10 ? document.querySelector('.input').appendChild(svg) : document.querySelector('.input').prepend(svg); 

        const increment = 2 / i; 
        for(let j = 0, val = 0; j < 2; j += increment, ++val) {

            let arc; 
            if(i === 1) {
                arc = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); 
                arc.setAttribute('cx', '0'); 
                arc.setAttribute('cy', '0'); 
                arc.setAttribute('r', '1'); 
            } else {
                arc = document.createElementNS('http://www.w3.org/2000/svg', 'path'); 
                arc.setAttribute('d', `M 0 0, L ${ Math.cos(j * Math.PI) } ${ Math.sin(j * Math.PI) }, A 1 1 0 0 1 ${ Math.cos((j + increment) * Math.PI) } ${ Math.sin((j + increment) * Math.PI) }, Z`); 
            }
            arc.classList.add('arc'); 
            arc.setAttribute('stroke', '#000'); 
            arc.setAttribute('stroke-width', '0.02'); 
            arc.setAttribute('fill', '#fff'); 
            arc.setAttribute('circle', `${ i % 10 }`)
            arc.setAttribute('value', `${ val % i}`)

            // FOR RUNNING TOTAL SELECTED
            arc.setAttribute('selected', val % i !== 0 ? 'false' : 'true'); 
            
            svg.appendChild(arc); 
        }

        // ANSWER

        const ans = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); 
        ans.setAttribute('cx', '0'); 
        ans.setAttribute('cy', '0'); 
        ans.setAttribute('r', '0.25'); 
        ans.setAttribute('fill', '#000'); 
        svg.appendChild(ans); 

        const ansText = document.createElementNS('http://www.w3.org/2000/svg', 'text'); 
        if(i !== 1) {
            ansText.setAttribute('x', '-0.1'); 
            ansText.setAttribute('y', '0.1'); 
            ansText.classList.add('ans-text'); 
            ansText.textContent = pi_bases[svg.getAttribute('base')][cursors[+svg.getAttribute('value')]]; 
            svg.appendChild(ansText); 
        }
        

        const handleSubmit = touchstart => {
            const target = touchstart.target; 
            const circleVal = target.getAttribute('circle'); 
            const arcVal = target.getAttribute('value'); 
            
            if(circleVal && arcVal && +circleVal === pi[cursor]) {
                const advance = () => {
                    document.querySelector('.cursor').innerText = ++cursor; 
                    const hint = document.querySelector('.hint'); 
                }


                if(circleVal === '1') {
                    advance(); 
                } else {
                    const desiderata = (running_totals[+circleVal] + pi_bases[svg.getAttribute('base')][cursors[+circleVal]]) % i; 
                    // console.log(`DESIDERATA: ${ circleVal} / ${desiderata}`); 

                    if(+arcVal === desiderata) {
                        running_totals[+circleVal] = desiderata; 
                        ++cursors[+circleVal]; 
                        cursors[circleVal] %= 100; 
                        ansText.textContent = pi_bases[svg.getAttribute('base')][cursors[+svg.getAttribute('value')]]; 
                        svg.querySelectorAll('[selected="true"]').forEach(sel => {
                            sel.setAttribute('selected', 'false'); 
                        }); 
                        target.setAttribute('selected', 'true'); 
                        advance(); 
                    }
                }
            }

            console.log(`VAL: ${ circleVal } ${ arcVal }`); 
        }; 
        svg.addEventListener('touchstart', handleSubmit); 
        svg.addEventListener('mousedown', handleSubmit); 
    }
}); 