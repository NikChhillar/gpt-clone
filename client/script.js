import bot from "./assets/bot.svg";
import user from "./assets/user.svg";

const form = document.querySelector("form");
const chatCon = document.querySelector("#chat_container");
let loadInterval;

//
function loader(el) {
  el.textContent = "";

  loadInterval = setInterval(() => {
    el.textContent += ".";

    if (el.textContent === "....") {
      el.textContent = "";
    }
  }, 350);
}

//
function typeText(el, text) {
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length) {
      el.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 25);
}

//
function generateUniqueId() {
  const timestamp = Date.now();
  const randomNo = Math.random();
  const hexadecimalString = randomNo.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

//
function chatStripe(isAi, value, uniqueId) {
  return `
        <div class="wrapper ${isAi && "ai"}">
            <div class="chat">
                <div class="profile">
                    <img 
                      src=${isAi ? bot : user} 
                      alt="${isAi ? "bot" : "user"}" 
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
    `;
}

//
const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);
  chatCon.innerHTML += chatStripe(false, data.get("prompt"));

  form.reset();

  const uniqueId = generateUniqueId();
  chatCon.innerHTML += chatStripe(true, "", uniqueId);

  chatCon.scrollTop = chatCon.scrollHeight;

  const msgDiv = document.getElementById(uniqueId);
  loader(msgDiv);

  //
  const response = await fetch("https://gpt-clone-54sf.onrender.com/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: data.get("prompt"),
    }),
  });

  clearInterval(loadInterval);
  msgDiv.innerHTML = " ";

  if (response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim();

    typeText(msgDiv, parsedData);
  } else {
    const err = await response.text();

    msgDiv.innerHTML = "Something went wrong";
    alert(err);
  }
};

//
form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    handleSubmit(e);
  }
});
