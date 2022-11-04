let appElm = document.getElementById("app");
let appElmBounding = appElm.getBoundingClientRect();
let boxElm = document.getElementById("box");
let boxElmBounding = boxElm.getBoundingClientRect();
let gClickedPos = { x: null, y: null }; // Box相対のクリック座標

let gMouseMgr = {
  isMouseDown: false,
  isDragging: false,
  threshold: 5,
  direction: undefined
};


boxElm.addEventListener("mousedown", onMouseDown);
boxElm.addEventListener("touchstart", onMouseDown);

document.addEventListener("mousemove", onMouseMove);
document.addEventListener("touchmove", onMouseMove);

document.addEventListener("mouseup", onMouseUp);
document.addEventListener("touchend", onMouseUp);


function onMouseDown(e) {
  boxElmBounding = boxElm.getBoundingClientRect();
  let mousePos = {clientX: null, clientY: null};
  switch (e.type) {
    case "mousedown":
      mousePos = {clientX: e.x, clientY: e.y};
      break;
    case "touchstart":
      mousePos = {clientX: e.touches[0].clientX, clientY: e.touches[0].clientY};
      break;
  }
  gClickedPos = { x: mousePos.clientX - boxElmBounding.x, y: mousePos.clientY - boxElmBounding.y };
  gMouseMgr.isMouseDown = true;
}


function onMouseMove(e) {
  if (gMouseMgr.isMouseDown) {
    let mousePos = {clientX: null, clientY: null};
    switch (e.type) {
      case "mousemove":
        mousePos = {clientX: e.x, clientY: e.y};
        break;
      case "touchmove":
        mousePos = {clientX: e.touches[0].clientX, clientY: e.touches[0].clientY};
        break;
    }
    if (!gMouseMgr.isDragging) {
      gMouseMgr.direction = dragStartCk(mousePos);
      if (gMouseMgr.direction !== false) {
        gMouseMgr.isDragging = true;
      }
    }
    else {
      switch (gMouseMgr.direction) {
        case 1:
        case 3:
          boxElm.style.left = mousePos.clientX - appElmBounding.x - gClickedPos.x + "px";
          break;
        case 0:
        case 2:
          boxElm.style.top = mousePos.clientY - appElmBounding.y - gClickedPos.y + "px";
        }
    }
  }
}


function onMouseUp(e) {
  gMouseMgr.isMouseDown = false;
  gMouseMgr.isDragging = false;
}


/**
 * dragがはじまった時、ドラッグの方向を判定する
 * @param {*} mousePos 
 * @returns 
 */
function dragStartCk(mousePos) {
  let deltaX = gClickedPos.x - (mousePos.clientX - boxElmBounding.x);
  let deltaY = gClickedPos.y - (mousePos.clientY - boxElmBounding.y);
  let direction = false;

  if (Math.abs(deltaX) >= Math.abs(deltaY)) {
    if (Math.abs(deltaX) > gMouseMgr.threshold) {
      if (deltaX > 0) {
        direction = 3;
      }
      else {
        direction = 1;
      }
    }
  }
  else {
    if (Math.abs(deltaY) > gMouseMgr.threshold) {
      if (deltaY > 0) {
        direction = 0;
      }
      else {
        direction = 2;
      }
    }
  }
  return(direction);
}
