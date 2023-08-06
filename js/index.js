const dataTotal = []
const EVENT_RENDER = 'render'
const STORAGE_KEY = 'TODO_APPS'
const SAVED_EVENT = 'saved-todo'




document.addEventListener('DOMContentLoaded',function(){

    function isStorageExist()/* boolean */{
        if(typeof Storage == 'undefined'){
            alert('browser tidak mendukung localStorage')
            return false
        }
        return true
    }

    window.addEventListener('load',()=>{
        document.dispatchEvent(new Event(EVENT_RENDER))
    })

    if(isStorageExist()){
        collectDataFromStorage()
    }

    function collectDataFromStorage(){
        const serializedData = localStorage.getItem(STORAGE_KEY);
        let data = JSON.parse(serializedData);
       
        if (data !== null) {
          for (const todo of data) {
            dataTotal.push(todo);
          }
        }
       
        document.dispatchEvent(new Event(EVENT_RENDER));
    }

    document.addEventListener(SAVED_EVENT,()=>{})



    function saveData(){
        if (isStorageExist()) {
            const parsed = JSON.stringify(dataTotal)
            localStorage.setItem(STORAGE_KEY, parsed);
            document.dispatchEvent(new Event(SAVED_EVENT));
        }
    }

    function generateId(){
        return +new Date();
    }
    function generatePost(obj){
        const createHeader = document.createElement("h2");
        createHeader.innerText = obj.title

        const createDue = document.createElement("p")
        createDue.innerText = obj.timestamp
         
        const textContainer = document.createElement('div');
        textContainer.classList.add('inner');
        textContainer.append(createHeader, createDue);


        const createItems = document.createElement('div')
        createItems.classList.add('item' , 'shadow')
        createItems.setAttribute('id',obj.id)



        if(obj.isCompleted){
            const createAction = document.createElement("img")
            createAction.setAttribute('src','./assets/undo-ouline.svg')
            const createTrash = document.createElement("img")
            createTrash.setAttribute('src','./assets/trash-outline.svg')

            

            
            const createActContainer = document.createElement('div')
            createActContainer.classList.add('action')
            createActContainer.setAttribute('id',"complete-"+obj.id)
            createActContainer.append(createAction,createTrash)
            createItems.append(textContainer,createActContainer)


            createAction.addEventListener('click',()=>{
                obj.isCompleted = false;
                document.dispatchEvent(new Event(EVENT_RENDER))
                saveData();
            })

            createTrash.addEventListener('click',()=>{
                const list = dataTotal.filter(val=>{
                    return val.id != obj.id
                })
                dataTotal.length = 0
                list.forEach(ret=>{
                    dataTotal.push(ret)
                })
                document.dispatchEvent(new Event(EVENT_RENDER));
                saveData()
            })
        }else{
            const createAction = document.createElement("img")
            createAction.setAttribute('src','./assets/check-outline.svg')
            
            createAction.addEventListener('click',()=>{
                obj.isCompleted = true;
                document.dispatchEvent(new Event(EVENT_RENDER))
                saveData()
            })

            const createActContainer = document.createElement('div')
            createActContainer.classList.add('action')
            createActContainer.setAttribute('id',"complete-"+obj.id)
            createActContainer.appendChild(createAction)
            createItems.append(textContainer,createActContainer)
        }
        

        
        return createItems

    }
        function addTodo(){
        const title = document.getElementById('title').value;
        const timestamp = document.getElementById('date').value;
        const getId = generateId()
        const data = {
            'id' : getId,
            'title' : title,
            'timestamp' : timestamp,
            'isCompleted' : false
        }
        dataTotal.push(data)
        document.dispatchEvent(new Event(EVENT_RENDER));
        saveData()
    }

    document.addEventListener(EVENT_RENDER,function(){

        const unCompletedTODOList = document.getElementById('todos')
        unCompletedTODOList.innerHTML = ""

        const completedTODOList = document.getElementById('finished')
        completedTODOList.innerHTML = ""
        dataTotal.forEach(element => {
            if(!element.isCompleted){ 
                unCompletedTODOList.append(generatePost(element))   
            }else{
                completedTODOList.append(generatePost(element))   
            }
        });
    })


    const submit = document.getElementById('form')

    submit.addEventListener('submit', (ev) => {
        addTodo()
        ev.preventDefault();
    });

   
})
