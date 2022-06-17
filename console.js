class ConsoleWindow{

    constructor(consoleDivString , consoleWrapperString){
        this.consoleDiv = document.querySelector(consoleDivString);
        this.consoleWrapperDiv = document.querySelector(consoleWrapperString);
        this.queryStack = [];
        this.output_keywords = ['ls','list','show','help','view'];
        this.input_keywords = ['register'];
        this.events = [
            {
                event_id:"0",
                event_name : 'Quizzerati',
                event_team_strength : 4,
                event_desc : 'Quizzes were never more exciting , answer while playing a timed game the first one to give the correct answer takes the prize.'
            },
            {
                event_id:"1",
                event_name : 'HouseMaker',
                event_team_strength : 4,
                event_desc : 'Quizzes were never more exciting , answer while playing a timed game the first one to give the correct answer takes the prize.'
            },
            {
                event_id:"2",
                event_name : 'Scintilla',
                event_team_strength : 4,
                event_desc : 'Quizzes were never more exciting , answer while playing a timed game the first one to give the correct answer takes the prize.'
            }
        ]
        this.schedule = [
            {
                number:"1",
                events:['quizzerati','housemaker'],
                date:'29 Aug 2020'
            },
            {
                number:"2",
                events:['quizzerati','housemaker'],
                date:'29 Aug 2020'
            },
            {
                number:"3",
                events:['quizzerati','housemaker'],
                date:'29 Aug 2020'
            },
        ]
        this.possible_lists = ['events','event-heads','schedule'];
    }



    input_listener = (e)=>{
        e.preventDefault();
        if(e.key === 'Shift' || e.key === 'Control' || e.key==='Alt'){
            return;
        }
        else if(e.key === 'Backspace'){
            e.target.innerText = e.target.innerText.substring(0,e.target.innerText.length - 1);
            return;
        }
        else if(e.key === 'Enter'){
            this.queryStack.push(e.target.innerText);
            this.mapAnswer(e.target.innerText);
            e.target.blur();
            e.target.removeAttribute('contentEditable');
            e.target.removeEventListener('click',this.input_listener);
            return;
        }
        e.target.innerText += e.key;
    }
    wrapAroundAnswerDiv = (answers , heading, generateNewQuery=1)=>{
        let html_string_answers = '';
        answers.forEach((element)=>{
            html_string_answers += element;
        })
        let html_string = `<div class='answer'><h4 class='answer-line-heading'>${heading}</h4>${html_string_answers}</div>`
        this.consoleDiv.insertAdjacentHTML("beforeend",html_string);
        
        if(generateNewQuery){
            this.addNewQuery();
        } 
    }
    returnOutputList(list_id , heading, generateNewQuery=1){
        switch(list_id){
            case -1:{
                let answers = this.possible_lists.map((element)=>{
                    return(
                        `<div class="answer-line"><span>list</span>  <span>${element}</span></div>`
                    )
                })
                console.log(answers);
                    this.wrapAroundAnswerDiv(answers, heading || "Invalid List Command , valid ones are...",generateNewQuery);
                break;
            }
            case 0:{
                let answers = this.events.map((element)=>{
                    return (
                        `
                        <div class='answer-line'><span>${element.event_name}</span> --- <span>${element.event_team_strength} Max Members</span><p>${element.event_desc}</p></div>
                        `
                    ) 
                })
                this.wrapAroundAnswerDiv(answers, "Events List");
                break;
            }
            case 1:{
            }
            case 2:{
                let answers = this.schedule.map((element)=>{
                    return (
                        `
                            <div class="answer-line"><span>Day - ${element.number}</span><br/>Date - <span>${element.date}</span><br/>Events - ${[...element.events]}</div><br/> 
                        `
                    )
                })
                this.wrapAroundAnswerDiv(answers, "Schedule");
                break;
            }
        }

    }
    returnSingleItem(item_id , items, heading, generateNewQuery=1){
        switch(item_id){
            case -1 : {
                let possible_flags = ['event-names-comma-seperated','event-names-comma-seperated','day number-comma-seperated'];
                let answers = this.possible_lists.map((element,index)=>{
                  return  `
                        <div class="answer-line"><span>view</span> <span>${element}</span> <span><-${possible_flags[index]}-></span></div>
                    `
                })
                this.wrapAroundAnswerDiv(answers,heading || 'Invalid View Command, following are valid ...',generateNewQuery);
                break;
            }
            case 0 : {
                //view event
                let answers = this.events.reduce((answer_inter,element)=>{
                    if(items.includes(element.event_name) || items.includes(element.event_id)){
                        answer_inter.push(
                            `
                            <div class='answer-line'><span>${element.event_name}</span> --- <span>${element.event_team_strength} Max Members</span><p>${element.event_desc}</p></div>
                            `
                        ) 
                    }
                    return answer_inter;
                },[])
                console.log(answers);
                this.wrapAroundAnswerDiv(answers,heading || 'Event Details');
                break;
            }
            case 1:{

            }
            case 2:{
                let answers = this.schedule.reduce((answer_inter,element)=>{
                    if(items.includes(element.number)){
                        answer_inter.push(
                            `
                            <div class='answer-line'><span>Day ${element.number}</span><br/><span>Date : ${element.date}</span><br/><span>Events : ${[...element.events]}</span><br/></div>
                            `
                        ) 
                    }
                    return answer_inter;
                },[])
                console.log(answers);
                this.wrapAroundAnswerDiv(answers,heading || 'Schedule Details');
                break;
            }
        }
    }
    mapAnswer(query){
        console.log(query);
        let list_of_tokens = query.split(' ');
        let input_flag = list_of_tokens[0];

        if(this.output_keywords.includes(list_of_tokens[0])){
            //if it is an input keyword
            console.log('input',input_flag);
            switch(input_flag){
                case 'list' : {
                    if(list_of_tokens.length > 2){
                        this.returnOutputList(-1);
                    }
                    else{
                        this.returnOutputList(this.possible_lists.indexOf(list_of_tokens[1]));
                    }
                    break;
                }
                case 'view':{
                    if(list_of_tokens.length > 3){
                        this.returnSingleItem(-1);
                    }
                    else if(list_of_tokens.length === 3){
                        this.returnSingleItem(this.possible_lists.indexOf(list_of_tokens[1]),list_of_tokens[2].split(','))
                    }
                    break;
                }
                case 'help':{
                    if(list_of_tokens.length > 2){
                        let answers = [`<div class="answer-line"><span>Help only takes one argument.</span></div>`];
                        this.wrapAroundAnswerDiv(answers,"Invalid Help Call");
                    }
                    else if(list_of_tokens.length === 2){
                        if(list_of_tokens[1] === 'list'){
                            this.returnOutputList(-1,'Valid List Usage');
                        }
                        else if(list_of_tokens[1] === 'view'){
                            this.returnSingleItem(-1,[],'Valid View Usage');
                        }
                    }
                    else if(list_of_tokens.length === 1){
                        this.returnOutputList(-1,'Valid List Usage',0);
                        this.returnSingleItem(-1,[],'Valid View Usage');
                    }
                    break;
                }
                case 'register':{

                }
                default :{
                }
            }
        }
        else{
            let answers = [`<div class="answer-line"><span>Invalid Identifier ${input_flag}</span></div>`];
            this.wrapAroundAnswerDiv(answers, "Invalid Command");
        }

    }
    addNewQuery(prefix_text){
        console.log('inside',this.queryStack.length,this.queryStack);
        let html_string = `
        <div class="query">
            <span>>> ${prefix_text ? prefix_text + ' ' : ''}</span> <div class="query-string" contentEditable="true" id="query${this.queryStack.length}"></div>
        </div> 
        `
        this.consoleDiv.insertAdjacentHTML("beforeend",html_string);
        document.getElementById(`query${this.queryStack.length}`).addEventListener('keydown' , this.input_listener)
        this.consoleWrapperDiv.scrollTop = this.consoleWrapperDiv.scrollHeight;
    }
    init=()=>{
        this.addNewQuery(); 
        this.consoleDiv.addEventListener('click',()=>{
            this.consoleDiv.children[this.consoleDiv.children.length - 1].children[1].focus();
        })
    }

}

let new_console_instance = new ConsoleWindow('div.real-console', 'div.terminal-content');
new_console_instance.init();