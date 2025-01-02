//variables
let notes = []
let selectedNote = null


//save & load
let data = {
  notes: []
}

if (localStorage.getItem("notes")) {
  data = JSON.parse(localStorage.getItem("notes"))
  notes = data.notes
}

function save() {
  data.notes = notes
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
  document.getElementById("createNote").style.display = "block"
  notes.unshift({"title":"Untitled","note":""})
  loadNotes()
  save()
  openNote(0)
}

function openNote(index) {
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
  if (!confirm("Delete?") && notes.length > 0) {return}
  document.getElementById("createNote").style.display = "none"
  notes.splice(selectedNote, 1)
  selectedNote = null
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