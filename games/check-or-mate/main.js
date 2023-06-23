window.addEventListener('DOMContentLoaded', () => {

    let shouldBeMate; 

    const board = Chessboard('chessboard')

    window.addEventListener('resize', () => {
        board.resize(); 
    }); 

    const get_wrong_ani = which => {
        return [
            {
                backgroundColor: '#FAA', 
                color: '#F00', 
                textShadow: '0 0 2rem #f00', 
            }, { 
                backgroundColor: which ? '#F0D9B588' : '#B5886288', 
                color: '#000', 
                textShadow: 'none', 
            }, 
        ]; 
    }

    const wrong_ani_timing = { 
        duration: 666, 
        iterations: 1, 
    }

    const mate_button = document.querySelector('.submit-mate'); 
    mate_button.addEventListener('click', () => {
        const result = shouldBeMate; 

        if(!result) {
            mate_button.animate(get_wrong_ani(false), wrong_ani_timing); 
        } else {
            rando(); 
        }
    })

    const check_button = document.querySelector('.submit-check')
    check_button.addEventListener('click', () => {
        const result = !shouldBeMate; 
        
        if(!result) {
            check_button.animate(get_wrong_ani(true), wrong_ani_timing); 
        } else {
            rando(); 
        }
    })  

    const getPieces = () => {
        const ret = []; 
        
        ret.push('bK', 'wK'); 

        const addSev = (str, times) => {
            for(let i = 0; i < times; ++i) {
                ret.push(str); 
            }
        }

        addSev('wQ', Math.round(Math.random() * 1)); 
        addSev('bQ', Math.round(Math.random() * 1)); 
        addSev('wB', Math.round(Math.random() * 2)); 
        addSev('bB', Math.round(Math.random() * 2)); 
        addSev('wN', Math.round(Math.random() * 2)); 
        addSev('bN', Math.round(Math.random() * 2)); 
        addSev('wR', Math.round(Math.random() * 2)); 
        addSev('bR', Math.round(Math.random() * 2)); 
        addSev('wP', Math.round(Math.random() * 8)); 
        addSev('bP', Math.round(Math.random() * 8)); 
        
        return ret; 
    }; 

    const rando = () => {
        let rookCheckmate = {}
        
        const getRFen = () => {
        rookCheckmate = {}
        const pieces = getPieces(); 
        const setPiecesRandomly = () => {
            const checkPos = (p, l) => {
            if(p.charAt(1) === 'P') {
                if(l.charAt(1) === '1' || l.charAt(1) === '8') {
                    return false; 
                    }
                }

                return true; 
            }
            
            for(let i = 0; i < pieces.length; ++i) {

            let loc; 
            do {
                loc = `${String.fromCharCode('a'.charCodeAt(0) + Math.floor(Math.random() * 8))}${Math.floor(Math.random() * 8) + 1}`; 
            } while (
                rookCheckmate[loc] !== undefined || !checkPos(pieces[i], loc)
            )
            rookCheckmate[loc] = pieces[i]; 
            }
        }
        setPiecesRandomly(); 
        
        let fen = ''; 
        for(let row = 8; 0 < row; --row) {
            for(let col = 'a'.charCodeAt(0); col < 'i'.charCodeAt(0); ++col) {
            
            const p = rookCheckmate[`${String.fromCharCode(col)}${row}`]; 
            switch(p) {
                case undefined: 
                if(['1', '2', '3', '4', '5', '6', '7', '8'].indexOf(fen.charAt(fen.length - 1)) !== -1) {
                    let newChar = +fen.charAt(fen.length - 1) + 1; 
                    fen = fen.substring(0, fen.length - 1); 
                    fen += newChar; 
                    
                    // fen[fen.length - 1] = 'a'; 
                    // fen[fen.length - 1] = +fen[fen.length - 1] + 1; 
                } else {
                    fen += '1'; 
                }
                break; 
                case 'wK': 
                fen += 'K'; 
                break; 
                case 'bK': 
                fen += 'k'; 
                break; 
                case 'wQ': 
                fen += 'Q'; 
                break; 
                case 'bQ': 
                fen += 'q'; 
                break; 
                case 'wB': 
                fen += 'B'; 
                break; 
                case 'bB': 
                fen += 'b'; 
                break; 
                case 'wN': 
                fen += 'N'; 
                break; 
                case 'bN': 
                fen += 'n'; 
                break; 
                case 'wR': 
                fen += 'R'; 
                break; 
                case 'bR': 
                fen += 'r'; 
                break; 
                case 'wP': 
                fen += 'P'; 
                break; 
                case 'bP': 
                fen += 'p'; 
                break; 
                default: 
                fen += '1'; 
            }
            }

            if(row !== 1) {
            fen += '/'; 
        
            }
        }
        return fen; 
        }
        
        let fen; 
        let isMate; 
        shouldBeMate = Math.random() < 0.5; 
        let isInCheck; 
        do {
        fen = getRFen(); 
        const w_fen = fen + ' w - - 4 25'; 
        const b_fen = fen + ' b - - 4 25'; 

        const game = new Chess(); 
        game.load(w_fen); 
        
        if(game.in_check()) {
            continue; 
        }
        
        game.load(b_fen); 
        isMate = game.in_checkmate(); 
        if(!isMate) {
            isInCheck = game.in_check(); 
        }
        
        } while (isMate !== shouldBeMate || (!shouldBeMate && !isInCheck)); 
        board.position(rookCheckmate, false)
        console.log('MATING SITUATION', shouldBeMate, isMate); 
    };
    rando(); 
}); 

