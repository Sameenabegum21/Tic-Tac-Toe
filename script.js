(function(){
  const cells = Array.from(document.querySelectorAll('.cell'));
  const statusEl = document.getElementById('status');
  const xScoreEl = document.getElementById('xScore');
  const oScoreEl = document.getElementById('oScore');
  const resetBoardBtn = document.getElementById('resetBoard');
  const resetScoresBtn = document.getElementById('resetScores');
  const modeToggle = document.getElementById('modeToggle');

  const overlay = document.getElementById('overlay');
  const resultText = document.getElementById('resultText');
  const newGameBtn = document.getElementById('newGame');

  const LINES = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  let board = Array(9).fill(null);
  let current = 'X';
  let active = true;
  let scores = { X: 0, O: 0 };
  let vsCPU = false;

  cells.forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.index);
      playerMove(idx);
    });
  });

  modeToggle.addEventListener('change', () => {
    vsCPU = modeToggle.checked;
    resetBoard();
  });

  resetBoardBtn.addEventListener('click', () => resetBoard());
  resetScoresBtn.addEventListener('click', () => {
    scores = { X: 0, O: 0 };
    renderScores();
  });

  newGameBtn.addEventListener('click', () => {
    overlay.classList.remove('show');
    resetBoard();
  });

  function playerMove(idx){
    if(!active || board[idx]) return;
    placeMark(idx, current);
    if(checkEnd()) return;
    togglePlayer();
    if(vsCPU && current === 'O') {
      cpuTurn();
    }
  }

  function cpuTurn(){
    const empty = board.map((v,i)=>v?null:i).filter(i=>i!==null);
    if(!empty.length) return;
    const pick = empty[Math.floor(Math.random()*empty.length)];
    setTimeout(() => {
      placeMark(pick, 'O');
      if(checkEnd()) return;
      togglePlayer();
    }, 400);
  }

  function placeMark(idx, player){
    board[idx] = player;
    const cell = cells[idx];
    cell.textContent = player;
    cell.classList.add(player.toLowerCase());
  }

  function checkEnd(){
    const result = findWinner();
    if(result){
      active = false;
      highlight(result.combo);
      scores[result.winner]++;
      renderScores();
      showOverlay(`Player ${result.winner} Wins!`);
      return true;
    }
    if(board.every(Boolean)){
      active = false;
      showOverlay(`It's a Draw!`);
      return true;
    }
    return false;
  }

  function findWinner(){
    for(const combo of LINES){
      const [a,b,c] = combo;
      if(board[a] && board[a] === board[b] && board[a] === board[c]){
        return { winner: board[a], combo };
      }
    }
    return null;
  }

  function highlight(combo){
    combo.forEach(i => cells[i].classList.add('win'));
    setTimeout(() => combo.forEach(i => cells[i].classList.remove('win')), 1200);
  }

  function togglePlayer(){
    current = current === 'X' ? 'O' : 'X';
    announce(`${current}'s turn`); 
  }

  function renderScores(){
    xScoreEl.textContent = scores.X;
    oScoreEl.textContent = scores.O;
  }

  function resetBoard(){
    board = Array(9).fill(null);
    current = 'X';
    active = true;
    cells.forEach(c => { c.textContent = ''; c.classList.remove('x','o','win'); });
    announce(`X's turn`);
  }

  function announce(text){
    statusEl.textContent = text;
  }

  function showOverlay(message){
    resultText.textContent = message;
    overlay.classList.add('show');
  }

  // Init
  announce(`X's turn`);
  renderScores();
})();
