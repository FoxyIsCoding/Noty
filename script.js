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
    document.getElementById("notesList").innerHTML += `<li ondblclick="removeNote()" onclick="openNote(${i})">${notes[i].title}</li>`
  }
}
loadNotes()

function createNote() {
  document.getElementById("todo").style.display = "no"
  document.getElementById("createNote").style.display = "block"
  notes.unshift({"title":"Untitled","note":""})
  loadNotes()
  save()
  openNote(0)
}

function openNote(index) {
  document.getElementById("todo").style.display = "none"
  selectedNote = index
  if (selectedNote == null) {
    document.getElementById("createNote").style.display = "none"
    return
  }
  document.getElementById("createNote").style.display = "block"
  document.getElementById("titleDisplay").value = notes[selectedNote].title
  document.getElementById("contentDisplay").value = notes[selectedNote].note
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
})