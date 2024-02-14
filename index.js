
let addButton=document.getElementById('add');             //add button
let input = document.querySelector('#inputText');         //inputtext
let totalTask = document.querySelector('#tasknum');       //Total number of task
let listbox=document.querySelector('#list-section>ul');   //Unorder list

let categorybanner=document.querySelector('#list-head>span'); 


//let task=[];       //each elements of task must have id,boolean(completed)

let taskobj = {
    default:[]
}

let taskstorage = JSON.parse(localStorage.getItem('taskobj'));
let taskObj = taskstorage ? taskstorage : taskobj; 

//category set
let categoryChached = localStorage.getItem('categoryTask');
let category = categoryChached ? categoryChached : "default";

//make task as category

let task = taskObj[category];

let taskCatArray = Object.keys(taskObj);


async function tooglecat(x){

    let taskCatLength = taskCatArray.length;
    let taskindex = taskCatArray.indexOf(category);

    taskindex+=x;

    if(taskindex>=taskCatLength){
        taskindex=taskindex-taskCatLength;
    }else if(taskindex<0){
        taskindex=taskCatLength+taskindex;
    }

    
    changecat(taskCatArray[taskindex]);

    localStorage.setItem('categoryTask', category);
    categorybanner.innerText=category;
}

async function changecat(catnamed){

     //move to new category
     category=catnamed;
     task=taskObj[category];
     categorybanner.innerText=category;
     
 
     //refresh page
     refresh(task,'add');

}


async function createcat(catname){

    if (!taskObj[catname]) {
        taskObj[catname] = []; // If the category doesn't exist, create it
    }else{
        alert('task already created through this name');
    }

   
  changecat(catname);
 
  //refresh toogle data
  taskCatArray = Object.keys(taskObj);
  tooglecat(0);
   
}

all(); // to refresh all in local storage


function add(){ 
    // alert("Add button welcome");
   
    //fetch text from input
    let sentence = input.value;
    input.value='';
    
    //creating object
    let newtask = {
        text:sentence,
        id:Date.now().toString(),
        completed: false

    }
    //adding to task array
   
    task.push(newtask);
    //refresh
    refresh(task,'add');
}


function deleted(id){
    // remove the element from array which matches the corresponding id
    task = task.filter(t => t.id !== id);
    taskObj[category]=task;
    // refresh
    refresh(task,deleted);
    // refresh the task number
    setTimeout(refreshTaskNo(),20);
}


function toggleCheck(id){
    // find the task and mark it as completed
    let taskItem = task.find(t => t.id === id);
    if(taskItem) {
        taskItem.completed = !taskItem.completed;
        console.log(taskItem.completed);
    }
    console.log("check function working");
    // refresh
    refresh(task,'toggle');
    // refresh the task number
    refreshTaskNo();
}



function refresh(arr,path){

    listbox.innerHTML = '';
   
    categorybanner.innerText=category;

    // iterating task array for each operation.
    for(let i=0; i<arr.length; i++){
        
        //fetch object(text,id,completed) from arr array
        let eacharr = arr[i];


        //create li (add id of chechbox and delete as object's id )
        let list = document.createElement('li');
       
        if(!eacharr.completed){
        list.innerHTML = `
            <div id="${eacharr.id}" class="mycheckbox"></div>                   
            <div class="textline">${eacharr.text}</div>
            <button class="deleted" id="${eacharr.id}">X</button> 
        `;
        }else{
            list.innerHTML = `
            <div id="${eacharr.id}" class="mycheckbox checked"></div>                   
            <div class="textline">${eacharr.text}</div>
            <button class="deleted" id="${eacharr.id}">X</button> 
        `;
        }
        
      if(i===(arr.length-1)&& path=='add'){
       list.classList.add('fade-in');
      }else{
        list.classList.remove('fade-in');
      }
       
        //append in ul
        listbox.appendChild(list);

    }
    
    // refresh the task number
     refreshTaskNo();
     
     
    listHover();

    //refresh local storage
    localStorage.setItem('taskobj', JSON.stringify(taskObj));

}

function refreshTaskNo(){

    let taskNo=0;     // initialising taskno. value

   
    for(let i=0; i<task.length; i++){
          //fetch object(text,id,completed) from arr array
            let eachTask = task[i];
            if(eachTask.completed){
                taskNo++;
            }
           totalTask.innerText=taskNo;
     }
  
     totalTask.innerText=taskNo;
}





function all(){
    // refresh original task
    refresh(task,'all');
   
}

function uncompleted(){
    // filter task completed:false
    let uncompletedTasks = task.filter(t => t.completed);
    // refresh
    refresh(uncompletedTasks,'uncomp');

}

function completed(){
    // filter task completed:true
    let completedTasks = task.filter(t => !t.completed);
    // refresh
    refresh(completedTasks,'comp');
}

function allCompleted(){
    // filter task completed:true
    task.forEach(t => t.completed=true);
    // refresh
    refresh(task,'allcomp');
    refreshTaskNo();
    console.log("allcompleted function working");

}

function clearCompleted(){
    // clear completed:true
   let newtask= task.filter(t => !t.completed);
   task=newtask;
    // refresh
    refresh(task,'clearcomp');
    refreshTaskNo();
    console.log("clearcompleted function working");

}









function allInputClick(e){
   
    let key = e.key;
    let clicked = e.target;

    // Add button
      if(key =='Enter' || clicked.id == 'add'  ){
        if(input.value){
        add();
        console.log("add button clicked");
        }
      }
       

    // delete button
    if (clicked.className === 'deleted') {
        deleted(clicked.id);
    }
  
  
    //checkmark
    if (clicked.parentNode.tagName === 'LI' &&!clicked.classList.contains('deleted')) {
        let parent = clicked.parentNode;
        let checkbox = parent.querySelector('.mycheckbox');
        let id = checkbox.id;
        toggleCheck(id);
        console.log("li clicked");
      }

    //add category
    if(clicked.id === 'addnewcat'){

        if(input.value){

            createcat(input.value);

            input.value='';

        }


    }

    // toggle category
    if(clicked.id === 't-plus'){
       tooglecat(+1);
    }


    if(clicked.id === 't-minus'){
        tooglecat(-1); 
    }

   
    

    //All
    if(clicked.id === 'all'){
        console.log('all button working');    
        all();
    }

    //Uncompleted
    if(clicked.id === 'completed'){
        console.log('completed button working');   
        uncompleted(); 
    }

    //Completed
    if(clicked.id === 'uncompleted'){
        console.log('uncompleted button working'); 
        completed();   
    }

      console.log(clicked);

       //allCompleted
    if(clicked.id === 'allcompleted'){
        console.log('allcompleted button working'); 
        allCompleted();   
    }

    if(clicked.id === 'clearcompleted'){
        console.log('clearcompleted button working'); 
        clearCompleted();   
    }

      console.log(clicked);
}




function listHover(){
    // Define a media query string
    const mediaQuery786 =  window.matchMedia('(min-width: 768px)');


    if (mediaQuery786.matches) {
    // Get all the li elements
    const listItems = document.querySelectorAll('li');

    // Add a mouseover event listener to each li element
    listItems.forEach(item => {
    item.addEventListener('mouseover', () => {
        // Get the delete button for the current li element
        const deleteButton = item.querySelector('.deleted');
        // Set the display property of the delete button to block
        deleteButton.style.display = 'block';
    });
    item.addEventListener('mouseout', () => {
        // Get the delete button for the current li element
        const deleteButton = item.querySelector('.deleted');
        // Set the display property of the delete button to block
        deleteButton.style.display = 'none';
    });
    });

    }

}

document.addEventListener('click',allInputClick);
document.addEventListener('keydown',allInputClick);
