//variables
let notes = []
let selectedNote = null
let doList = []


//save & load
let data = {
  notes: [],
  todo: []
}

if (localStorage.getItem("notes")) {
  data = JSON.parse(localStorage.getItem("notes"))
  notes = data.notes
  doList = data.todo
}

function save() {
  data.notes = notes
  data.todo = doList
  localStorage.setItem("notes", JSON.stringify(data))
}


//functions
function loadNotes() {
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
      loadNotes()
      save()
    })
  })
}
loadNotes()

function createNote() {
  document.getElementById("homePage").style.display = "none"
  document.getElementById("todo").style.display = "no"
  document.getElementById("createNote").style.display = "block"
  notes.unshift({"title":"Untitled","note":"","tag":0})
  loadNotes()
  save()
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
  if (!await alertUser("Do you whant to delete this note?") && notes.length > 0) {
    return;
  }

  document.getElementById("createNote").style.display = "none";
  notes.splice(selectedNote, 1);
  openNote(null);
  loadNotes();
  save();
}

function loadTodo() {
  document.getElementById("todoList").innerHTML = ""
  for (let i = 0;i<doList.length;i++) {
    document.getElementById("todoList").innerHTML += `<div draggable="true"><i class="${doList[i][0] ? "fa fa-check-square-o" : "fa fa-square-o"}"></i>${doList[i][1]}</div>`
  }

  document.querySelectorAll("#todoList div").forEach((item,index)=>{
    item.addEventListener("dblclick",function(){
      doList.splice(index,1)
      loadTodo()
      save()
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
      loadTodo();
      save();
    })
  })

  document.querySelectorAll("#todoList div i").forEach((item,index)=>{
    item.addEventListener("click",function(){
      doList[index][0] = !doList[index][0]
      loadTodo()
      save()
    })
  })
}
loadTodo()

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
  loadNotes()
  save()
}

document.getElementById("titleDisplay").addEventListener("dblclick", function() {
  this.removeAttribute("readonly") 
})

document.getElementById("titleDisplay").addEventListener("change", function() {
  notes[selectedNote].title = this.value
  this.setAttribute("readonly", true)
  loadNotes()
  save()
})

document.getElementById("contentDisplay").addEventListener("change", function() {
  notes[selectedNote].note = this.value
  save()
})

document.querySelectorAll("#todoList div").forEach((item,index)=>{
  item.querySelector("i").addEventListener("click",function(){
    this.classList.toggle("fa-square-o")
    this.classList.toggle("fa-check-square-o")
  })
})

document.getElementById("todoAdd").addEventListener("click", async function() {
  let name = await alertUser("Enter the name of the task",true,true)
  if (name) {
    doList.push([false,name])
    loadTodo()
    save()
  }
});

async function resetLocalStorage() {
  const firstConfirmation = await alertUser("This will delete all stored data in your browser. Do you want to proceed?");
  
  if (firstConfirmation) {
      const secondConfirmation = await alertUser("Are you sure you want to delete all data?");
      
      if (secondConfirmation) {
          localStorage.removeItem("notes");
          await alertUser("Data was deleted",false)
          location.reload();
      } else {
          await alertUser("Action cancelled.",false);
      }
  } else {
      await alertUser("Action cancelled.",false);
  }
}

document.getElementById("openDoList").addEventListener("click", function() {
  document.getElementById("createNote").style.display = "none"
  document.getElementById("todo").style.display = "block"
  document.getElementById("homePage").style.display = "none"
})

function openTodo() {
  document.getElementById("createNote").style.display = "none"
  document.getElementById("todo").style.display = "block"
  document.getElementById("homePage").style.display = "none"
}

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
  await alertUser("Shortcuts: <br> New note: nothing",false)
})


function alertUser(text, cancel = true, prompt = false) {
  return new Promise((resolve) => {
    document.getElementById("alertText").innerHTML = text;
    document.getElementById("alertWindow").style.display = "block";
    document.getElementById("alertCancel").style.display = cancel ? "block" : "none";
    document.getElementById("alertInput").style.display = prompt ? "block" : "none";
    document.getElementById("alertInput").value = "";
    document.getElementById("alertInput").focus()
    document.getElementById("blur").style.display = "block"
    document.getElementById("alertWindow").animate([
      {transform: "translate(-50%,-50%) scale(0)"},
      {transform: "translate(-50%,-50%) scale(1)"}
    ],{
      duration: 100,
      fill: "forwards"
    })

    document.getElementById("alertOk").addEventListener("click", function handleOk() {
      document.getElementById("alertWindow").style.display = "none";
      document.getElementById("blur").style.display = "none"
      if (prompt) {
        resolve(document.getElementById("alertInput").value);
      } else {
        resolve(true);
      }
      document.getElementById("alertOk").removeEventListener("click", handleOk);
    });

    document.getElementById("alertCancel").addEventListener("click", function handleCancel() {
      document.getElementById("alertWindow").style.display = "none";
      document.getElementById("blur").style.display = "none"
      resolve(false);
      document.getElementById("alertCancel").removeEventListener("click", handleCancel);
    });
  });
}