function account(){
console.log(document.getElementById("user").value);
console.log(document.getElementById("pass").value);
}

document.getElementById("login").onclick = function() {account()};
