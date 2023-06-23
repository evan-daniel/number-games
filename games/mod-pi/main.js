import { pi_bases } from '/settings/default_text.js'; 

window.addEventListener('DOMContentLoaded', DOMContentLoaded => {

    // BASES MAPPED TO NUMBER OF SEGMENTS

    let base = 'decimal'; 
    const BaseNumeric = () => {
        const bases = {};
        Object.keys(pi_bases).forEach((base, index) => {
            bases[base] = index + 2; 
        }); 
        return bases[base]; 
    }

    // HANDLE CHANGE OF BASE

    let pi; 
    let base_val;  
    let cursor; 
    let pi_accumulator; 
    let LastAccept = 0; 
    const UpdateBase = () => {
        base_val = BaseNumeric();
        pi = pi_bases[base]; 
        cursor = 0; 
        pi_accumulator = 0; 
        LastAccept = 0; 
        
        // console.log(`BASE: ${base} VAL: ${base_val} PI: ${pi}`); 
    }; 
    UpdateBase(); 

    const baseSelect = document.querySelector('.base-select'); 
    baseSelect.addEventListener('change', () => {
        base = baseSelect.value;
        UpdateBase(); 
        setFeedback(); 
    }); 
    
    const context = document.querySelector('canvas').getContext('2d'); 
    
    const resize = () => {
        w = h = Math.floor(window.innerWidth); 
        // context.canvas.style.width = `${w}px`; 
        // context.canvas.style.height = `${h}px`; 
        
        const offset = context.canvas.getBoundingClientRect(); 
        CanvasXOffset = offset.x; 
        CanvasYOffset = offset.y; 
        context.canvas.width = offset.width * window.devicePixelRatio; 
        context.canvas.height = offset.width * window.devicePixelRatio; 
        console.log('OFFSET', offset.width); 
        // console.log('OFFSET', CanvasXOffset); 
    }; 
    let CanvasXOffset, CanvasYOffset, w, h; 
    resize(); 
    window.addEventListener('resize', resize); 
    window.setInterval(resize, 2666); 
    
    const setFeedback = () => {
        document.querySelector('.cursor').innerText = cursor; 

        let hint = ''; 
        for(let i = cursor - 8; i < cursor + 9; ++i) {
            hint += i < 0 ? '&nbsp;' : pi[i]; 
        }
        document.querySelector('.hint').innerHTML = hint; 
    }; 
    setFeedback(); 

    // RESET CURSOR

    document.querySelector('.reset').addEventListener('click', () => {
        cursor = 0; 
        setFeedback(); 
    });  

    // WHERE IS THE LOCATOR
    
    let touch_x = 0, touch_y = 0; 
    let touch_active = false; 

    const handleLocationChange = (x, y) => {
        touch_active = true; 
        touch_x = (x - CanvasXOffset) * window.devicePixelRatio; 
        touch_y = (y) * window.devicePixelRatio; 
    }; 
    
    context.canvas.addEventListener('touchstart', touchstart => handleLocationChange(touchstart.touches[0].clientX, touchstart.touches[0].clientY)); 
    context.canvas.addEventListener('touchmove', touchmove => {
        touchmove.preventDefault(); 
        handleLocationChange(touchmove.touches[0].clientX, touchmove.touches[0].clientY); 
    }); 
    context.canvas.addEventListener('mousedown', mousedown => handleLocationChange(mousedown.clientX, mousedown.clientY)); 
    context.canvas.addEventListener('mousemove', mousemove => handleLocationChange(mousemove.clientX, mousemove.clientY)); 


    // GET WHAT HAPPENED
    
    const GetNumber = () => {
        let angle = -Math.atan2(touch_y - context.canvas.height / 2, touch_x - context.canvas.width / 2) / Math.PI / 2; 
        if(angle < 0) {
            angle += 1; 
        }
        
        console.log(`NUMBER: ${Math.floor(angle * base_val)}, x: ${touch_x}, y: ${touch_y}`)
        return Math.floor(angle * base_val); 
    }; 
    
    let falsities = []; 
    const handle_interaction_end = () => {

        const pi_submission = GetNumber(); 
        // console.log(`SUBMITTED: ${ pi_submission }`)
        const pi_accumulated = (pi_accumulator + pi[cursor]) % base_val; 
        // console.log(pi_accumulated); 
        if(pi_accumulated === pi_submission) {
            cursor = ++cursor % 100; 
            falsities = []; 
            LastAccept = pi_submission; 
            pi_accumulator = pi_accumulated; 
            setFeedback(); 

            // const feedbackCircle = document.querySelector('.pi-feedback-circle'); 
            // feedbackCircle.style = 'transition: none; background-color: #0FF'; 
            // feedbackCircle.offsetHeight; 
            // feedbackCircle.style = 'transition: 0.5s background-color; background-color: #000'; 
        } else {
            falsities.push(GetNumber()); 
        }
        
        touch_active = false; 
    }; 
    context.canvas.addEventListener('touchend', handle_interaction_end); 
    // context.canvas.addEventListener('mouseup', handle_interaction_end); 
    context.canvas.addEventListener('mouseleave', () => {
        // touch_active = false; 
    }); 
    context.canvas.addEventListener('mouseup', handle_interaction_end); 
    
    // RENDER, ANIMATION

    const animate = timestamp => {
        context.lineWidth = 3; 
        context.clearRect(0, 0, context.canvas.width, context.canvas.height); 
        
        // BG AND WHITE CIRCLE
        context.fillStyle = '#000'; 
        context.fillRect(0, 0, context.canvas.width, context.canvas.height); 
        context.fillStyle = '#FFF'; 
        context.beginPath(); 
        context.arc(context.canvas.width / 2, context.canvas.height / 2, context.canvas.height / 2, 0, 2 * Math.PI); 
        context.fill(); 
        
        // for(let falsity of falsities) {
        //     context.fillStyle = '#faa'; 
        //     context.translate(context.canvas.width / 2, context.canvas.height / 2); 
        //     context.rotate(-Math.PI * falsity / 5); 
        //     context.beginPath(); 
        //     context.lineTo(context.canvas.width / 2, 0); 
        //     context.arc(0, 0, context.canvas.width / 2, 0, Math.PI / 5); 
        //     context.lineTo(0, 0); 
        //     context.fill(); 
        //     context.resetTransform(); 
        // }
        
        const segmentArc = Math.PI * 2 / base_val; 
        let LastAccept_Offseted = LastAccept + 1; 
        context.fillStyle = '#afa'; 
        context.translate(context.canvas.width / 2, context.canvas.height / 2); 
        context.rotate(-segmentArc * LastAccept_Offseted); 
        context.beginPath(); 
        context.lineTo(context.canvas.width / 2, 0); 
        context.arc(0, 0, context.canvas.width / 2, 0, segmentArc); 
        context.lineTo(0, 0); 
        context.fill(); 
        context.resetTransform(); 

        // context.strokeStyle = '#0ff'; 
        // context.beginPath(); 
        // context.moveTo(context.canvas.width / 2, context.canvas.height / 2); 
        // context.lineTo(touch_x, touch_y); 
        // context.stroke(); 

        context.strokeStyle = '#000'; 
        for(let i = 0; i < 2; i += 2 / base_val) {
            context.beginPath(); 
            context.moveTo(context.canvas.width / 2, context.canvas.height / 2); 
            context.lineTo(context.canvas.width / 2 * (Math.cos(i * Math.PI) + 1), context.canvas.height / 2 * (Math.sin(i * Math.PI) + 1)); 
            context.stroke(); 
        }
        
        
        window.requestAnimationFrame(animate); 
    }; 
    window.requestAnimationFrame(animate); 
}); 