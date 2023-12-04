
const login       = document.querySelector(".login");
const loginForm   = login.querySelector(".login__form");
const loginInput  = login.querySelector(".login__input");


const chat        = document.querySelector(".chat");
const chatForm    = chat.querySelector(".chat__form");
const chatInput   = chat.querySelector(".chat__input");

const chatMessage = document.querySelector(".chat__messages")

const colors = [
    "cadetblue",
    "darkgoldenrod",
    "cornflowerblue",
    "darkkhaki",
    "hotpink",
    "gold"
]

const user = {
    id: "",
    name: "",
    color: ""
}

let websocket //criando variavel para conexão com servidor


const createMessageSelf = (content) =>{
    const div = document.createElement('div');
    const divChild = document.createElement('div');
    const spanTime = document.createElement('span');
    //date
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    //

    div.classList.add('message--self');

    divChild.classList.add('headerMessage');
    divChild.innerHTML = content;
    
    spanTime.classList.add('time');
    spanTime.innerHTML = `${hours}:${minutes}`;

    divChild.appendChild(spanTime);
    div.appendChild(divChild);

    return div
}

const createMessageOther = (content, sender, senderColor) => {
    const div = document.createElement('div');
    const span = document.createElement('span');
    const divChild = document.createElement('div');
    const spanTime = document.createElement('span');
    //date
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    //

    div.classList.add('message--other');

    divChild.classList.add('headerMessage');
  
    span.classList.add('message--sender');
    span.style.color = senderColor;
    span.innerHTML = sender;

    spanTime.classList.add('time');
    spanTime.innerHTML = `${hours}:${minutes}`;

    divChild.appendChild(span);
    divChild.appendChild(spanTime);

    div.appendChild(divChild);
    div.innerHTML += content;

    return div
}
const processMessage = ({ data }) => {
    const { userID, userName, userColor, content } = JSON.parse(data);

    const message = (userID == user.id) ?  createMessageSelf(content)  :  createMessageOther(content, userName, userColor) ;    

    chatMessage.append(message);

    console.log(JSON.parse(data));
}

const sendMessage = (event) => {
    event.preventDefault();

    const message = {
        userID    : user.id,
        userName  : user.name,
        userColor : user.color,
        content   : chatInput.value
    }

    websocket.send(JSON.stringify(message));
    chatInput.value = '';
}
const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex]
}

const handleLogin = (event) =>{
    event.preventDefault();

    user.id = crypto.randomUUID(); //Gerando random ID
    user.name = loginInput.value;
    user.color = getRandomColor();

    console.log(user);

    login.style.display = "none";
    chat.style.display = "flex";

    websocket = new WebSocket('ws://localhost:8080');
    websocket.onmessage = processMessage;
}

window.addEventListener("load", () =>{

loginForm.addEventListener("submit", handleLogin);
chatForm.addEventListener("submit", sendMessage);

})
