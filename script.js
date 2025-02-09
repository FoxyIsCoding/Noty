import { cloudSave, cloudReset, change } from "./firebase.js"
//variables
export let notes = []
export let doList = []
export let changes = []
let selectedNote = null

async function resetData() {
  if (await alertUser("What to delete all data?")) {
    cloudReset()
  }
}


//notes
export function loadNotes() {
  document.getElementById("notesList").innerHTML = ""
  for (let i = 0;i<notes.length;i++) {
    document.getElementById("notesList").innerHTML += `<div onclick="openNote(${i})"><span color="${notes[i].tag}" class="tagDot"></span><li draggable="true" ondblclick="removeNote()">${notes[i].title}</li></div>`
  }

  document.querySelectorAll("#notesList div").forEach(item => {
    item.addEventListener("dragstart", function(e) {
      e.dataTransfer.setData("text", notes.indexOf(notes.find(note => note.title === e.target.textContent)))
    })
    item.addEventListener("dragover", function(e) {
      e.preventDefault()
    })
    item.addEventListener("drop", function(e) {
      const draggedIndex = e.dataTransfer.getData("text")
      const droppedIndex = notes.indexOf(notes.find(note => note.title === e.target.textContent))
      const temp = notes[draggedIndex]
      notes[draggedIndex] = notes[droppedIndex]
      notes[droppedIndex] = temp
      selectedNote = droppedIndex
      change(["moveNote", draggedIndex, droppedIndex])
      loadNotes()
      cloudSave()
    })
  })
}
loadNotes()

function createNote() {
  document.getElementById("homePage").style.display = "none"
  document.getElementById("todo").style.display = "no"
  document.getElementById("createNote").style.display = "block"
  notes.unshift({title:"Untitled",note:"",tag:0})
  change(["createNote"])
  loadNotes()
  cloudSave()
  openNote(0)
}

function openNote(index) {
  document.getElementById("todo").style.display = "none"
  selectedNote = index
  if (selectedNote == null) {
    document.getElementById("createNote").style.display = "none"
    document.getElementById("homePage").style.display = "block"
    return
  }
  document.getElementById("homePage").style.display = "none"
  document.getElementById("createNote").style.display = "block"
  document.getElementById("titleDisplay").value = notes[selectedNote].title
  document.getElementById("contentDisplay").value = notes[selectedNote].note
  document.getElementById("tagDisplay").innerText = notes[selectedNote].tag == 0 ? "Unset" : notes[selectedNote].tag == 1 ? "Uneeded" : notes[selectedNote].tag == 2 ? "Important" : notes[selectedNote].tag == 3 ? "Urgent" : "Done"
}

async function removeNote() {
  if (selectedNote == null) return
  if (!await alertUser("Do you want to delete this note?") && notes.length > 0) {
    return;
  }

  document.getElementById("createNote").style.display = "none";
  notes.splice(selectedNote, 1);
  change(["removeNote", selectedNote])
  openNote(null);
  loadNotes();
  cloudSave()
}

function changeTag(item) {
  notes[selectedNote].tag += 1
  if (notes[selectedNote].tag > 4) {
    notes[selectedNote].tag = 0
  }
  if (notes[selectedNote].tag == 0) {item.innerText = "Unset"}
  else if (notes[selectedNote].tag == 1) {item.innerText = "Uneeded"}
  else if (notes[selectedNote].tag == 2) {item.innerText = "Important"}
  else if (notes[selectedNote].tag == 3) {item.innerText = "Urgent"}
  else if (notes[selectedNote].tag == 4) {item.innerText = "Done"}
  change(["changeTag", selectedNote, notes[selectedNote].tag])
  loadNotes()
  cloudSave()
}

document.getElementById("titleDisplay").addEventListener("dblclick", function() {
  this.removeAttribute("readonly") 
})

document.getElementById("titleDisplay").addEventListener("change", function() {
  notes[selectedNote].title = this.value
  this.setAttribute("readonly", true)
  change(["renameNote", selectedNote, notes[selectedNote].title])
  loadNotes()
  cloudSave()
})

document.getElementById("contentDisplay").addEventListener("input", function() {
  notes[selectedNote].note = this.value
  change(["editNote", selectedNote, notes[selectedNote].note])
  cloudSave()
})


//todo
export function loadTodo() {
  document.getElementById("todoList").innerHTML = ""
  for (let i = 0;i<doList.length;i++) {
    document.getElementById("todoList").innerHTML += `<div draggable="true"><i class="${doList[i].done ? "fa fa-check-square-o" : "fa fa-square-o"}"></i>${doList[i].name}</div>`
  }

  document.querySelectorAll("#todoList div").forEach((item,index)=>{
    item.addEventListener("dblclick",async function(){
      if (!await alertUser("Do you want to delete this task?")) return
      doList.splice(index,1)
      change(["removeTodo", index])
      cloudSave()
      loadTodo()
    })

    item.addEventListener("dragstart",function(e){
      e.dataTransfer.setData("text", index)
    })

    item.addEventListener("dragover",function(e){
      e.preventDefault()
    })

    item.addEventListener("drop",function(e){
      const draggedIndex = e.dataTransfer.getData("text");
      const droppedIndex = index;
      const temp = doList[draggedIndex];
      doList[draggedIndex] = doList[droppedIndex];
      doList[droppedIndex] = temp;
      change(["moveTodo", draggedIndex, droppedIndex])
      cloudSave()
      loadTodo()
    })
  })

  document.querySelectorAll("#todoList div i").forEach((item,index)=>{
    item.addEventListener("click",function(){
      doList[index].done = !doList[index].done
      change(["toggleTodo", index])
      cloudSave()
      loadTodo()
    })
  })
}

async function createTodo() {
  let name = await alertUser("Enter the name of the task",true,true)
  if (name) {
    doList.push({name:name,done:false})
    change(["createTodo"])
    cloudSave()
    loadTodo()
  }
}

document.querySelectorAll("#todoList div").forEach((item,index)=>{
  item.querySelector("i").addEventListener("click",function(){
    this.classList.toggle("fa-square-o")
    this.classList.toggle("fa-check-square-o")
  })
})

function openTodo() {
  document.getElementById("createNote").style.display = "none"
  document.getElementById("todo").style.display = "block"
  document.getElementById("homePage").style.display = "none"
}


//other
document.getElementById("search").addEventListener("input", function() {
  const query = this.value.toLowerCase();
  const notesList = document.getElementById("notesList");
  const notes = notesList.getElementsByTagName("div");

  if (query === "") {
    loadNotes()
  } else {
    for (let note of notes) {
      const noteText = note.textContent.toLowerCase();
      if (noteText.includes(query)) {
        note.style.display = "static";
      } else {
        note.style.display = "none";
      }
    }
  }
});

document.getElementById("keyboardBtn").addEventListener("click", async function () {
  await alertUser("Shortcuts: <br><br> New note: n <br> Todo List: t",false)
})


function alertUser(text, cancel = true, prompt = false) {
  return new Promise((resolve) => {
    document.getElementById("alertText").innerHTML = text;
    document.getElementById("alertWindow").style.display = "block";
    document.getElementById("alertCancel").style.display = cancel ? "block" : "none";
    document.getElementById("alertInput").style.display = prompt ? "block" : "none";
    document.getElementById("alertInput").value = "";
    document.getElementById("alertInput").focus();
    document.getElementById("alertWindow").animate([
      {transform: "translate(-50%,-50%) scale(0)"},
      {transform: "translate(-50%,-50%) scale(1)"}
    ],{
      duration: 100,
      fill: "forwards"
    });

    document.getElementById("alertOk").addEventListener("click", function handleOk() {
      document.getElementById("alertWindow").style.display = "none";
      if (prompt) {
        resolve(document.getElementById("alertInput").value);
      } else {
        resolve(true);
      }
      document.getElementById("alertOk").removeEventListener("click", handleOk);
    });

    document.getElementById("alertCancel").addEventListener("click", function handleCancel() {
      document.getElementById("alertWindow").style.display = "none";
      resolve(false);
      document.getElementById("alertCancel").removeEventListener("click", handleCancel);
    });
  });
}

// ------------------------------------------ Shortcuts ------------------------------------------


// TODO
document.addEventListener('keyup', function(event) {
  if (event.key === 't' && !document.activeElement.matches('input, textarea, select')) {
    openTodo()
  }
});


// NOTES
document.addEventListener('keydown', function(event) {
  if (event.key === 'n' && !document.activeElement.matches('input, textarea, select')) {
    createNote()
  }
});


// ------------------------------------------ Settings ------------------------------------------
document.getElementById("settingOpenBtn").addEventListener("click", function() {
  document.getElementById("settingScreen").style.display = "block"
  setTimeout(() => {
    document.addEventListener("click",function close(e) {
      if (e.target.id != "settingScreen") {
        document.getElementById("settingScreen").style.display = "none"
        document.removeEventListener("click",close)
      }
    })
  })
})


//window functions
window.createNote = createNote;
window.openNote = openNote;
window.removeNote = removeNote;
window.changeTag = changeTag;
window.openTodo = openTodo;
window.alertUser = alertUser;
window.resetData = resetData
window.createTodo = createTodo