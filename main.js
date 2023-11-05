document.addEventListener('DOMContentLoaded', function () {
  let map = L.map('map').setView([53.001, 53.001], 13);
  let permission = Notification.requestPermission();
  L.tileLayer.provider('Esri.WorldImagery').addTo(map)

  document.getElementById("locationButton").addEventListener('click', function () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;
        map.setView([lat, lng], 13);
      });
    }
  });

  document.getElementById("saveRasterButton").addEventListener("click", function () {
    leafletImage(map, function (err, canvas) {
      // here we have the canvas
      let puzzlePiecesDiv = document.getElementById("puzzlePieces");
      puzzlePiecesDiv.innerHTML = "";
      let z = 0
      let width = canvas.width / 4;
      let height = canvas.height / 4;
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {

          let piece = document.createElement("canvas");
          piece.id = "piece" + z;
          piece.width = width;
          piece.height = height;
          piece.getContext("2d").drawImage(canvas, j * width, i * height, width, height, 0, 0, width, height);
          piece.draggable = true;
          piece.addEventListener("dragstart", function (event) {
            this.style.border = "5px dashed #D8D8FF";
            event.dataTransfer.setData("text", this.id);
          });

          piece.addEventListener("dragend", function (event) {
            this.style.borderWidth = "0";
          });
          puzzlePiecesDiv.appendChild(piece);
          z++;
        }
      }
      drawDraggableDivs(width, height);
    });
  });

  async function checkIfPuzzleIsSolved() {
    let puzzlePiecesDiv = document.getElementById("puzzle");
    let puzzlePieces = puzzlePiecesDiv.getElementsByTagName("canvas");
    let solved = true;
    if (puzzlePieces.length !== 16) {
      return;
    }
    for (let i = 0; i < puzzlePieces.length; i++) {
      if (puzzlePieces[i].id !== "piece" + i) {
        solved = false;
        break;
      }
    }
    if (solved) {
      puzzlePiecesDiv.textContent = "Congratulations! You solved the puzzle!";
      puzzlePiecesDiv.style.display = "inline-block";
      puzzlePiecesDiv.style.textAlign = "center";
      puzzlePiecesDiv.style.background = "grey";
      if ("Notification" in window) {
        permission.then(function (result) {
          if (result === "granted") {
            new Notification("Congratulations! You solved the puzzle!");
          }
        });
      }
    }
  }

  function drawDraggableDivs(width, height) {
    let puzzlePiecesDiv = document.getElementById("puzzle");
    puzzlePiecesDiv.innerHTML = "";
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {

        let piece = document.createElement("div");
        piece.className = "drag";
        piece.style.width = width + "px";
        piece.style.height = height + "px";
        piece.style.border = "1px dashed #D8D8FF";
        piece.style.display = "inline-block";
        piece.addEventListener("dragenter", function (event) {
          this.style.border = "1px solid #7FE9D9";
        });
        piece.addEventListener("dragleave", function (event) {
          this.style.border = "1px dashed #7f7fe9";
        });
        piece.addEventListener("dragover", function (event) {
          event.preventDefault();
        });
        piece.addEventListener("drop", function (event) {
          //if we have element in this div, we don't want to drop another one
          if (this.getElementsByTagName("canvas").length > 0) {
            document.getElementById("puzzlePieces").appendChild(this.getElementsByTagName("canvas")[0]);
            this.innerHTML = "";
          }
          let myElement = document.querySelector("#" + event.dataTransfer.getData("text"));
          this.appendChild(myElement)
          checkIfPuzzleIsSolved();
        }, false);
        puzzlePiecesDiv.appendChild(piece);

      }
    }
  }
});


