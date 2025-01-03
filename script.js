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
    document.getElementById("notesList").innerHTML += `<span color="${notes[i].tag}" class="tagDot"></span><li draggable="true" ondblclick="removeNote()" onclick="openNote(${i})">${notes[i].title}</li>`
  }

  document.querySelectorAll("#notesList li").forEach(item => {
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

function removeNote() {
  if (!confirm("Do you want to delete this note?") && notes.length > 0) {
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
    document.getElementById("todoList").innerHTML += `<div><i class="${doList[i][0] ? "fa fa-check-square-o" : "fa fa-square-o"}"></i>${doList[i][1]}</div>`
  }

  document.querySelectorAll("#todoList div").forEach((item,index)=>{
    item.addEventListener("dblclick",function(){
      doList.splice(index,1)
      loadTodo()
      save()
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
  this.onchange = function() {
    notes[0].title = this.value
    loadNotes()
    this.setAttribute("readonly", true)
    save()
  }
})

document.getElementById("contentDisplay").addEventListener("change", function() {
  notes[0].note = this.value
  save()
})

document.querySelectorAll("#todoList div").forEach((item,index)=>{
  item.querySelector("i").addEventListener("click",function(){
    this.classList.toggle("fa-square-o")
    this.classList.toggle("fa-check-square-o")
  })
})

document.getElementById("todoAdd").addEventListener("click", function() {
  let name = prompt("Enter a new todo:")
  if (name) {
    doList.push([false,name])
    loadTodo()
    save()
  }
});

function resetLocalStorage() {
  const firstConfirmation = confirm("Are you sure you want to reset your local storage? This action cannot be undone.");
  
  if (firstConfirmation) {
      const secondConfirmation = confirm("This will delete all stored data in your browser. Do you want to proceed?");
      
      if (secondConfirmation) {
          localStorage.removeItem("notes");
          alert("Local storage has been reset.");
          location.reload();
      } else {
          alert("Action cancelled.");
      }
  } else {
      alert("Action cancelled.");
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
  const notes = notesList.getElementsByTagName("li");

  if (query === "") {
    for (let note of notes) {
      note.style.display = "block";
    }
  } else {
    for (let note of notes) {
      const noteText = note.textContent.toLowerCase();
      if (noteText.includes(query)) {
        note.style.display = "block";
      } else {
        note.style.display = "none";
      }
    }
  }
});