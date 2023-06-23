import { pi_uint8 as pi } from '/settings/default_text.js'; 

// GLOBALS 

const Limit = Math.pow(10, 10); 
let Cursor = 0; 
let mod_idx = 1, base_mod_idx = 0;  
let Selected = []; 
let Accepted = []; 
let mod_pi = 10; 
let base_mod_pi = mod_pi; 
let NumberTouched = 0; 
for(let i = 0; i < 10; ++i) {
    Accepted[i] = Selected[i] = 0; 
}

window.addEventListener('DOMContentLoaded', DOMContentLoaded => {
    
    const context = document.querySelector('canvas').getContext('2d'); 
    
    const resize = () => {
        const offset = context.canvas.getBoundingClientRect(); 
        w = h = offset.width * window.devicePixelRatio; 
        // context.canvas.style.width = `${w}px`; 
        // context.canvas.style.height = `${h}px`; 
        
        context.canvas.width = w; 
        context.canvas.height = h; 
        l = h; 
        
        CanvasXOffset = offset.x; 
        CanvasYOffset = offset.y; 
    }; 
    let CanvasXOffset, CanvasYOffset, w, h, l; 
    resize(); 
    window.addEventListener('resize', resize); 
    window.setInterval(resize, 2666); 
    
    const setFeedback = () => {
        document.querySelector('.cursor').innerText = Cursor; 

        let hint = ''; 
        for(let i = Cursor - 8; i < Cursor + 9; ++i) {
            hint += i < 0 ? '&nbsp;' : pi[i]; 
        }
        document.querySelector('.hint').innerHTML = hint; 
    }; 
    setFeedback(); 
    
    // MOUSE AND TOUCHES
    
    let Number = 0, Level = 0; 
    const Input = (x, y) => {

        // COORDINATES
        
        const touch_x = (x - CanvasXOffset) * window.devicePixelRatio; 
        const touch_y = (y - CanvasYOffset) * window.devicePixelRatio; 

        // GET THE ANGLE
        // BETWEEN 0 AND 1
        // STARTS AT 2 * π / 5 FROM 0 RADIANS
        
        let angle = -Math.atan2(touch_y - context.canvas.height / 2, touch_x - context.canvas.width / 2) / Math.PI / 2; 
        if(angle < 0) {
            angle += 1; 
        }
        angle = angle % 1; 
        Number = Math.floor(angle * 10); 
        NumberTouched = Number; 
        
        // GET THE LEVEL
        
        Level = Math.floor(Math.sqrt(Math.pow(touch_x - l / 2, 2) + Math.pow(touch_y - l / 2, 2)) / l * 20); 
        if(9 < Level) {
            Level = 9; 
            return; 
        }
        
        // SET THE SELECTION
        
        Selected[Number] = Level; 
        // console.log(`SELECTION: NUMBER: ${ Number } LEVEL: ${ Level }`, Selected); 
    }; 
    
    // EVENT LISTENERS
    
    context.canvas.addEventListener('touchstart', touchstart => Input(touchstart.touches[0].clientX, touchstart.touches[0].clientY)); 
    context.canvas.addEventListener('touchmove', touchmove => {
        touchmove.preventDefault(); 
        Input(touchmove.touches[0].clientX, touchmove.touches[0].clientY); 
    }); 
    context.canvas.addEventListener('mousedown', mousedown => Input(mousedown.clientX, mousedown.clientY)); 
    context.canvas.addEventListener('mousemove', mousemove => {
        mousemove.preventDefault(); 
        if(mousemove.buttons) {
            Input(mousemove.clientX, mousemove.clientY); 
        }
    })

    // TEST MECHANISM
    
    const Submit = () => {

        // GENERAL CHECK FOR ERRORS
        
        const entry = +[...Selected].reverse().join(''); 
        for(let i = 0; i < 10; ++i) {
            if(entry !== mod_pi) {
                console.log('SOMETHING WRONG'); 
                return; 
            }
        }

        // ERRONEOUS 

        if(base_mod_pi === mod_pi || mod_idx === 0) {
            if(NumberTouched !== mod_idx) {
                return; 
            }
        }

        // ADMIT

        Accepted = [...Selected]; 
        ++Cursor; 
        
        base_mod_idx = mod_idx; 
        mod_idx += pi[Cursor]; 
        mod_idx %= 10; 
        
        base_mod_pi = mod_pi; 
        const add = pi[Cursor] * mod_idx; 
        mod_pi += add * Math.pow(10, mod_idx); 
        
        let overflow = Math.floor(mod_pi / Limit); 
        mod_pi += overflow; 
        mod_pi %= Limit; 
        // console.log('CORRECT', mod_idx, mod_pi, Selected); 
        // console.log('NEXT', pi[Cursor], mod_idx, mod_pi); 

        setFeedback();

    }; 
    context.canvas.addEventListener('touchend', Submit); 
    context.canvas.addEventListener('mouseup', Submit); 
    
    // RENDER, ANIMATION

    const animate = timestamp => {

        // RESET
        
        context.lineWidth = 3; 
        context.clearRect(0, 0, context.canvas.width, context.canvas.height); 
        context.fillStyle = '#000'; 
        context.strokeStyle = '#000'; 
        context.fillRect(0, 0, context.canvas.width, context.canvas.height); 
        
        // TRANSFORMS
        
        context.translate(l / 2, l / 2); 
        // context.rotate(-2 * Math.PI / 5); 
        
        for(let Level = 9; -1 < Level; --Level) {
            const r = l / 2 * (Level + 1) / 10; 

            // CIRCLE

            context.fillStyle = `#${Level}${Level}${Level}`; 
            context.beginPath(); 
            context.arc(0, 0, r, 0, 2 * Math.PI); 
            context.fill(); 
            
            // ITERATE NUMBERS WITHIN CIRCLE
            
            context.save(); 
            const DrawArc = () => {
                context.beginPath(); 
                context.lineTo(r, 0); 
                context.arc(0, 0, r, 0, Math.PI / 5); 
                context.lineTo(0, 0); 
                context.fill(); 
            }; 
            for(let Number = 0; Number < 10; ++Number) {
                context.rotate(-Math.PI / 5); 
                
                const index_color_offset = Number !== base_mod_idx ? 0 : 4; 
                context.fillStyle = `#${(Level).toString(16)}${Level}${Level}`
                
                if(Level <= Selected[Number]) {
                    context.fillStyle = `#${index_color_offset.toString(16)}${Level}${(Level + 6).toString(16)}`; 
                }
                
                DrawArc(); 
            }
            context.restore(); 
            // context.arc(0, 0, r, 0, 2 * Math.PI); 
            // context.stroke(); 
        }
        
        // DRAW THE LINES PARTITIONING THE NUMBERS
        // THESE ALIGN ACROSS CIRCLE LEVELS, SO NO NEED TO DRAW THEM SEPARATELY 
        
        context.beginPath(); 
        context.strokeStyle = '#000'; 
        for(let i = 0; i < 2; i += 0.2) {
            context.moveTo(0, 0); 
            context.lineTo(l * Math.cos(i * Math.PI), l * Math.sin(i * Math.PI)); 
        }
        context.stroke(); 

        context.resetTransform(); 
        window.requestAnimationFrame(animate); 
    }; 
    window.requestAnimationFrame(animate); 

    // HINT RESETS SELECTED

    document.querySelector('.hint').addEventListener('click', () => {
        Selected = [...Accepted]; 
    }); 
    
}); 