interface Person {
    firstName: string;
    lastName: string;
}

function iGreeter(person: Person){
    return "Hello, " + person.firstName + " " + person.lastName;
}

let userObj = {firstName: "Jane", lastName: "User"};

window.onload = function(){
    document.body.innerHTML = iGreeter(userObj);
};