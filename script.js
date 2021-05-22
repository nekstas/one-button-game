const S_START = 0,
  S_GLOW = 1,
  S_PRESS = 2,
  S_GAMEOVER = 3,
  S_RESULT = 4;
const MIN_TIME = 100, MAX_TIME = 5000;

let button = document.querySelector('.button'),
  state = S_START, level = 1, errorTime = 1000, levelTime = 0,
  pressTime = 0, playerTime = 0, curErrorTime = 0, tID = 0;

function randint(a, b) {
  return Math.floor(a + Math.random() * (b + 1 - a));
}

function clearScreen() {
  document.querySelectorAll('.screen').forEach(
    screen => screen.style.display = ''
  );
}

function showScreen(screen) {
  clearScreen();
  document.querySelector('.' + screen + '-screen').style.display = 'block';
}

function startGame() {
  level = 1;
  startLevel();
}

function goToPart2() {
  state = S_PRESS;
  showScreen('press');
  
  button.textContent = 'Нажимайте';
}

function startLevel() {
  state = S_GLOW;
  showScreen('glow');
  
  let levelText = level + ' уровень, точность: ' + errorTime + ' мс';
  document.querySelectorAll('.level-text').forEach(
    element => element.textContent = levelText
  );
  button.textContent = 'Не нажимать';
  
  levelTime = randint(MIN_TIME, MAX_TIME);
  tID = setTimeout(goToPart2, levelTime);
}

function endLevel() {
  state = S_RESULT;
  showScreen('result');
  
  document.querySelector('.level-time').textContent = levelTime + ' мс';
  document.querySelector('.player-time').textContent = playerTime + ' мс';
  document.querySelector('.cur-error-time').textContent = curErrorTime + ' мс';

  let statusText = document.querySelector('.status-text');
  if (curErrorTime <= errorTime) {
    button.textContent = 'Продолжить';
    statusText.textContent = 'Вы справились!';
    statusText.style.color = '#27ae60';
  } else {
    button.textContent = 'Закончить игру';
    statusText.textContent = 'Вы не справились.';
    statusText.style.color = '#c0392b';
  }
}

function continueGame() {
  if (curErrorTime <= errorTime) {
    level += 1;
    startLevel();
  } else {
    gameover();
    console.log(1);
  }
}

function gameover() {
  clearTimeout(tID);
  state = S_GAMEOVER;
  showScreen('gameover');
  button.textContent = 'Начать заново';
  document.querySelector('.levels-count').textContent = 'Вы прошли ' + (level - 1) + ' уровней';
}

button.addEventListener('click', () => {
  switch (state) {
    case S_START:
    case S_GAMEOVER:
      startGame();
      break;
    case S_GLOW:
      gameover();
      break;
    case S_RESULT:
      continueGame();
      break;
  }
});

button.addEventListener('mousedown', () => {
  if (state != S_PRESS) return;
  pressTime = new Date();
})

button.addEventListener('mouseup', () => {
  setTimeout(() => {
    if (state != S_PRESS) return;
    playerTime = new Date() - pressTime;
    curErrorTime = Math.abs(levelTime - playerTime);
    endLevel();
  }, 100);
})

showScreen('start');
