const EXPIRE_TIME = 1800; //in frames
let loopstarted = false;
const TOTAL_LINES = 19;
var intervalId;
var currentInput;
var cycles = 0;

var inputHistory = [];
var cyclesHistory = [];
var inputAge = [];
var usedCodes = [];

const analogConfig = JSON.parse(config).analog;
const buttonsConfig = JSON.parse(config).buttons;
const directionsConfig = JSON.parse(config).directions;

const analogEnabled = analogConfig.enabled;
const axisDeadzone = analogConfig.deadzone;

//create usedCodes to ignore unmapped button presses
directionsConfig.forEach(element => {
  usedCodes.push(element.code);
});

buttonsConfig.forEach(element => {
  usedCodes.push(element.code);
});
usedCodes.sort();
while(usedCodes[0] < 0) usedCodes.shift();

//parse config codes
const lpCode = Math.pow(2, (buttonsConfig.find((element) => element.id == "lp")).code);
const mpCode = Math.pow(2, (buttonsConfig.find((element) => element.id == "mp")).code);
const hpCode = Math.pow(2, (buttonsConfig.find((element) => element.id == "hp")).code);
const lkCode = Math.pow(2, (buttonsConfig.find((element) => element.id == "lk")).code);
const mkCode = Math.pow(2, (buttonsConfig.find((element) => element.id == "mk")).code);
const hkCode = Math.pow(2, (buttonsConfig.find((element) => element.id == "hk")).code);

//parse directional codes
const downCode = Math.pow(2, (directionsConfig.find((element) => element.id == "down")).code);
const upCode = Math.pow(2, (directionsConfig.find((element) => element.id == "up")).code);
const rightCode = Math.pow(2, (directionsConfig.find((element) => element.id == "right")).code);
const leftCode = Math.pow(2, (directionsConfig.find((element) => element.id == "left")).code);
const directionMask = downCode | upCode | rightCode | leftCode;

const dlCode = downCode | leftCode;
const drCode = downCode | rightCode;
const ulCode = upCode | leftCode;
const urCode = upCode | rightCode;

//setup macro codes
const parryCode = (buttonsConfig.find((element) => element.id == "parry")).code;
const diCode = (buttonsConfig.find((element) => element.id == "di")).code;
const throwCode = (buttonsConfig.find((element) => element.id == "throw")).code;


const punchesCode = (buttonsConfig.find((element) => element.id == "3p")).code;
const kicksCode = (buttonsConfig.find((element) => element.id == "3k")).code;
const lpmpCode = (buttonsConfig.find((element) => element.id == "lp+mp")).code;
const mphpCode = (buttonsConfig.find((element) => element.id == "mp+hp")).code;
const lphpCode = (buttonsConfig.find((element) => element.id == "lp+hp")).code;
const lkmkCode = (buttonsConfig.find((element) => element.id == "lk+mk")).code;
const mkhkCode = (buttonsConfig.find((element) => element.id == "mk+hk")).code;
const lkhkCode = (buttonsConfig.find((element) => element.id == "lk+hk")).code;


window.addEventListener("gamepadconnected", (evt) => {
  addgamepad(evt.gamepad);
});
window.addEventListener("gamepaddisconnected", (evt) => {
  removegamepad(evt.gamepad);
});

function addgamepad(gamepad) {
  const d = document.createElement("div");
  d.setAttribute("id", `controller${gamepad.index}`);

  //initialize lines

  const lineContainer = document.createElement("div");
  lineContainer.setAttribute("id", "lineContainer");
  lineContainer.style.display = "flex";
  lineContainer.style.setProperty("flex-direction", "column");

  for (var i = 0; i < TOTAL_LINES; i++) {

    const line = document.createElement("div");
    line.setAttribute("id", `line-${i}`);
    line.setAttribute("class", `line`);
    line.style.display = "none";

    const heldTimer = document.createElement("span");
    heldTimer.setAttribute("id", `timer-${i}`);
    heldTimer.textContent = "0";
    heldTimer.style.color = "white";
    heldTimer.style.display = "none";
    line.append(heldTimer);

    //directions creation
    {
      //dl
      const dl = document.createElement("img");
      dl.setAttribute("src", "./icons/key-dl.png");
      dl.setAttribute("id", `key-dl-${i}`);
      dl.setAttribute("class", "icon");
      dl.style.display = "none";
      line.append(dl);

      //down
      const down = document.createElement("img");
      down.setAttribute("src", "./icons/key-d.png");
      down.setAttribute("id", `key-down-${i}`);
      down.setAttribute("class", "icon");
      down.style.display = "none";
      line.append(down);

      //dr
      const dr = document.createElement("img");
      dr.setAttribute("src", "./icons/key-dr.png");
      dr.setAttribute("id", `key-dr-${i}`);
      dr.setAttribute("class", "icon");
      dr.style.display = "none";
      line.append(dr);

      //left
      const left = document.createElement("img");
      left.setAttribute("src", "./icons/key-l.png");
      left.setAttribute("id", `key-left-${i}`);
      left.setAttribute("class", "icon");
      left.style.display = "none";
      line.append(left);

      //neutral
      const neutral = document.createElement("img");
      neutral.setAttribute("src", "./icons/key-nutral.png");
      neutral.setAttribute("id", `key-neutral-${i}`);
      neutral.setAttribute("class", "icon");
      neutral.style.display = "none";
      line.append(neutral);

      //right
      const right = document.createElement("img");
      right.setAttribute("src", "./icons/key-r.png");
      right.setAttribute("id", `key-right-${i}`);
      right.setAttribute("class", "icon");
      right.style.display = "none";
      line.append(right);

      //ul
      const ul = document.createElement("img");
      ul.setAttribute("src", "./icons/key-dl.png");
      ul.setAttribute("id", `key-ul-${i}`);
      ul.setAttribute("class", "icon");
      ul.style.transform = "rotate(90deg)";
      ul.style.display = "none";
      line.append(ul);

      //up
      const up = document.createElement("img");
      up.setAttribute("src", "./icons/key-u.png");
      up.setAttribute("id", `key-up-${i}`);
      up.setAttribute("class", "icon");
      up.style.display = "none";
      line.append(up);


      //ur
      const ur = document.createElement("img");
      ur.setAttribute("src", "./icons/key-dr.png");
      ur.setAttribute("id", `key-ur-${i}`);
      ur.setAttribute("class", "icon");
      ur.style.transform = "rotate(-90deg)";
      ur.style.display = "none";
      line.append(ur);
    }


    //buttons creation
    {
      //lp
      const lp = document.createElement("img");
      lp.setAttribute("src", "./icons/icon_punch_l.png");
      lp.setAttribute("id", `icon_punch_l-${i}`);
      lp.setAttribute("class", "icon");
      lp.style.display = "none";
      line.append(lp);

      //mp
      const mp = document.createElement("img");
      mp.setAttribute("src", "./icons/icon_punch_m.png");
      mp.setAttribute("id", `icon_punch_m-${i}`);
      mp.setAttribute("class", "icon");
      mp.style.display = "none";
      line.append(mp);

      //hp
      const hp = document.createElement("img");
      hp.setAttribute("src", "./icons/icon_punch_h.png");
      hp.setAttribute("id", `icon_punch_h-${i}`);
      hp.setAttribute("class", "icon");
      hp.style.display = "none";
      line.append(hp);

      //lk
      const lk = document.createElement("img");
      lk.setAttribute("src", "./icons/icon_kick_l.png");
      lk.setAttribute("id", `icon_kick_l-${i}`);
      lk.setAttribute("class", "icon");
      lk.style.display = "none";
      line.append(lk);

      //mk
      const mk = document.createElement("img");
      mk.setAttribute("src", "./icons/icon_kick_m.png");
      mk.setAttribute("id", `icon_kick_m-${i}`);
      mk.setAttribute("class", "icon");
      mk.style.display = "none";
      line.append(mk);

      //hk
      const hk = document.createElement("img");
      hk.setAttribute("src", "./icons/icon_kick_h.png");
      hk.setAttribute("id", `icon_kick_h-${i}`);
      hk.setAttribute("class", "icon");
      hk.style.display = "none";
      line.append(hk);

    }

    lineContainer.append(line);
    const separator = document.createElement("div");
    separator.setAttribute("class", "separator");
    separator.setAttribute("id", `separator-${i}`);
    separator.style.visibility = "hidden";

    lineContainer.append(separator);
  }

  d.append(lineContainer);

  document.body.append(d);

  //start loop at 60fps
  if (!loopstarted) {
    let interval = 1000 / 60;
    intervalId = setInterval(updateStatus, interval);
    loopstarted = true;
  }
}

function removegamepad(gamepad) {
  document.querySelector(`#controller${gamepad.index}`).remove();
  clearInterval(intervalId);
}


function updateStatus() {

  for (const gamepad of navigator.getGamepads()) {
    if (!gamepad) continue;

    var expired = false;

    if (cycles < 99) {
      cycles++;
    }

    for (var i = inputAge.length - 1; i >= 0; i--) {
      inputAge[i]++;
      if (inputAge[i] >= EXPIRE_TIME) {
        expired = true;
        inputAge.pop();
        inputHistory.pop();
      }
    }

    const lineContainer = document.getElementById('lineContainer');
    const lines = lineContainer.getElementsByClassName("line");
    const separator = lineContainer.getElementsByClassName("separator");

    var inputNum = 0;

    for (const i of usedCodes) {
      //safeguard measure if codes aren't properly assigned
      if(i >= gamepad.buttons.length) break;
      button = gamepad.buttons[i];
      
      if (button.pressed) {
        switch (i) {
          case throwCode:
            inputNum = inputNum | lpCode;
            inputNum = inputNum | lkCode;
            break;
          case parryCode:
            inputNum = inputNum | mpCode;
            inputNum = inputNum | mkCode;
            break;
          case diCode:
            inputNum = inputNum | hpCode;
            inputNum = inputNum | hkCode;
            break;
          case punchesCode:
            inputNum = inputNum | lpCode;
            inputNum = inputNum | mpCode;
            inputNum = inputNum | hpCode;
            break;
          case kicksCode:
            inputNum = inputNum | lkCode;
            inputNum = inputNum | mkCode;
            inputNum = inputNum | hkCode;
            break;

          case lpmpCode:
            inputNum = inputNum | lpCode;
            inputNum = inputNum | mpCode;
            break;
          case lphpCode:
            inputNum = inputNum | lpCode;
            inputNum = inputNum | hpCode;
            break;
          case mphpCode:
            inputNum = inputNum | mpCode;
            inputNum = inputNum | hpCode;
            break;

            case lkmkCode:
            inputNum = inputNum | lkCode;
            inputNum = inputNum | mkCode;
            break;
          case lkhkCode:
            inputNum = inputNum | lkCode;
            inputNum = inputNum | hkCode;
            break;
          case mkhkCode:
            inputNum = inputNum | mkCode;
            inputNum = inputNum | hkCode;
            break;
          default:
            inputNum = inputNum | Math.pow(2, i);
        }
      } else {
      }
    }

    //do analog buttons input
    //for now I'll assume that the left joystick is used whilst leaving the DPAD enabled
    if (analogEnabled == true) {
      var xAxis = gamepad.axes[0];
      var yAxis = gamepad.axes[1];

      if (Math.hypot(xAxis, yAxis) >= axisDeadzone) {

        //find the angle and "map" it to a value from 0 to 7;
        //use -yAxis to "normalize the angles"
        let angle = Math.atan2(-yAxis, xAxis) + Math.PI;

        angle = angle * 4 / Math.PI;
        angle = Math.round(angle) % 8;
        
        switch(angle) {
          case 0:
            inputNum = inputNum | leftCode;
            break;
          case 1:
            inputNum = inputNum | dlCode;
            break;
          case 2:
            inputNum = inputNum | downCode;
            break;
          case 3:
            inputNum = inputNum | drCode;
            break;
          case 4:
            inputNum = inputNum | rightCode;
            break;
          case 5:
            inputNum = inputNum | urCode;
            break;
          case 6:
            inputNum = inputNum | upCode;
            break;
          case 7:
            inputNum = inputNum | ulCode;
            break;
        }

      }

      
    }

    //once we've gotten the input do the rest

    if (currentInput != inputNum || expired) {
      if (currentInput != inputNum) {
        inputHistory.unshift(inputNum);
        currentInput = inputNum;

        inputAge.unshift(0);
        
        cyclesHistory.unshift(cycles);
        cycles = 1;
        
      }

      while (inputHistory.length > TOTAL_LINES) {
        inputHistory.pop();
      }

      while (inputAge.length > TOTAL_LINES) {
        inputAge.pop();
      }

      while (cyclesHistory.length > TOTAL_LINES - 1) {
        cyclesHistory.pop();
      }

      for (var i = 0; i < TOTAL_LINES; i++) {

        if (i >= inputHistory.length) {

          lines[i].style.display = "none";
          separator[i].style.visibility = "hidden";

          continue;
        }
        
        lines[i].style.display = "inline-block";
        separator[i].style.visibility = "visible";

        const input = inputHistory[i];

        const text = document.getElementById(`timer-${i}`);
        text.style.display = "inline-block";

        if (i > 0) {
          text.textContent = cyclesHistory[i - 1];
        }
        
        //directions 
        {
          const dl = document.getElementById(`key-dl-${i}`);
          const down = document.getElementById(`key-down-${i}`);
          const dr = document.getElementById(`key-dr-${i}`);
          const left = document.getElementById(`key-left-${i}`);
          const neutral = document.getElementById(`key-neutral-${i}`);
          const right = document.getElementById(`key-right-${i}`);
          const ul = document.getElementById(`key-ul-${i}`);
          const up = document.getElementById(`key-up-${i}`);
          const ur = document.getElementById(`key-ur-${i}`);


          let direc = input & directionMask;
          const bools = [false, false, false, false, false, false, false, false, false];

          //doing SOCD clearing in case of analog usage and/or bad gamepad
          if (((direc & leftCode) == leftCode) && ((direc & rightCode) == rightCode)) {
            //if both right and left are pressed at the same time the clear them
            direc = direc & (~leftCode);
            direc = direc & (~rightCode);
          }
          if (((direc & upCode) == upCode) && ((direc & downCode) == downCode)) {
            //if both up and down are pressed at the same time the clear them
            direc = direc & (~upCode);
            direc = direc & (~downCode);
          }

          switch (direc) {
            case dlCode:
              bools[0] = true;
              break;
            case downCode:
              bools[1] = true;
              break;
            case drCode:
              bools[2] = true;
              break;
            case leftCode:
              bools[3] = true;
              break;
            case 0: //neutral code is 0
              bools[4] = true;
              break;
            case rightCode:
              bools[5] = true;
              break;
            case ulCode:
              bools[6] = true;
              break;
            case upCode:
              bools[7] = true;
              break;
            case urCode:
              bools[8] = true;
              break;
          }

          dl.style.display = (bools[0]) ? "inline" : "none";
          down.style.display = (bools[1]) ? "inline" : "none";
          dr.style.display = (bools[2]) ? "inline" : "none";
          left.style.display = (bools[3]) ? "inline" : "none";
          neutral.style.display = (bools[4]) ? "inline" : "none";
          right.style.display = (bools[5]) ? "inline" : "none";
          ul.style.display = (bools[6]) ? "inline" : "none";
          up.style.display = (bools[7]) ? "inline" : "none";
          ur.style.display = (bools[8]) ? "inline" : "none";


        }

        //buttons
        {
          const lk = document.getElementById(`icon_kick_l-${i}`);
          const mk = document.getElementById(`icon_kick_m-${i}`);
          const hk = document.getElementById(`icon_kick_h-${i}`);
          const lp = document.getElementById(`icon_punch_l-${i}`);
          const mp = document.getElementById(`icon_punch_m-${i}`);
          const hp = document.getElementById(`icon_punch_h-${i}`);

          lp.style.display = ((input & lpCode) == lpCode) ? "inline" : "none";
          mp.style.display = ((input & mpCode) == mpCode) ? "inline" : "none";
          hp.style.display = ((input & hpCode) == hpCode) ? "inline" : "none";

          lk.style.display = ((input & lkCode) == lkCode) ? "inline" : "none";
          mk.style.display = ((input & mkCode) == mkCode) ? "inline" : "none";
          hk.style.display = ((input & hkCode) == hkCode) ? "inline" : "none";
        }

      }

    }

    const text = document.getElementById(`timer-0`);
    text.textContent = cycles;

  }

}
