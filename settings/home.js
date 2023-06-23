window.addEventListener('DOMContentLoaded', () => {
    
    // GLOBAL
    
    let heading_cellular = true; 

    // CONVENIENCE

    const act_desc_from_value = value => {
        document.querySelectorAll('.description.active').forEach(desc => {
            desc.classList.remove('active'); 
        }) 

        // UNDEFINED VALUE DEACTIVATES ALL DESCRIPTIONS
        
        if(value) {
            document.querySelector(`.description[value=${value}`)?.classList.add('active'); 
        }
    }
    
    // USER CLICKS
    
    document.querySelector('.showcase').addEventListener('click', click => {
        heading_cellular = !heading_cellular; 

        // CLICKED IN THE MARGINS
        
        if(!heading_cellular && !click.target.classList.contains('game-icon')) {
            heading_cellular = !heading_cellular; 
            return; 
        }

        // DOM IS THE SSOT FOR ACTIVE DESCRIPTION
        
        if(!heading_cellular && click.target.classList.contains('game-icon')) {
            act_desc_from_value(click.target.getAttribute('value')); 
        }

        const cells = document.querySelectorAll('.cell'); 

        const get_hc = () => heading_cellular; 

        cells.forEach(cell => {
            window.setTimeout(() => {
                if(!get_hc()) {
                    cell.style.backgroundColor = '#00f'; 
                    cell.style.border = 'none'; 
                    cell.querySelector('.game-icon').style.visibility = 'hidden'; 
                } else {
                    cell.style.visibility = 'visible'; 
                }
                
                window.setTimeout(() => {
                    if(!get_hc()) {
                        cell.style.visibility = 'hidden'; 

                        // REDUNDANT BY DESIGN
                        
                        cell.style.backgroundColor = '#00f'; 
                        cell.style.border = 'none'; 
                        cell.querySelector('.game-icon').style.visibility = 'hidden'; 
                    } else {
                        cell.querySelector('.game-icon').style.visibility = 'visible'; 
                        cell.style.backgroundColor = '#fff'; 
                        cell.style.border = '1px solid #fff'; 

                        // REDUNDANT BY DESIGN
                        
                        cell.style.visibility = 'visible'; 
                    }
                }, 166); 
                
            }, Math.random() * 333); 
        })

        // DESCRIPTION

        if(!get_hc()) {
            document.querySelector('.description.active').style.visibility = 'visible'; 
        } else {
            window.setTimeout(() => {
                if(get_hc()) {
                    document.querySelector('.description.active').style.visibility = 'hidden'; 
                }
            }, 166);
        }
    })
}); 