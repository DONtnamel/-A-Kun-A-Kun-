function setStyle(d, styleObjest) {
  for (const key in styleObjest) {
    d["style"][key] = styleObjest[key];
  }
  d["style"]["transition"] = ".225s";
}

function randomPosition(min, max) {
  return randomKey(min, max);
}

function randomKey(min, max) {
  return parseInt(Math.random() * (max - min + 1) + min);
}

function randomSort(a, b) {
  return Math.random() > 0.5 ? -1 : 1;
}

const app = document.querySelector("#app");

const $width = 50;
const $height = 50;

const BlockNums = 3;
const allBlock = [];
const IMGS = [
  "./img/1.jpg",
  "./img/2.jpg",
  "./img/3.jpg",
  "./img/4.jpg",
  "./img/5.jpg",
  "./img/6.jpg",
  "./img/7.jpg",
];

let gameOver = false;

function calPosition() {
  const { x, y } = app.getBoundingClientRect();
  const AppPosition = {
    x,
    y,
    drawStartX: 20,
    drawStartY: 20,
    drawEndX: app.offsetWidth - 70,
    drawEndY: app.offsetHeight - 200,
  };
  return AppPosition;
}
const AppPosition = calPosition();
const hasBlockArr = [];

var storageBoxPosition;
var startLeft;

function computedBoxPosition(target, targetDomClass) {
  setStyle(target, {
    zIndex: 9999,
  });
  const Item = { target, targetDomClass };
  storageBoxPosition = storageBox.getBoundingClientRect();
  startLeft = storageBoxPosition.x - AppPosition.x + 10;
  const top = storageBoxPosition.y - AppPosition.y + 10 + "px";
  if (!hasBlockArr.length) {
    setStyle(target, {
      left: startLeft + "px",
      top,
    });
    targetDomClass.left = startLeft;
    hasBlockArr.push(Item);
  } else {
    const hasIndex = hasBlockArr.findIndex((v) => {
      return v.targetDomClass.n == targetDomClass.n;
    });
    if (hasIndex === -1) {
      const left = startLeft + hasBlockArr.length * targetDomClass.width;
      setStyle(target, {
        left: left + "px",
        top,
      });
      targetDomClass.left = left;
      hasBlockArr.push(Item);
    } else {
      for (let index = hasBlockArr.length - 1; index >= hasIndex; index--) {
        const newleft = startLeft + (index + 1) * $width;
        setStyle(hasBlockArr[index].target, {
          left: newleft + "px",
        });
        hasBlockArr[index].targetDomClass.left = newleft;
      }
      setStyle(target, {
        left: startLeft + hasIndex * targetDomClass.width + "px",
        top,
      });
      targetDomClass.left = startLeft + hasIndex * targetDomClass.width;
      hasBlockArr.splice(hasIndex, 0, Item);
    }
  }
  Item.target.classList.remove("noSelect");
  Item.target.classList.add("isSelect");
  const removeIndex = allBlock.findIndex((v) => {
    return v.index === Item.targetDomClass.index;
  });
  allBlock.splice(removeIndex, 1);
  const noSelect = document.querySelectorAll(".noSelect");
  for (let i = 0; i < noSelect.length; i++) {
    app.removeChild(noSelect[i]);
  }
  allBlock.forEach((item) => {
    app.appendChild(item.draw());
  });
}

function GameState() {
  if (hasBlockArr.length === 7) {
    alert("寄寄寄几你实在是台妹~~~~");
    gameOver = true;
  }
  if (!allBlock.length && !hasBlockArr.length) {
    alert("哎哟你干嘛呵哈哈哟~~~");
    gameOver = true;
  }
  if (gameOver) {
    window.location.reload(false);
  }
}

function checkBox() {
  const checkMap = {};
  hasBlockArr.forEach((item, index) => {
    if (!checkMap[item.targetDomClass.n]) {
      checkMap[item.targetDomClass.n] = [];
    }
    checkMap[item.targetDomClass.n].push({
      index: index,
      id: item.targetDomClass.index,
    });

    for (const key in checkMap) {
      if (checkMap[key].length === 3) {
        hasBlockArr.splice(checkMap[key][0].index, 3);
        setTimeout(() => {
          checkMap[key].forEach((item) => {
            var box = document.getElementById(item.id);
            box.parentNode.removeChild(box);
          });
          hasBlockArr.forEach((item, index) => {
            let left = startLeft + index * item.targetDomClass.width + "px";
            setStyle(item.target, {
              left,
            });
            left.targetDomClass.left = left;
          });
        }, 300);
      }
    }
  });
  setTimeout(() => {
    GameState();
  }, 500);
}

function clickBlock(target, targetDomClass) {
  if (targetDomClass.blockState) {
    computedBoxPosition(target, targetDomClass);
    checkBox();
  }
}

class Block {
  constructor(src, i) {
    this.width = $width;
    this.height = $height;
    this.src = src;
    this.index = i;
    this.n = src;
    this.blockState = false;
    this.x = randomPosition(AppPosition.drawStartX, AppPosition.drawEndX);
    this.y = randomPosition(AppPosition.drawStartY, AppPosition.drawEndY);
  }

  isCover() {
    var thatBlock;
    var coverState = false;
    for (let i = 0; i < allBlock.length; i++) {
      if (allBlock[i].index === this.index) {
        thatBlock = allBlock[i];
      } else if (thatBlock) {
        const target = allBlock[i];
        var xLeft = target.x;
        var xRight = target.x + target.width;
        var yTop = target.y;
        var yBottom = target.y + target.height;
        if (
          !(
            thatBlock.x > xRight ||
            thatBlock.x + thatBlock.width < xLeft ||
            thatBlock.y > yBottom ||
            thatBlock.y + thatBlock.height < yTop
          )
        ) {
          coverState = true;
          break;
        }
      }
    }
    return coverState;
  }

  draw() {
    const imgDom = new Image();
    imgDom.src = this.src;
    imgDom.id = this.index;
    imgDom.classList = "noSelect imgGlobal";
    imgDom.onclick = clickBlock.bind(null, imgDom, this);
    let style = {
      width: this.width + "px",
      height: this.height + "px",
      left: this.x + "px",
      top: this.y + "px",
    };
    if (this.isCover()) {
      imgDom.classList.add("imgFilter");
      this.blockState = false;
    } else {
      imgDom.classList.remove("imgFilter");
      this.blockState = true;
    }
    setStyle(imgDom, style);
    return imgDom;
  }
}

function drawBlock(gloup) {
  let virtualArr = [];
  for (let i = 0; i < gloup; i++) {
    virtualArr.push(...IMGS.sort(randomSort));
  }
  virtualArr.forEach((item, index) => {
    const vBlock = new Block(item, index);
    allBlock.push(vBlock);
  });
  console.log(allBlock);
  allBlock.forEach((item) => {
    app.appendChild(item.draw());
  });
}

const storageBox = document.getElementById("storageBox");

window.onload = () => {
  drawBlock(BlockNums);
  setStyle(storageBox, {
    border: "10px solid red",
  });
};
