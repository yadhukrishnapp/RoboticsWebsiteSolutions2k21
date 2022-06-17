const DAYS_INFO = [
    {
        dayIndex : 0,
        dayPara : 'A Monstrous start with effort draining team exercises...',
        dayEvents : ['HomeMaker-1' , 'SolidWorks-1']
    },
    {
        dayIndex : 1,
        dayPara : 'Keep your face always towards the goal and victory will follow you...',
        dayEvents : ['HomeMaker-2','Scintilla-1']
    },
    {
        dayIndex : 2,
        dayPara : 'One set from the victory you aspire and the rewards you desire...',
        dayEvents : ['Quizotics','Scintilla-2','SolidWorks-2']
    }
]

const setUpEventsDesc = ()=>{
    let event_day_span = document.getElementById('event_day_span');
    let events_below_grid = document.querySelector('div.event-grp');
    let event_day_para = document.getElementById('event_day_para');
    let event_day_slider = document.querySelector('div.slide-indicator');
   
    let set_up_event = (dayIndex)=>{
        console.log(dayIndex);
        event_day_span.innerText = `Day ${dayIndex + 1}`;
        event_day_para.innerText = DAYS_INFO[dayIndex].dayPara;
        let html = '';
        DAYS_INFO[dayIndex].dayEvents.forEach((element)=>{
            html += `<a href="/events.html" target="_blank">${element}</a>`;
        })
        event_day_slider.setAttribute('active',dayIndex);
        events_below_grid.innerHTML = html;
    }
    return set_up_event;
}

let event_function = setUpEventsDesc();
let events_below_grid = document.querySelector('div.slide-indicator');
event_function(0);




class MySwiper{
    constructor(parent_element , left_btn , right_btn){
        this.parent = document.querySelector(parent_element);
        this.left = document.querySelector(left_btn);
        this.right = document.querySelector(right_btn);
        this.current_position = 0;
        this.parent.style.transition = `transform 0.4s ease-out`;
        this.resizeObserver = new ResizeObserver(()=>{
            this.reset();
        })
        this.resizeObserver.observe(this.parent);
    }
    transform = ()=>{
        let child_width = this.parent.children[0].offsetWidth + 64; //added margin from styles
        this.parent.style.transform = `translateX(${-1 * child_width * this.current_position}px)`;
    }
    init = ()=>{
        this.reset();
        console.log(this.children_per_page);
        this.left.addEventListener('click',()=>{
            if(this.current_position === 0){
                return; 
            }
            this.current_position -= 1;
            this.transform();
        })
        this.right.addEventListener('click',()=>{
            if(this.current_position === this.children_per_page){
                return;
            }
            this.current_position += 1;
            this.transform();
        })
    }

    reset = ()=>{
       this.current_position = 0; 
       let child_width = this.parent.children[0].offsetWidth + 64;
       this.children_per_page = this.parent.children.length - Math.floor(window.innerWidth / child_width);
       this.transform();
    }

}

let eventSwiper = new MySwiper('div.events','div.events-wrapper button.left','div.events-wrapper button.right');
eventSwiper.init();

function convertSecondsToHours(seconds){
    seconds = seconds / 1000;
    let hours_string = seconds / 3600;
    let hours_remainder = seconds % 3600;
    let seconds_string = hours_remainder % 60;
    let minutes = Math.floor(hours_remainder / 60);
    return [Math.floor(hours_string) , Math.floor(minutes) , Math.floor(seconds_string)];
}

let current_date = new Date();
let target_date = new Date(2021 , 4 , 24);
console.log(target_date - current_date);
let time_difference = convertSecondsToHours(target_date - current_date);
let [hours , minutes , seconds] = time_difference;
let hours_element = document.querySelector('#hours');
let minutes_element = document.querySelector('#minutes');
let seconds_element = document.querySelector('#seconds');
let id = setInterval(() => {
    if(seconds - 1 < 0){
        seconds = 59;
        if(minutes - 1 < 0){
            minutes = 59;
            hours -= 1;
        }
        else{
            minutes = minutes - 1;
        }
    }else{
        seconds = seconds - 1;
    }

    hours_element.innerText = `${hours} `;
    minutes_element.innerText = `: ${Math.floor(minutes / 10) === 0 ? 0 + String(minutes) : minutes} :`;
    seconds_element.innerText = ` ${Math.floor(seconds / 10) === 0 ? 0 + String(seconds) : seconds}`;

}, 1000);
// clearInterval(id);


let database = firebase.database();

async function writeUserData({teamName, eventIndex, teamLeader , teamMembers , email , phoneNo}) {
    await firebase.database().ref('users/' + `${teamName}${teamLeader}${Math.floor(Math.random()*50000)}`).set({
      teamLeader : teamLeader,
      email: email,
      phoneNo : phoneNo,
      teamName : teamName,
      teamMembers : teamMembers,
      eventIndex : eventIndex
    });
}

class RegistrationData{
   constructor(team_name_field , 
    team_leader_field , 
    team_members_grid , 
    team_member_field , 
    event_grid ,
    prev_button , 
    next_button, 
    form_wrapper,
    member_add_btn,
    email_field, 
    phoneNo_field,
    ){
        this.team_name = document.querySelector(team_name_field);
        this.team_leader = document.querySelector(team_leader_field);
        this.members_grid = document.querySelector(team_members_grid);
        this.team_member_field = document.querySelector(team_member_field);
        this.event_grid = document.querySelector(event_grid);
        this.prev_button = document.querySelector(prev_button);
        this.next_button = document.querySelector(next_button);
        this.form_wrapper = document.querySelector(form_wrapper);
        this.team_member_add_btn = document.querySelector(member_add_btn);
        this.email_field = document.querySelector(email_field);
        this.phoneNo_field = document.querySelector(phoneNo_field);
      
        this.form = {
            teamName : '',
            eventIndex : -1,
            teamLeader : '',
            teamMembers : [],
            email:'',
            phoneNo:''
        };
        this.current_page_index = 0;
        this.member_grid_empty = 1;

        this.EVENT_INFO = [
            {
                event : 'Quizotics',
                desc : 'Quizzes were never more exciting , answer while playing a timed game the first one to give the correct answer takes the prize.',
                maxMembers : 1
            },
            {
                event : 'Scintilla',
                desc : "Come up with Ideas that can change the world, and we'll help you a step forward.",
                maxMembers : 3
            },
            {
                event : 'HouseMaker',
                desc : "Fascinated by idea of living in a smart home ? Upgrade your home with most amazing solution and win exclusive prizes.",
                maxMembers : 3,
            },
            {
                event : 'Solidworks',
                desc : "Good Design begins with trusting your intuitions. We will hand you a box, Make it look good! and win exciting prizes.",
                maxMembers : 1,
            }
        ];

        this.ERROR_FIELD = [
            {
                element:"#team_name",
                default:"Choose a cool one, It helps."
            },
            {
                element:"#event_info",
                default:"Choose an event to continue."
            },
            {   element:"#team_leader",
                default:"Leader is the first team member."
            },
            {
                element:"#member_name",
                default:"",
            },
            {
                element:"#email_label",
                default:""
            },
            {
                element:"#phone_label",
                default:""
            },
        ];
   } 

   formSubmit = ()=>{
       if(this.form.teamName.trim().length === 0){
           this.errorInField(this.team_name,'Team Name cannot be empty.',0);
           return {status : false , errorPageIndex : 0};
       }
       if(this.form.eventIndex === -1){
           this.errorInField(document.querySelector(this.ERROR_FIELD[1].element),'Choose an Event to Continue',1);
           return {status : false , errorPageIndex : 0};
       }
       if(this.form.teamLeader.trim().length === 0){
           this.errorInField(this.team_leader,'First Member has to be non-empty and only alphabets',2);
           return {status : false , errorPageIndex : 1};
       }
       if(this.form.email.trim().length === 0){
           this.errorInField(this.email_field,'Please Enter a Valid Email',4);
           return {status : false , errorPageIndex : 2};
       }
       if(this.form.phoneNo.trim().length === 0){
           this.errorInField(this.phoneNo_field,'Please Enter a Valid Phone',4);
           return {status : false , errorPageIndex : 2};
       }

       if(!this.member_grid_empty){
            Array.from(this.members_grid.children).forEach((element)=>{
                this.form.teamMembers.push(element.innerText.trim());
            })
       }
       return {status : true , data : this.form};


   }

   isValidName = (name)=>{
        if(name.match(/(1|2|3|4|5|6|7|8|9|0)/g)){
            return false;
        }
        else if(name.match(/(#|\/|@|\!|\$|\^|&|\(|\))/g)){
            return false;
        }
        else if(name.trim().length === 0){
            return false;
        }
        return true;
   }

   isValidEmail = (email)=>{
       if(email.indexOf('@') === -1 || email.indexOf('.') === -1){
           return false;
       }
       if(email.indexOf('@') === 0 || email.indexOf('.') === 0 || email.indexOf('.') < email.indexOf('@')){
           return false;
       }
       return true;
   }

   isValidPhoneNo = (phoneNo)=>{
       let array = ['0','1','2','3','4','5','6','7','8','9']
       if(phoneNo[0] ==='0'){
        return false;
       }
       if(phoneNo.length !== 10){
           return false;
       }
       let error = 0;
       phoneNo.split('').forEach((element)=>{
        if(!array.includes(element))
        {
            error = 1;
        }
       })
       if(error === 1){
           return false;
       }
       if(error === 0){
           return true;
       }
   }

   errorInField = (field , message, field_index)=>{
        field.classList.add('error');
        let element = document.querySelector(this.ERROR_FIELD[field_index].element); 
        element.classList.add('error');
        element.innerText = message;
   }

   removeErrorInField = (field , field_index) =>{
        field.classList.remove('error');
        let element = document.querySelector(this.ERROR_FIELD[field_index].element); 
        element.classList.remove('error');
        element.innerText = this.ERROR_FIELD[field_index].default;
   }

   set_current_page_index = (target_index)=>{
       if(target_index === -1){
           //form submission
           let status = this.formSubmit();
           if(status.status === false){
               this.set_current_page_index(status.errorPageIndex);
           }
           else if(status.status  === true){
               console.log(status.data);
               let data = status.data;
               this.next_button.innerText = 'Loading ...';
               this.next_button.disabled = 'true';
               writeUserData(data).then(()=>{
                    newModal.openModal('Yay!!! Registration Complete',`Congrats <i>${this.form.teamName}</i>, <br/>You are successfully registered for ${this.EVENT_INFO[this.form.eventIndex].event}<br/>You will receive a mail including further instructions.`);
                    this.clearForm();
                    this.next_button.innerText = 'Next';
                    this.next_button.removeAttribute('disabled');
            });
           }
           return;
       }
        this.current_page_index = target_index;
        this.form_wrapper.style.transform = `translateX(${-1 * 100 * target_index}%)`;
        console.log(this.form_wrapper , target_index);
        if(this.current_page_index === 0){
            this.prev_button.style.pointerEvents = 'none';
            this.prev_button.style.opacity = 0;
            this.next_button.innerText = 'Next';
        }
        else if(this.current_page_index !== 0){
            this.prev_button.style.pointerEvents = 'all';
            this.prev_button.style.opacity = 1;
        }
        if(this.current_page_index === 2){
            this.next_button.innerText = 'Done';
        }
   }

   removeMemberUpdate = ()=>{
       if(this.members_grid.children.length === 0){
            this.members_grid.innerText = 'Add Members to view here';
            //member grid is empty.
            this.member_grid_empty = 1;
            this.removeErrorInField(this.team_member_field,3);
       }
   }
   clearForm = ()=>{
        this.form = {
            teamName : '',
            eventIndex : -1,
            teamLeader : '',
            teamMembers : [],
            email:'',
            phoneNo:''
        };

        this.team_leader.value = '';
        this.email_field.value = '';
        this.phoneNo_field.value = '';
        this.member_grid_empty = 1;
        this.members_grid.innerHTML = '';
        this.removeMemberUpdate();
        this.team_name.value = '';
        this.event_grid.setAttribute('selected','-1');
        this.set_current_page_index(0);

   }

   addMemberField = (name , team_strength , check)=>{
       if(team_strength === -1){
           this.errorInField(this.team_member_field,`Please Select an Event to Continue.`,3);
           return;
       }
       if(check === 0){
           this.errorInField(this.team_member_field,`Please add Team Leader as your first member.`,3);
           return;
       }
       if(this.member_grid_empty){
           this.members_grid.innerHTML = '';
           this.member_grid_empty = 0;
       }
       if(this.members_grid.children.length === team_strength){
           this.errorInField(this.team_member_field,`Max ${team_strength} Members Allowed`,3);
           return;
       }
       let element = document.createElement('span');
       let cross_element = document.createElement('i');
       cross_element.addEventListener('click', ()=>{
            element.classList.add('removed');
            setTimeout(()=>{
                this.members_grid.removeChild(element);
                this.removeMemberUpdate();
            },300)
       })
       element.innerText = name;
       element.append(cross_element);
       this.members_grid.insertAdjacentElement('beforeend',element);
   }

   init = ()=>{

       this.removeMemberUpdate();

       this.prev_button.addEventListener('click', ()=>{
           this.set_current_page_index(this.current_page_index - 1);
       });
       this.next_button.addEventListener('click', ()=>{
           if(this.current_page_index === 0){
                this.set_current_page_index(1);
           }
           else if(this.current_page_index === 1){
                this.set_current_page_index(2);
           }
           else if(this.current_page_index === 2){
               this.set_current_page_index(-1);
           }
       });
       this.team_name.addEventListener('change', (e)=>{
           if(e.target.value.trim().length === 0){
                //empty
                this.errorInField(e.target , "Empty Team Names are not valid", 0);
                this.form.teamName = ''; 
                return;
           }
           this.removeErrorInField(e.target , 0);
           this.form.teamName = e.target.value.trim();
       })
       this.team_leader.addEventListener('change', (e)=>{
           if(this.isValidName(e.target.value)){
                this.removeErrorInField(e.target , 2);
                this.form.teamLeader = e.target.value.trim();
           }
           else{
               this.errorInField(e.target , "Names don't have numbers or special chars", 2);
               this.form.teamName = ''; 
           }
       })
       this.team_member_add_btn.addEventListener('click', (e)=>{
           console.log(this.isValidName(this.team_member_field.value));
           if(this.isValidName(this.team_member_field.value)){
               this.removeErrorInField(this.team_member_field , 3);
               this.addMemberField(this.team_member_field.value , this.EVENT_INFO[this.form.eventIndex] ? this.EVENT_INFO[this.form.eventIndex].maxMembers : -1, this.form.teamLeader.length);
               this.team_member_field.value = '';
           }
           else{
               this.errorInField(this.team_member_field , "Names don't have numbers or special chars" , 3);
           }
       })
       Array.from(this.event_grid.children).forEach((element , index)=>{
            element.addEventListener('click', (e)=>{
                this.event_grid.setAttribute('selected',index);
                let event_field = document.querySelector(this.ERROR_FIELD[1].element);
                this.removeErrorInField(document.querySelector(this.ERROR_FIELD[1].element) , 1);
                event_field.innerText = this.EVENT_INFO[index].desc;

                //every time an event is changed, the form for members is reset.
                this.members_grid.innerHTML = '';
                this.removeMemberUpdate();
                //ends here

                this.form.eventIndex = index;
            })
       });
       Array.from(this.members_grid.children).forEach((element , index)=>{
            element.children[0].addEventListener('click', (e)=>{
                element.classList.add('removed');
                setTimeout(()=>{
                    this.members_grid.removeChild(element);
                    this.removeMemberUpdate();
                },300)
            })
       })

       this.email_field.addEventListener('change',(e)=>{
            if(this.isValidEmail(e.target.value.trim())){
                this.form.email = e.target.value.trim();
                this.removeErrorInField(e.target ,4);
            }
            else{
                this.errorInField(e.target , 'Invalid Email',4);
                this.form.email = '';
            }
       })

       this.phoneNo_field.addEventListener('change',(e)=>{
           if(this.isValidPhoneNo(e.target.value.trim())){
               this.form.phoneNo = e.target.value.trim();
               this.removeErrorInField(e.target ,5);
           }
           else{
               this.form.phoneNo = ''; 
               this.errorInField(e.target , 'Invalid Phone No', 5);
           }
       })

   }

}


let new_form = new RegistrationData(
    "#team_name_input", 
    "#team_leader_input",
    "#team_members_grid",
    "#member_field",
    "#event_grid",
    "#form_prev",
    "#form_next",
    "div.reg-form",
    "#member_add_btn",
    "#email_field",
    "#phone_field"
);
new_form.init();

let events_page = document.querySelector('section.reg-page-wrapper');
showEvents = ()=>{
    events_page.classList.add('visible');
}
closeEvents = ()=>{
    events_page.classList.remove('visible');
}


class ModalAlert{
    constructor(modal_wrapper , close_btn , data_field , heading_field){
        this.modal_wrapper = document.querySelector(modal_wrapper);
        this.close_btn = document.querySelector(close_btn);
        this.data_field = document.querySelector(data_field);
        this.heading_field = document.querySelector(heading_field);
        this.openState = 0;
    }
    openModal = (heading , message)=>{
        this.heading_field.innerHTML = heading;
        this.data_field.innerHTML = message;
        this.modal_wrapper.classList.add('visible');
        this.openState = 1;
    }
    init = ()=>{
        this.close_btn.addEventListener('click' , ()=>{
            this.modal_wrapper.style.opacity = 0;
            setTimeout(()=>{
                this.modal_wrapper.classList.remove('visible');
            },400)
            setTimeout(() => {
                this.modal_wrapper.opacity = 1; 
            }, 800);
            this.openState = 0;
        });
    }
}

let newModal = new ModalAlert('div.modal-wrapper','#modal-close','#modal-data','#modal-heading');
newModal.init();