
const styles: string[] = ["version1Style.css", "version2Style.css"]


function changeStyle(styleNumber:number) {
  let style: HTMLElement | null = document.getElementById("linkToStyleChange");
  if (style == null) {
    return;
  }

  style.setAttribute("href", `styles/${styles[styleNumber]}`);
}

function makeLinkForStyleChange(styleNumber:number){

  let link = document.createElement("a");
  link.addEventListener("click", () => changeStyle(styleNumber));
  link.innerText = `Style ${styleNumber + 1}`;
  link.style.minHeight = "2vh";
  let footer : HTMLCollectionOf<HTMLElement> = document.getElementsByTagName("footer");
  if (footer[0] == null) {
    return;
  }
  footer[0].appendChild(link);
  footer[0].appendChild(document.createElement("br"));


}

window.onload = function () {
  for (let i = 0; i < styles.length; i++) {
    makeLinkForStyleChange(i);
  }
}



