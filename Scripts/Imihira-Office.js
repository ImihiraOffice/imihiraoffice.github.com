
var signedIn = false;
var user = "Not Signed In";
var openFile = "File1";
var fileSaved = true;
var knownUsers;
var spellCheck = true;
var font = "Arial";
var fontSize = 16;

if (localStorage.getItem("knownUsers") != null) {
    knownUsers = localStorage.getItem("knownUsers");
} else {
    localStorage.setItem("knownUsers", "");
    knownUsers = "";
}

// Checks if the username exists - if not, create new account
function knownUser(username) {
    let users = knownUsers.split("`");
    let isKnown = false;

    for (let i = 0; i < users.length; ++i) {
        if (users[i] == username) {
            isKnown = true;
        }
    }
    return isKnown;
}

// Signs in the user - creates a new account if the specfied username does not exist
function sign() {
    if (!signedIn) {
        let username = prompt("Please enter a username");
        let password = prompt("Please enter a password");

        if (knownUser(username)) {
            if (password == localStorage.getItem(username).split("`")[0]) {
                signedIn = true;
                user = username;
                document.getElementById("sign").innerText = "Sign Out";
                document.getElementById("user-display").innerText = username;
            } else {
                alert("Invalid password!");
            }
        } else {
            knownUsers += username + "`";
            localStorage.setItem("knownUsers", knownUsers);
            localStorage.setItem(username, password + "`");
            signedIn = true;
            user = username;
            document.getElementById("sign").innerText = "Sign Out";
            document.getElementById("user-display").innerText = username;
        }
    } else {
        document.getElementById("page").value = "Welcome to Imihira Office!";
        signedIn = false;
        user = "Not Signed In";
        document.getElementById("sign").innerText = "Sign In";
        document.getElementById("user-display").innerText = "Not Signed In";
    }
}

// Tests if the user has the specified filename
function hasFile(filename) {
    let hasFile = false;
    let userData = localStorage.getItem(user).split("`");

    for (let i = 1; i < userData.length; ++i) {
        if (userData[i] == filename) {
            hasFile = true;
        }
    }
    return hasFile;
}

// Saves the current file - if the file has not been saved before, request a name. Else, save as default name
function save() {
    if (!signedIn) {
        alert("Please sign in first!");
    } else {
        if (hasFile(openFile)) {
            localStorage.setItem(user + "`" + openFile, font + "`" + fontSize + "`" + document.getElementById("page").value);
            document.getElementById("user-display").innerText = user + " - " + openFile;
            fileSaved = true;
        } else {
            let savename = prompt("Save file as");
            openFile = savename;
            localStorage.setItem(user, localStorage.getItem(user) + openFile + "`");
            document.getElementById("user-display").innerText = user + openFile;
            localStorage.setItem(user + "`" + openFile, font + "`" + fontSize + "`" + document.getElementById("page").value);
            document.getElementById("user-display").innerText = user + " - " + openFile;
            fileSaved = true;
        }
    }
}

// Tells the script that the file is unsaved
function unsave() {
    if (signedIn) {
        fileSaved = false;
        document.getElementById("user-display").innerText = user + " - " + openFile + " (unsaved changes)";
    } else {
        document.getElementById("page").value = "Welcome to Imihira Office!";
    }
}

// Creates a new blank file with the speficied title
function newFile() {
    if (!signedIn) {
        alert("Please sign in first!");
    } else {
        if (!fileSaved) {
            if (confirm("The open file has unsaved changes\nSave it first?")) {
                save();
            }
        }
        let fileName = prompt("New file name");
        if (hasFile(fileName)) {
            if (confirm("This file already exits!\nOverwrite it?")) {
                document.getElementById("page").value = "";
                openFile = fileName;
                localStorage.setItem(user, localStorage.getItem(user) + fileName + "`");
                document.getElementById("user-display").innerText = user + " - " + openFile;
            }
        }
        document.getElementById("page").value = "";
        openFile = fileName;
        document.getElementById("user-display").innerText = user + " - " + openFile;
        localStorage.setItem(user, localStorage.getItem(user) + fileName + "`");
    }
}

// Loads the specified file into the editor
function load() {
    if (!signedIn) {
        alert("Please sign in first!");
    } else {
        if (!fileSaved) {
            if (confirm("The open file has unsaved changes\nSave it first?")) {
                save();
            }
        }
        let filename = prompt("Filename to open");
        if (localStorage.getItem(user + "`" + filename) != null) {
            document.getElementById("page").value = localStorage.getItem(user + "`" + filename).split("`")[2];
            font = localStorage.getItem(user + "`" + filename).split("`")[0];
            fontSize = Number(localStorage.getItem(user + "`" + filename).split("`")[1]);
            openFile = filename;
            fileSaved = true;
            document.getElementById("user-display").innerText = user + " - " + openFile;
            document.getElementById("page").style.fontFamily = font;
        } else {
            alert("Could not find the file with name \"" + filename + "\"\nThe file might belong to another" +
                " user or the name is incorrect.");
        }
    }
}

// Recovers files
function recover() {
    if (user == "Not Signed In") {
        alert("Please sign in first!");
        return;
    }

    user_files = localStorage.getItem(user).split('`');
    alert(user_files);
}

// Toggles the spellchecker
function toggleSpellCheck() {
    if (spellCheck) {
        spellCheck = false;
        document.getElementById("page").spellcheck = false;
        document.getElementById("spellcheck").innerText = "Spellcheck: Off";
    } else {
        spellCheck = true;
        document.getElementById("page").spellcheck = true;
        document.getElementById("spellcheck").innerText = "Spellcheck: On";
    }
}

// Updates the font for the document
function updateFont() {
    font = document.getElementById("font").value;
    fontSize = document.getElementById("font-size").value;
    document.getElementById("page").style.fontFamily = font;
    document.getElementById("page").style.fontSize = fontSize;
}
