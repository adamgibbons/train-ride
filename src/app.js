const buttons = document.querySelectorAll("button")
const app = document.querySelector("#train-ride")

app.addEventListener("switch", (e) => {
  const { name, category } = e.detail

  document
    .querySelectorAll(`button[data-category=${category}]`)
    .forEach((b) => b.classList.remove("selected"))

  document.querySelector(`button[name=${name}]`).classList.add("selected")
})

buttons.forEach((button) =>
  button.addEventListener("click", (event) => {
    button.classList.remove("selected");

    if (event.target.attributes["name"].value === button.getAttribute("name")) {
      button.classList.add("selected");
    }

    const switchEvent = new CustomEvent("switch", {
      detail: {
        name: event.target.attributes["name"].value,
        category: event.target.attributes["data-category"].value
      }
    });

    app.dispatchEvent(switchEvent)
  })
)
