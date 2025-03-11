import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getFirestore, getDoc, doc, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { loadNotes, notes, doList, loadTodo, changes } from "./script.js"
import { firebaseConfig } from "./auth.js"

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

document.getElementById("profile").addEventListener("click", function() {
    if (auth.currentUser) {
        auth.signOut();
    } else {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider);
    }
});

auth.onAuthStateChanged(async (user) => {
    if (user) {
        const photo = new Image()
        photo.src = user.photoURL
        document.getElementById("profile").innerHTML = `<i class="fa fa-sign-in fa-2xl"></i>`;
        photo.onload = () => {
            document.getElementById("profile").innerHTML = `<img src="${user.photoURL}">`;
        }
        loadChanges()
    } else {
        document.getElementById("profile").innerHTML = `<i class="fa fa-user fa-2xl"></i>`;
    }
    loadData()
    loadNotes()
    loadTodo()
});

export function cloudSave() {
    localStorage.setItem("notesApp", JSON.stringify({notes:notes,todo:doList,changes:changes}))
    if (!auth.currentUser) {
        return
    }
    setDoc(doc(db,"users",auth.currentUser.uid),{
        notes: notes,
        todo: doList
    })
}

export function cloudReset() {
    localStorage.removeItem("notesApp")
    deleteDoc(doc(db,"users",auth.currentUser.uid))
    location.reload()
}

export async function loadData() {
    if (auth.currentUser) {
        const cloudData = await getDoc(doc(db,"users",auth.currentUser.uid))
        if (cloudData.exists()) {
            notes.length = 0
            notes.push(...cloudData.data().notes)
            doList.length = 0
            doList.push(...cloudData.data().todo)
        }
    } else {
        const localData = JSON.parse(localStorage.getItem("notesApp"))
        if (!localData) {
            return
        }
        notes.length = 0
        notes.push(...localData.notes)
        doList.length = 0
        doList.push(...localData.todo)
        changes.length = 0
        changes.push(...localData.changes)
    }
    loadNotes()
    loadTodo()
}

export function change(value) {
    if (auth.currentUser) {return}
    changes.unshift(value)
    cloudSave()
}

function loadChanges() {
    for (let i = 0;i<changes.length;i++) {
        if (changes[i][0] === "createNote") {
            notes.unshift({
                title:"Untitled",
                note:"",
                tag:0
            })
            loadNotes()
            cloudSave()
        } else if (changes[i][0] === "createTodo") {
            doList.unshift({
                name:"",
                done:false
            })
            loadTodo()
            cloudSave()
        } else if (changes[i][0] === "removeNote") {
            notes.splice(changes[i][1],1)
            loadNotes()
            cloudSave()
        } else if (changes[i][0] === "removeTodo") {
            doList.splice(changes[i][1],1)
            loadTodo()
            cloudSave()
        } else if (changes[i][0] === "renameNote") {
            notes[changes[i][1]].title = changes[i][2]
            loadNotes()
            cloudSave()
        } else if (changes[i][0] === "toggleTodo") {
            doList[changes[i][1]].done = !doList[changes[i][1]].done
            loadTodo()
            cloudSave()
        } else if (changes[i][0] === "editNote") {
            notes[changes[i][1]].note = changes[i][2]
            loadNotes()
            cloudSave()
        } else if (changes[i][0] === "changeTag") {
            notes[changes[i][1]].tag = changes[i][2]
            loadNotes()
            cloudSave()
        } else if (changes[i][0] === "moveTodo") {
            const temp = doList[changes[i][1]]
            doList[changes[i][1]] = doList[changes[i][2]]
            doList[changes[i][2]] = temp
            loadTodo()
            cloudSave()
        } else if (changes[i][0] === "moveNote") {
            const temp = notes[changes[i][1]]
            notes[changes[i][1]] = notes[changes[i][2]]
            notes[changes[i][2]] = temp
            loadNotes()
            cloudSave()
        } else if (changes[i][0] === "pinNote") {
            notes[changes[i][1]].pinned = changes[i][2]
        }
    }
    changes.length = 0
}