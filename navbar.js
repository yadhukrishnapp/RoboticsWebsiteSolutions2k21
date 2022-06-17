const setUpNav = ()=>{
    let nav_element = document.querySelector('nav');
    let burger = nav_element.children[2];
    burger.onclick = ()=>{
        let enabled_status = nav_element.getAttribute('enabled');
        if(enabled_status == 0){
            nav_element.setAttribute('enabled','1');
        }
        else{
            nav_element.setAttribute('enabled', '0');
        }
    }
}

setUpNav();