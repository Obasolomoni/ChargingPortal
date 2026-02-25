
import React, {useState} from 'react';

function Navbar(){

    const [isOpen, setIsOpen] = useState(false);

    function navToggle(){
        setIsOpen(true)
    }

    return(
        <nav>
            <div>LFC Charging Portal</div>
            <div style={isOpen ? "flex" : ""}>
              <a>Home</a>  
              <a>Charging</a>
              <button>Logout</button>
            </div>
            <button onClick={navToggle}>close</button>
            
            

        </nav>
    )
}

export default Navbar