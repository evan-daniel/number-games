function note(id, velocity) {
    this.constructor = (id, velocity) => {
        this.id = id; 
        this.pitch = scale[id]; 
        this.velocity = velocity; 

        this.gain = audio_context.createGain(); 

        this.panner = audio_context.createStereoPanner(); 
        this.panner.pan.setValueAtTime(0, audio_context.currentTime);
        this.panner.connect(audio_context.destination); 
        
        this.gain.connect(this.panner); 
        this.gain.gain.setValueAtTime(0.9, audio_context.currentTime); 
        
        this.oscillator = audio_context.createOscillator(); 
        this.oscillator.type = "square"; 
        this.oscillator.frequency.value = this.pitch; 
        this.oscillator.connect(this.gain); 
        this.oscillator.start(0); 
    }

    this.turn_off = () => {
        this.velocity = 0; 
        this.gain.gain.setTargetAtTime(this.velocity, audio_context.currentTime + 0.05, 0.05); 
        this.oscillator.stop(audio_context.currentTime + 0.1); 
        notes.splice(notes.findIndex(_note => _note === this), 1); 
    }

    this.constructor(id, velocity); 
}

const doc_click = new Promise((resolve, _) => document.addEventListener('click', () => resolve())); 

let audio_context; 
const notes = []; 
const scales = {
    EXP2_TENTHS_110: [], 
    STANDARD_110: [], 
    STANDARD_10SCALE_110: [
        110 * Math.pow(2, 0 / 12), 
        110 * Math.pow(2, 1 / 12), 
        110 * Math.pow(2, 2 / 12), 
        110 * Math.pow(2, 3 / 12), 
        110 * Math.pow(2, 4 / 12), 
        110 * Math.pow(2, 6 / 12), 
        110 * Math.pow(2, 8 / 12), 
        110 * Math.pow(2, 9 / 12), 
        110 * Math.pow(2, 10 / 12), 
        110 * Math.pow(2, 11 / 12), 
        220 * Math.pow(2, 0 / 12), 
        220 * Math.pow(2, 1 / 12), 
        220 * Math.pow(2, 2 / 12), 
        220 * Math.pow(2, 3 / 12), 
        220 * Math.pow(2, 4 / 12), 
        220 * Math.pow(2, 6 / 12), 
        220 * Math.pow(2, 8 / 12), 
        220 * Math.pow(2, 9 / 12), 
        220 * Math.pow(2, 10 / 12), 
        220 * Math.pow(2, 11 / 12), 
    ], 
    BASETEN_110: [
        110 * Math.pow(2, 0 / 10), 
        110 * Math.pow(2, 1 / 10), 
        110 * Math.pow(2, 2 / 10), 
        110 * Math.pow(2, 3 / 10), 
        110 * Math.pow(2, 4 / 10), 
        110 * Math.pow(2, 5 / 10), 
        110 * Math.pow(2, 6 / 10), 
        110 * Math.pow(2, 7 / 10), 
        110 * Math.pow(2, 8 / 10), 
        110 * Math.pow(2, 9 / 10), 
        220 * Math.pow(2, 0 / 10), 
        220 * Math.pow(2, 1 / 10), 
        220 * Math.pow(2, 2 / 10), 
        220 * Math.pow(2, 3 / 10), 
        220 * Math.pow(2, 4 / 10), 
        220 * Math.pow(2, 5 / 10), 
        220 * Math.pow(2, 6 / 10), 
        220 * Math.pow(2, 7 / 10), 
        220 * Math.pow(2, 8 / 10), 
        220 * Math.pow(2, 9 / 10), 
    ], 
    TEN_EVENLY_100: [
        100, 110, 120, 130, 140, 150, 160, 170, 180, 190,
    ], 
    TEN_PERM_110: [
        110, 
        110 * (1 + 1 / 5), 
        110 * (1 + 1 / 4), 
        110 * (1 + 1 / 3), 
        110 * (1 + 2 / 5), 
        110 * (1 + 1 / 2), 
        110 * (1 + 3 / 5), 
        110 * (1 + 2 / 3), 
        110 * (1 + 3 / 4), 
        110 * (1 + 4 / 5), 
    ], 
    TEN_FRACT_110: [
        110, 
        110 * (1 + 1 / 9), 
        110 * (1 + 1 / 8), 
        110 * (1 + 1 / 7), 
        110 * (1 + 1 / 6), 
        110 * (1 + 1 / 5), 
        110 * (1 + 1 / 4), 
        110 * (1 + 1 / 3), 
        110 * (1 + 1 / 2), 
        220, 
    ], 
}; 
for(let i = 0; i < 10; ++i) {
    scales.EXP2_TENTHS_110.push(110 * Math.pow(2, i / 10)); 
}
for(let i = 0; i < 12; ++i) {
    scales.STANDARD_110.push(110 * Math.pow(2, 8 / 12) * Math.pow(2, i / 12)); 
}
let scale = scales.STANDARD_110; 

const init = async _scale => {
    if(_scale) {
        scale = _scale; 
    }
    
    await new Promise((resolve, _) => document.addEventListener('click', () => resolve())); 
    audio_context = new AudioContext(); 
    console.log('AUDIO STARTED'); 
}; 

let resolve_delayed_note; 
const note_start_delayed = new Promise(resolve => resolve_delayed_note = resolve); 
const start_note = async (id, velocity) => {
    if(!audio_context) {
        await doc_click; 
        audio_context = new AudioContext(); 
        resolve_delayed_note(); 
    }
    notes.push(new note(id, velocity)); 
}; 

const end_note = async id => {
    // await note_start_delayed; 
    const _note = notes.find(_note => _note.id === id); 
    if(_note) {
        _note.turn_off(); 
    }
}; 

const end_all_notes = async () => {
    // await note_start_delayed; 
    notes.forEach(note => {
        note.turn_off(); 
    }); 
}; 

const set_scale = new_scale => {
    if(new_scale) {
        notes.forEach(note => {
            end_note(note); 
        }); 
        scale = new_scale; 
    }
}; 

export default { scales, init, start_note, end_note, set_scale, end_all_notes }; 