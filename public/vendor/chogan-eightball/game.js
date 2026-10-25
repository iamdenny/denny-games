(function () {
  'use strict';
  var C = window.Chogan, el = C.el;
  var requestedLocale = new URLSearchParams(location.search).get('locale');
  if (requestedLocale === 'en' || requestedLocale === 'ko') C.setLang(requestedLocale);
  var E = EightBallEngineFactory(window.ChoganCue), Cue = E.Cue, T = E.T, R = E.R;

  C.boot({});
  var ctx = C.game({
    id: 'eightball',
    name: { fa: 'بیلیارد', en: '8-Ball Pool', ko: '8볼 풀', zh: '八球', de: '8-Ball', es: 'Bola 8' },
    accent: '#1E7F74',
    mood: 'menu',
    strings: {
      fa: {
        vsAi: 'با ربات', twoPlayers: 'دو نفره', mode: 'حالت', level: 'سطح', rival: 'حریف', player2: 'بازیکن دو',
        solids: 'تک‌رنگ', stripes: 'راه‌راه', openTable: 'میز باز است', groupFor: '{g} برای {n}',
        yourTurn: 'نوبت توست', turnOf: 'نوبت {n}', thinking: 'در حال فکر…',
        breakHint: 'شروع: توپ سفید را پشت خط بکش و به مثلث بزن', inHand: 'توپ در دست: توپ سفید را هر جا خواستی بکش، بعد نشانه بگیر',
        foulScratch: 'خطا: توپ سفید افتاد', foulNoHit: 'خطا: به هیچ توپی نخورد', foulWrong: 'خطا: اول به توپ خودی نخورد',
        respot: 'توپ ۸ در شروع افتاد و سر جایش برگشت', potMore: 'آفرین! دوباره بزن',
        eightEarly: 'توپ ۸ زودتر از موقع افتاد', eightFoul: 'توپ ۸ با خطا افتاد', eightWin: 'توپ ۸ درست افتاد',
        playerWon: '{n} برد', power: 'قدرت', pull: 'بکش و رها کن', fineLeft: 'چرخش ریز به چپ', fineRight: 'چرخش ریز به راست',
        shots: 'ضربه', fouls: 'خطا', ballsLeft: '{n} توپ مانده', potted: 'توپ‌های انداخته', newFrame: 'دست تازه', startFrame: 'شروع',
        dailyEb: 'میز روزانه', dailyGoal: 'همه‌ی توپ‌ها را با کمترین ضربه بینداز', outOfShots: 'ضربه‌ها تمام شد', cleared: 'میز پاک شد!',
        tableLabel: 'میز بیلیارد', resetWarn: 'دست فعلی تمام می‌شود. ادامه؟',
        rules: 'بازیکنی که اول یک توپ تک‌رنگ (۱ تا ۷) یا راه‌راه (۹ تا ۱۵) بیندازد، آن دسته مال او می‌شود و دسته‌ی دیگر مال حریف. تا وقتی توپ خودت را بیندازی، باز هم نوبت توست. هر ضربه باید اول به یکی از توپ‌های خودت بخورد. اگر توپ سفید بیفتد، به هیچ توپی نخورد یا اول به توپ حریف بخورد، خطاست و حریف توپ سفید را هر جا بخواهد می‌گذارد. وقتی همه‌ی توپ‌هایت افتاد، توپ ۸ را بینداز تا ببری. اگر توپ ۸ زودتر یا با خطا بیفتد، می‌بازی. اگر در ضربه‌ی شروع بیفتد، سر جایش برمی‌گردد.',
        keyboard: 'صفحه‌کلید', kbAim: 'چرخاندن نشانه', kbFine: 'چرخش ریز', kbPower: 'قدرت ضربه', kbShoot: 'ضربه', kbPlace: 'جابه‌جایی توپ سفید (توپ در دست)',
        tutTitle1: 'نشانه بگیر و بزن', tutText1: 'روی میز انگشتت را بکش تا خط نشانه بچرخد. بعد نوار قدرت پایین را بکش و رها کن. از روی خود توپ سفید هم می‌شود عقب کشید و رها کرد.',
        tutTitle2: 'تک‌رنگ یا راه‌راه', tutText2: 'اولین توپی که بیندازی دسته‌ات را معلوم می‌کند. تا وقتی توپ خودت را بیندازی، دوباره می‌زنی.',
        tutTitle3: 'خطا و توپ ۸', tutText3: 'اگر توپ سفید بیفتد یا اول به توپ خودی نخورد، حریف توپ را در دست می‌گیرد. آخر از همه توپ ۸ را بینداز؛ زودتر بیفتد، باختی.'
      },
      en: {
        vsAi: 'Versus AI', twoPlayers: 'Two players', mode: 'Mode', level: 'Level', rival: 'Opponent', player2: 'Player two',
        solids: 'Solids', stripes: 'Stripes', openTable: 'Open table', groupFor: '{g}: {n}',
        yourTurn: 'Your turn', turnOf: 'Turn: {n}', thinking: 'Thinking…',
        breakHint: 'Break: drag the white ball behind the line and hit the rack', inHand: 'Ball in hand: drag the white ball anywhere, then aim',
        foulScratch: 'Foul: the white ball went in', foulNoHit: 'Foul: no ball was hit', foulWrong: 'Foul: the first ball hit was not yours',
        respot: 'The 8 went in on the break and was put back', potMore: 'Nice! Shoot again',
        eightEarly: 'The 8 went in too early', eightFoul: 'The 8 went in with a foul', eightWin: 'The 8 went in cleanly',
        playerWon: '{n} wins', power: 'Power', pull: 'Pull and release', fineLeft: 'Fine turn left', fineRight: 'Fine turn right',
        shots: 'Shots', fouls: 'Fouls', ballsLeft: '{n} balls left', potted: 'Balls potted', newFrame: 'New frame', startFrame: 'Start',
        dailyEb: 'Daily table', dailyGoal: 'Pot every ball in as few shots as you can', outOfShots: 'Out of shots', cleared: 'Table cleared!',
        tableLabel: 'Pool table', resetWarn: 'This ends the current frame. Continue?',
        rules: 'The first player to pot a solid (1 to 7) or a stripe (9 to 15) takes that group, and the opponent gets the other. You keep shooting while you pot your own balls. Every shot must hit one of your own balls first. Potting the white, hitting nothing, or hitting an opponent ball first is a foul, and the opponent may then place the white anywhere. Once all your balls are down, pot the 8 to win. Pot the 8 early or with a foul and you lose. If it goes in on the break, it is put back on its spot.',
        keyboard: 'Keyboard', kbAim: 'Turn the aim', kbFine: 'Fine turn', kbPower: 'Shot power', kbShoot: 'Shoot', kbPlace: 'Move the white ball (ball in hand)',
        tutTitle1: 'Aim and shoot', tutText1: 'Drag on the table to turn the aim line. Then pull the power bar below and let go. You can also pull back from the white ball itself and release.',
        tutTitle2: 'Solids or stripes', tutText2: 'The first ball you pot decides your group. You keep shooting as long as you pot your own balls.',
        tutTitle3: 'Fouls and the 8', tutText3: 'If the white goes in or does not hit your own ball first, your opponent gets ball in hand. Pot the 8 last of all; if it drops early, you lose.'
      },
      ko: {
        vsAi: '컴퓨터와 대결', twoPlayers: '두 명이 함께', mode: '모드', level: '난이도', rival: '상대', player2: '두 번째 플레이어',
        solids: '단색 공', stripes: '줄무늬 공', openTable: '그룹 미정', groupFor: '{n}의 그룹: {g}',
        yourTurn: '내 차례', turnOf: '{n} 차례', thinking: '상대가 생각 중…',
        breakHint: '초구: 흰 공을 끌어 삼각형 공을 맞히세요', inHand: '흰 공을 원하는 자리에 놓고 조준하세요',
        foulScratch: '파울: 흰 공이 포켓에 들어갔어요', foulNoHit: '파울: 공을 맞히지 못했어요', foulWrong: '파울: 먼저 맞힌 공이 내 그룹 공이 아니에요',
        respot: '초구에 들어간 8번 공을 다시 놓았어요', potMore: '좋아요! 한 번 더 쳐요',
        eightEarly: '8번 공을 너무 일찍 넣었어요', eightFoul: '파울과 함께 8번 공이 들어갔어요', eightWin: '8번 공을 넣어 승리했어요',
        playerWon: '{n} 승리', power: '힘 조절', pull: '당겼다 놓기', fineLeft: '왼쪽으로 조금 조준', fineRight: '오른쪽으로 조금 조준',
        shots: '샷', fouls: '파울', ballsLeft: '{n}개 남음', potted: '넣은 공', newFrame: '새 게임', startFrame: '시작',
        dailyEb: '오늘의 테이블', dailyGoal: '가능한 적은 샷으로 모든 공을 넣으세요', outOfShots: '샷을 모두 썼어요', cleared: '테이블을 비웠어요!',
        tableLabel: '당구대', resetWarn: '진행 중인 게임을 끝낼까요?',
        rules: '먼저 단색 공(1~7)이나 줄무늬 공(9~15)을 넣은 사람이 해당 그룹을 맡고 상대는 다른 그룹을 맡아요. 내 공을 넣으면 계속 칠 수 있어요. 매 샷마다 내 그룹의 공을 먼저 맞혀야 해요. 흰 공이 들어가거나, 아무 공도 맞히지 못하거나, 상대 그룹 공을 먼저 맞히면 파울이에요. 상대는 흰 공을 원하는 곳에 놓을 수 있어요. 내 그룹 공을 모두 넣은 다음 8번 공을 넣으면 이겨요. 8번 공을 일찍 넣거나 파울과 함께 넣으면 져요. 초구에 들어간 8번 공은 다시 놓여요.',
        keyboard: '키보드', kbAim: '조준 방향 돌리기', kbFine: '조준 미세 조정', kbPower: '샷 힘', kbShoot: '샷하기', kbPlace: '흰 공 옮기기 (공 배치 차례)',
        tutTitle1: '조준하고 샷하기', tutText1: '당구대에서 드래그해 조준선을 돌리세요. 아래 힘 조절 막대를 당겼다 놓으면 샷을 해요. 흰 공을 직접 뒤로 당겼다 놓아도 돼요.',
        tutTitle2: '단색 공 또는 줄무늬 공', tutText2: '처음 넣은 공이 내 그룹을 정해요. 내 공을 넣으면 계속 칠 수 있어요.',
        tutTitle3: '파울과 8번 공', tutText3: '흰 공을 넣거나 내 공을 먼저 맞히지 못하면 상대에게 공 배치 차례가 넘어가요. 8번 공은 마지막에 넣어야 해요.',
      },
      zh: {
        vsAi: '对战电脑', twoPlayers: '双人', mode: '模式', level: '难度', rival: '对手', player2: '玩家二',
        solids: '全色球', stripes: '花色球', openTable: '开放球台', groupFor: '{g}：{n}',
        yourTurn: '轮到你了', turnOf: '轮到：{n}', thinking: '思考中…',
        breakHint: '开球：把白球拖到线后，击打球堆', inHand: '自由球：把白球拖到任意位置，再瞄准',
        foulScratch: '犯规：白球落袋', foulNoHit: '犯规：没有碰到球', foulWrong: '犯规：先碰到的不是你的球',
        respot: '开球时 8 号球落袋，已放回原位', potMore: '好球！继续击球',
        eightEarly: '8 号球过早落袋', eightFoul: '8 号球落袋时犯规', eightWin: '8 号球干净落袋',
        playerWon: '{n}获胜', power: '力度', pull: '拉动后松开', fineLeft: '向左微调', fineRight: '向右微调',
        shots: '击球', fouls: '犯规', ballsLeft: '还剩 {n} 个球', potted: '进球数', newFrame: '新一局', startFrame: '开始',
        dailyEb: '每日球台', dailyGoal: '用尽量少的杆数打进所有球', outOfShots: '杆数用完了', cleared: '清台！',
        tableLabel: '台球桌', resetWarn: '将结束当前这一局，是否继续？',
        rules: '先打进全色球（1 到 7）或花色球（9 到 15）的玩家拥有该组，对手拥有另一组。只要打进自己的球就可以继续击球。每一杆必须先碰到自己的球。白球落袋、没碰到球或先碰到对手的球都算犯规，对手可以把白球放在任意位置。自己的球全部落袋后，打进 8 号球获胜。8 号球过早落袋或犯规时落袋则判负。开球时打进的 8 号球会放回原位。',
        keyboard: '键盘', kbAim: '转动瞄准线', kbFine: '微调', kbPower: '击球力度', kbShoot: '击球', kbPlace: '移动白球（自由球时）',
        tutTitle1: '瞄准并击球', tutText1: '在球台上拖动来转动瞄准线。然后拉动下方的力度条再松开。也可以直接从白球向后拉再松开。',
        tutTitle2: '全色还是花色', tutText2: '你打进的第一个球决定你的组。只要打进自己的球，就可以继续击球。',
        tutTitle3: '犯规与 8 号球', tutText3: '白球落袋或没有先碰到自己的球时，对手获得自由球。8 号球要最后打进，提前落袋就输了。'
      },
      de: {
        vsAi: 'Gegen KI', twoPlayers: 'Zu zweit', mode: 'Modus', level: 'Stufe', rival: 'Gegner', player2: 'Spieler zwei',
        solids: 'Volle', stripes: 'Halbe', openTable: 'Offener Tisch', groupFor: '{g}: {n}',
        yourTurn: 'Du bist dran', turnOf: '{n} am Zug', thinking: 'Denkt nach…',
        breakHint: 'Anstoß: Zieh die weiße Kugel hinter die Linie und triff das Dreieck', inHand: 'Ball in der Hand: Zieh die weiße Kugel irgendwohin und ziele dann',
        foulScratch: 'Foul: die weiße Kugel ist gefallen', foulNoHit: 'Foul: keine Kugel getroffen', foulWrong: 'Foul: zuerst keine eigene Kugel getroffen',
        respot: 'Die 8 fiel beim Anstoß und kommt zurück auf ihren Punkt', potMore: 'Gut! Noch ein Stoß',
        eightEarly: 'Die 8 fiel zu früh', eightFoul: 'Die 8 fiel mit einem Foul', eightWin: 'Die 8 fiel sauber',
        playerWon: 'Sieg: {n}', power: 'Kraft', pull: 'Ziehen und loslassen', fineLeft: 'Fein nach links', fineRight: 'Fein nach rechts',
        shots: 'Stöße', fouls: 'Fouls', ballsLeft: 'Noch {n} Kugeln', potted: 'Versenkte Kugeln', newFrame: 'Neues Spiel', startFrame: 'Start',
        dailyEb: 'Tagestisch', dailyGoal: 'Versenke alle Kugeln mit so wenigen Stößen wie möglich', outOfShots: 'Keine Stöße mehr', cleared: 'Tisch geräumt!',
        tableLabel: 'Billardtisch', resetWarn: 'Das aktuelle Spiel endet. Weiter?',
        rules: 'Wer zuerst eine Volle (1 bis 7) oder eine Halbe (9 bis 15) versenkt, bekommt diese Gruppe, der Gegner die andere. Solange du eigene Kugeln versenkst, bleibst du dran. Jeder Stoß muss zuerst eine eigene Kugel treffen. Fällt die Weiße, wird nichts getroffen oder zuerst eine gegnerische Kugel, ist das ein Foul, und der Gegner legt die Weiße, wohin er will. Sind alle deine Kugeln weg, versenke die 8 zum Sieg. Fällt die 8 zu früh oder mit Foul, hast du verloren. Fällt sie beim Anstoß, kommt sie zurück auf ihren Punkt.',
        keyboard: 'Tastatur', kbAim: 'Zielen', kbFine: 'Fein zielen', kbPower: 'Stoßkraft', kbShoot: 'Stoßen', kbPlace: 'Weiße Kugel bewegen (Ball in der Hand)',
        tutTitle1: 'Zielen und stoßen', tutText1: 'Zieh über den Tisch, um die Ziellinie zu drehen. Dann zieh den Kraftbalken unten und lass los. Du kannst auch direkt von der weißen Kugel zurückziehen und loslassen.',
        tutTitle2: 'Volle oder Halbe', tutText2: 'Die erste Kugel, die du versenkst, bestimmt deine Gruppe. Solange du eigene Kugeln versenkst, bleibst du dran.',
        tutTitle3: 'Fouls und die 8', tutText3: 'Fällt die Weiße oder trifft sie zuerst keine eigene Kugel, bekommt dein Gegner den Ball in die Hand. Die 8 kommt ganz zum Schluss; fällt sie früher, ist das Spiel verloren.'
      },
      es: {
        vsAi: 'Contra la IA', twoPlayers: 'Dos jugadores', mode: 'Modo', level: 'Nivel', rival: 'Rival', player2: 'Jugador dos',
        solids: 'Lisas', stripes: 'Rayadas', openTable: 'Mesa abierta', groupFor: '{g}: {n}',
        yourTurn: 'Te toca', turnOf: 'Turno de {n}', thinking: 'Pensando…',
        breakHint: 'Saque: arrastra la bola blanca detrás de la línea y golpea el triángulo', inHand: 'Bola en mano: arrastra la bola blanca a donde quieras y luego apunta',
        foulScratch: 'Falta: la bola blanca entró', foulNoHit: 'Falta: no tocaste ninguna bola', foulWrong: 'Falta: la primera bola tocada no era tuya',
        respot: 'La 8 entró en el saque y vuelve a su sitio', potMore: '¡Bien! Tira otra vez',
        eightEarly: 'La 8 entró antes de tiempo', eightFoul: 'La 8 entró con falta', eightWin: 'La 8 entró limpia',
        playerWon: 'Gana: {n}', power: 'Fuerza', pull: 'Tira y suelta', fineLeft: 'Giro fino a la izquierda', fineRight: 'Giro fino a la derecha',
        shots: 'Tiros', fouls: 'Faltas', ballsLeft: 'Quedan {n} bolas', potted: 'Bolas metidas', newFrame: 'Nueva partida', startFrame: 'Empezar',
        dailyEb: 'Mesa diaria', dailyGoal: 'Mete todas las bolas con los menos tiros posibles', outOfShots: 'Sin tiros', cleared: '¡Mesa limpia!',
        tableLabel: 'Mesa de billar', resetWarn: 'Esto termina la partida actual. ¿Seguir?',
        rules: 'Quien mete primero una lisa (1 a 7) o una rayada (9 a 15) se queda con ese grupo, y el rival con el otro. Sigues tirando mientras metas tus bolas. Cada tiro debe tocar primero una de tus bolas. Meter la blanca, no tocar nada o tocar primero una bola del rival es falta, y el rival coloca la blanca donde quiera. Cuando hayas metido todas tus bolas, mete la 8 para ganar. Si la 8 entra antes de tiempo o con falta, pierdes. Si entra en el saque, vuelve a su sitio.',
        keyboard: 'Teclado', kbAim: 'Girar la mira', kbFine: 'Giro fino', kbPower: 'Fuerza del tiro', kbShoot: 'Tirar', kbPlace: 'Mover la bola blanca (bola en mano)',
        tutTitle1: 'Apunta y tira', tutText1: 'Arrastra sobre la mesa para girar la línea de mira. Luego tira de la barra de fuerza de abajo y suelta. También puedes tirar hacia atrás desde la propia bola blanca y soltar.',
        tutTitle2: 'Lisas o rayadas', tutText2: 'La primera bola que metes decide tu grupo. Sigues tirando mientras metas tus propias bolas.',
        tutTitle3: 'Faltas y la 8', tutText3: 'Si la blanca entra o no toca primero una de tus bolas, tu rival tiene bola en mano. Mete la 8 al final de todo; si entra antes, pierdes.'
      }
    }
  });

  var params = new URLSearchParams(location.search);
  var dailyDate = params.get('daily');
  var prefs = ctx.store.get('prefs', { mode: 'ai', level: 'medium', breaker: 0 });
  if (['easy', 'medium', 'hard'].indexOf(prefs.level) < 0) prefs.level = 'medium';
  if (prefs.mode !== 'ai' && prefs.mode !== '2p') prefs.mode = 'ai';

  // F: the frame at rest (what is saved). run: the shot being animated.
  var F = null, run = null, pending = null, startedAt = Date.now();
  var aimA = 0, power = 0, drag = null, kbOn = false, kbPower = 0.55, msg = { text: '', kind: '' };
  var ai = null, aiAnim = null, lastHitSfx = 0;
  window.DennyGameBridge.actionHandler = function (action) {
    if (!F || !humanTurn()) return false;
    var keyMap = F.inHand
      ? { up: ['w', 'KeyW'], down: ['s', 'KeyS'], left: ['a', 'KeyA'], right: ['d', 'KeyD'] }
      : { up: ['ArrowUp', 'ArrowUp'], down: ['ArrowDown', 'ArrowDown'], left: ['ArrowLeft', 'ArrowLeft'], right: ['ArrowRight', 'ArrowRight'] };
    var key = action === 'confirm' ? [' ', 'Space'] : keyMap[action];
    if (!key) return false;
    window.dispatchEvent(new KeyboardEvent('keydown', { key: key[0], code: key[1], bubbles: true, cancelable: true }));
    return true;
  };

  var cv = el('canvas', { class: 'eb-canvas', role: 'img', 'aria-label': C.t('tableLabel') });
  var tableBox = el('div', { class: 'eb-tablebox' }, [cv]);
  var playersRow = el('div', { class: 'eb-players' });
  var msgEl = el('div', { class: 'eb-msg', 'aria-live': 'polite' });
  var fill = el('div', { class: 'eb-power__fill' });
  var plabel = el('div', { class: 'eb-power__label', text: C.t('pull') });
  var powerBar = el('div', { class: 'eb-power', role: 'slider', 'aria-label': C.t('power'), 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': '0' }, [fill, plabel]);
  var fineL = el('button', { class: 'ch-iconbtn eb-fine', type: 'button', 'aria-label': C.t('fineLeft') }, [el('span', { class: 'eb-fine__g', text: '↺' })]);
  var fineR = el('button', { class: 'ch-iconbtn eb-fine', type: 'button', 'aria-label': C.t('fineRight') }, [el('span', { class: 'eb-fine__g', text: '↻' })]);
  var controls = el('div', { class: 'eb-controls' }, [fineL, powerBar, fineR]);
  var wrap = el('div', { class: 'eb-wrap' }, [playersRow, msgEl, tableBox, controls]);

  ctx.button({ icon: 'help', label: C.t('help'), onClick: showHelp });
  ctx.button({ icon: 'refresh', label: C.t('newFrame'), onClick: askNew });
  ctx.main.appendChild(wrap);
  ctx.mount();

  /* ------------------------------------------------------------- frame */

  function newGame(o) {
    stopAi();
    run = null; pending = null;
    if (o.daily) {
      F = E.newDaily(C.daily('eightball', o.daily).rng, o.daily);
    } else {
      prefs.mode = o.mode; prefs.level = o.level;
      // In a match against the AI the break goes back and forth between frames
      var first = o.mode === 'ai' ? (prefs.breaker || 0) : 0;
      prefs.breaker = 1 - first;
      ctx.store.set('prefs', prefs);
      F = E.newFrame({ mode: o.mode, level: o.level, first: first, rnd: Math.random });
    }
    startedAt = Date.now();
    aimA = E.aimDefault(F);
    if (F.isBreak) aimA = 0;
    setMsg(F.daily ? C.t('dailyGoal') : (F.isBreak ? C.t('breakHint') : ''), '');
    render();
    save();
    maybeAi();
  }

  function humanTurn() { return F && !F.over && !run && (F.mode !== 'ai' || F.turn === 0); }
  function aiTurn() { return F && !F.over && !run && F.mode === 'ai' && F.turn === 1; }

  function pname(p) {
    if (F.mode === 'ai') return p === 0 ? (C.state.profile.name || C.t('you')) : C.t('rival') + ' · ' + C.t(F.level);
    if (F.mode === 'daily') return C.state.profile.name || C.t('you');
    return p === 0 ? (C.state.profile.name || C.t('you')) : C.t('player2');
  }
  function gname(g) { return g === 'solid' ? C.t('solids') : C.t('stripes'); }

  function setMsg(text, kind) { msg = { text: text || '', kind: kind || '' }; }

  // The idle hint when nothing else needs saying
  function hint() {
    if (!F || F.over) return '';
    if (F.isBreak) return C.t('breakHint');
    if (F.inHand && (F.mode !== 'ai' || F.turn === 0)) return C.t('inHand');
    if (F.mode === 'daily') return C.t('ballsLeft', { n: C.num(E.targets(F, 0).length) });
    if (F.mode === 'ai') return F.turn === 0 ? C.t('yourTurn') : C.t('thinking');
    return C.t('turnOf', { n: pname(F.turn) });
  }

  /* -------------------------------------------------------------- shots */

  function shoot(shot) {
    if (!F || F.over || run) return;
    var cue = E.ball(F, 0);
    if (!cue || !cue.inPlay) return;
    kbOn = false;
    setMsg('', '');
    msgEl.textContent = '';
    // The rules see the shot first; the animation then replays the very same
    // steps, so what is drawn is what was judged.
    pending = E.shoot(F, shot);
    run = Cue.start(T, F.balls, shot, 0);
    C.audio.sfx('shoot');
    C.haptic('tap');
    power = 0;
    drawPower();
    // saved at once: leaving mid-roll keeps the shot instead of offering a redo
    var keep = F;
    F = pending.F;
    save();
    F = keep;
    animate();
  }

  var raf = null, lastT = 0, acc = 0;
  // potted balls on their way down the pocket (#407, Cue.sinkAt)
  var sinks = [], sinkRaf = 0;
  function drawSinks(g) {
    var now = performance.now(), keep = [];
    for (var i = 0; i < sinks.length; i++) {
      var q = (now - sinks[i].t0) / Cue.SINK_MS;
      if (q >= 1) continue;
      keep.push(sinks[i]);
      var p = Cue.sinkAt(T, sinks[i], Math.max(0, q));
      g.save(); g.globalAlpha = p.a; g.translate(p.x, p.y); g.scale(p.k, p.k);
      paintBall(g, { id: sinks[i].id, x: 0, y: 0, inPlay: true });
      g.restore();
    }
    sinks = keep;
    if (sinks.length && !sinkRaf) sinkRaf = requestAnimationFrame(function () { sinkRaf = 0; draw(); });
  }
  function animate() {
    lastT = 0; acc = 0;
    var step = function (t) {
      raf = null;
      if (!run) return;
      if (!lastT) lastT = t;
      acc += Math.min(0.1, (t - lastT) / 1000);
      lastT = t;
      var n = 0;
      while (acc >= Cue.DT && run.moving && n < 200) {
        Cue.tick(run);
        acc -= Cue.DT; n++;
        if (run.hits && t - lastHitSfx > 60) { C.audio.sfx('hit'); lastHitSfx = t; }
        if (run.pots.length) {
          C.audio.sfx('pop'); C.haptic('tap');
          if (!C.ui.reduceMotion()) sinks = sinks.concat(Cue.sinksOf(run, t));
        }
      }
      draw();
      if (run.moving) raf = requestAnimationFrame(step);
      else endShot();
    };
    raf = requestAnimationFrame(step);
  }

  function endShot() {
    var res = pending.res;
    F = pending.F;
    run = null; pending = null;
    var who = res && F.last ? F.last.by : 0;
    if (res.win || res.lose) {
      // coloured for the player holding the phone: the AI's early 8 is good news
      var mine = F.mode === 'ai' ? F.winner === 0 : true;
      setMsg(res.win ? C.t('eightWin') : (res.foul ? C.t('eightFoul') : C.t('eightEarly')), mine ? 'good' : 'bad');
    } else if (res.foul) {
      setMsg({ scratch: C.t('foulScratch'), noHit: C.t('foulNoHit'), wrongFirst: C.t('foulWrong') }[res.foul], 'bad');
      C.feedback('bad');
    } else if (res.respot) setMsg(C.t('respot'), '');
    else if (res.assigned) setMsg(C.t('groupFor', { g: gname(res.assigned), n: pname(who) }), 'good');
    else if (res.continues || (F.mode === 'daily' && res.own)) setMsg(F.mode === 'daily' ? hint() : C.t('potMore'), 'good');
    else setMsg('', '');
    if ((res.own || 0) > 0 && !res.foul) C.feedback('good');
    if (F.visit >= 5 && (F.mode === '2p' || (F.mode === 'ai' && who === 0))) C.achievements.unlock('eb-run');
    if (!F.over) aimA = E.aimDefault(F);
    render();
    if (F.over) { setTimeout(finish, 650); return; }
    save();
    maybeAi();
  }

  /* ----------------------------------------------------------------- AI */

  function stopAi() {
    if (ai && ai.raf) cancelAnimationFrame(ai.raf);
    if (aiAnim) cancelAnimationFrame(aiAnim);
    ai = null; aiAnim = null;
  }

  function maybeAi() {
    if (!aiTurn()) return;
    stopAi();
    var plan = E.planner(F, F.level, Math.random), t0 = performance.now();
    ai = { plan: plan, raf: null };
    drawPlayers();
    // a few shots per frame keep the page responsive while the AI thinks
    var tick = function () {
      if (!ai || ai.plan !== plan) return;
      var done = plan.step(6);
      if (!done || performance.now() - t0 < 500) { ai.raf = requestAnimationFrame(tick); return; }
      ai = null;
      play(plan.result());
    };
    ai.raf = requestAnimationFrame(tick);
  }

  // The AI's shot is shown before it is played: the white is placed, the aim
  // line swings round and the cue draws back.
  function play(shot) {
    if (!aiTurn()) return;
    if (shot.place && F.inHand) E.placeCue(F, shot.place.x, shot.place.y);
    var from = aimA, to = shot.angle, d = Math.atan2(Math.sin(to - from), Math.cos(to - from)), t0 = 0;
    var step = function (t) {
      if (!aiTurn()) return;
      if (!t0) t0 = t;
      var k = Math.min(1, (t - t0) / 700);
      aimA = from + d * (k < 0.7 ? (k / 0.7) * (2 - k / 0.7) : 1);
      power = k < 0.7 ? 0 : shot.power * (k - 0.7) / 0.3;
      draw(); drawPower();
      if (k < 1) aiAnim = requestAnimationFrame(step);
      else { aiAnim = null; aimA = to; shoot({ angle: to, power: shot.power }); }
    };
    aiAnim = requestAnimationFrame(step);
  }

  /* ------------------------------------------------------------- result */

  function finish() {
    var won, title;
    if (F.mode === 'daily') {
      won = F.winner === 0;
      title = won ? C.t('cleared') : C.t('outOfShots');
    } else if (F.mode === 'ai') {
      won = F.winner === 0;
      title = won ? C.t('won') : C.t('lost');
    } else {
      won = null;
      title = C.t('playerWon', { n: pname(F.winner) });
    }
    var base = F.mode === 'ai' ? ({ easy: 5, medium: 10, hard: 18 }[F.level] || 10) : 8;
    var coins = Math.max(2, Math.round(won ? base : base * 0.35));
    var points = Math.max(3, Math.round(won ? base * 4 : base * 1.2));
    var lines;
    if (F.mode === 'daily') {
      var sc = F.shots + F.fouls[0];
      coins = won ? 10 + Math.max(0, 20 - sc) : 3;
      points = won ? 25 + Math.max(0, 40 - sc * 2) : 8;
      lines = [{ label: C.t('shots'), value: C.num(F.shots) }, { label: C.t('fouls'), value: C.num(F.fouls[0]) }];
      if (won) C.stats.best('eightball', 'dailyShots', sc, true);
      var first = C.stats.daily('eightball', F.daily, { label: won ? C.num(F.shots) + ' ' + C.t('shots') + ' · ' + C.num(F.fouls[0]) + ' ' + C.t('fouls') : C.t('outOfShots'), win: won });
      if (!first) { coins = Math.round(coins * 0.2); points = Math.round(points * 0.2); }
    } else {
      lines = [{ label: C.t('shots'), value: C.num(F.shots) }, { label: C.t('potted'), value: C.num(F.potted[0]) + ' – ' + C.num(F.potted[1]) }];
      if (F.mode === 'ai' && won) {
        C.achievements.unlock('eb-win');
        if (F.level === 'hard') C.achievements.unlock('eb-hard');
        C.stats.best('eightball', 'shots', F.shots, true);
      }
    }
    var daily = F.daily;
    ctx.clearSave();
    ctx.finish({
      won: won, title: title, timeMs: Date.now() - startedAt, coins: 0, points: 0, lines: lines,
      paint: cardPaint(),
      onAgain: daily ? null : function () { newGame({ mode: F.mode, level: F.level }); }
    });
  }

  /* -------------------------------------------------------------- saves */

  ctx.autosave(function () {
    if (!F || F.over || (F.isBreak && !F.shots && F.mode !== 'daily')) return { inProgress: false };
    if (F.mode === 'daily' && !F.shots) return { inProgress: false };
    return { f: F, elapsed: Date.now() - startedAt };
  });
  function save() { ctx.save(); }
  function validSave(sv) {
    var f = sv && sv.f;
    return !!(f && Array.isArray(f.balls) && f.balls.length >= 2 && f.balls[0].id === 0 && Array.isArray(f.groups) &&
      (f.turn === 0 || f.turn === 1) && ['ai', '2p', 'daily'].indexOf(f.mode) >= 0 && !f.over);
  }
  function restore(sv) {
    F = sv.f;
    startedAt = Date.now() - (sv.elapsed || 0);
    aimA = E.aimDefault(F);
    setMsg('', '');
    render();
    maybeAi();
  }

  function askNew() {
    if (F && F.daily) {
      var go = function () { newGame({ daily: F.daily }); };
      if (F.shots && !F.over) C.ui.confirm({ title: C.t('newFrame'), body: C.t('resetWarn'), onOk: go }); else go();
      return;
    }
    var o = { mode: F ? F.mode : prefs.mode, level: F ? F.level : prefs.level };
    if (o.mode === 'daily') o.mode = 'ai';
    var lv = el('div');
    var drawLv = function () {
      lv.innerHTML = '';
      if (o.mode !== 'ai') return;
      lv.appendChild(el('div', { class: 'ch-dim ch-sm', style: { margin: 'var(--s-3) 0 var(--s-1)' }, text: C.t('level') }));
      lv.appendChild(C.ui.segmented([{ value: 'easy', label: C.t('easy') }, { value: 'medium', label: C.t('medium') }, { value: 'hard', label: C.t('hard') }],
        o.level, function (v) { o.level = v; }));
    };
    drawLv();
    C.ui.modal({
      title: C.t('newFrame'),
      body: [el('div', { class: 'ch-dim ch-sm', style: { margin: '0 0 var(--s-1)' }, text: C.t('mode') }),
        C.ui.segmented([{ value: 'ai', label: C.t('vsAi') }, { value: '2p', label: C.t('twoPlayers') }], o.mode, function (v) { o.mode = v; drawLv(); }),
        lv, F && F.shots && !F.over ? el('p', { class: 'ch-dim ch-sm', style: { 'margin-top': 'var(--s-3)' }, text: C.t('resetWarn') }) : el('span')],
      actions: [{ label: C.t('cancel') }, { label: C.t('startFrame'), kind: 'primary', onClick: function () { newGame(o); } }]
    });
  }

  /* --------------------------------------------------------------- draw */

  var COL = {};
  var BALL = ['#F4F1EA', '#F2C12E', '#2457C5', '#D23B2A', '#6B3FA0', '#EE7A1F', '#1E8F4E', '#8B2332', '#111111'];
  function readColors() {
    var cs = getComputedStyle(document.documentElement);
    var v = function (k, f) { return cs.getPropertyValue(k).trim() || f; };
    COL = { cloth: v('--eb-cloth', '#2E8B57'), cloth2: v('--eb-cloth-2', '#267A4B'), rail: v('--eb-rail', '#6B4226'), rail2: v('--eb-rail-2', '#4E2F1A'),
      pocket: v('--eb-pocket', '#15110D'), line: v('--eb-line', 'rgba(255,255,255,.22)'), gold: v('--c-gold', '#D9A441'), bad: v('--c-bad', '#C0392B') };
  }
  readColors();
  function ballColor(id) { return BALL[id > 8 ? id - 8 : id]; }

  // Table to screen. A tall box turns the table on its side, head string at the
  // bottom, so a phone held upright shows it as large as it can.
  var G = { s: 1, ox: 0, oy: 0, rot: false, W: 1, H: 1, rail: 7 };
  function layout() {
    var bw = tableBox.clientWidth || window.innerWidth, bh = tableBox.clientHeight || (window.innerHeight - 220);
    var rail = 7, tl = T.L + rail * 2, tw = T.W + rail * 2;
    var sLand = Math.min(bw / tl, bh / tw), sPort = Math.min(bw / tw, bh / tl);
    G.rot = sPort > sLand * 1.08;
    G.s = Math.max(0.5, G.rot ? sPort : sLand);
    G.rail = rail;
    G.W = Math.floor((G.rot ? tw : tl) * G.s); G.H = Math.floor((G.rot ? tl : tw) * G.s);
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.floor(G.W * dpr); cv.height = Math.floor(G.H * dpr);
    cv.style.width = G.W + 'px'; cv.style.height = G.H + 'px';
    G.dpr = dpr;
  }
  function tableTransform(g) {
    var s = G.s * G.dpr, r = G.rail * G.s * G.dpr;
    if (G.rot) g.setTransform(0, -s, s, 0, r, r + T.L * s);
    else g.setTransform(s, 0, 0, s, r, r);
  }
  function toTable(clientX, clientY) {
    var rc = cv.getBoundingClientRect(), sx = (clientX - rc.left) / G.s - G.rail, sy = (clientY - rc.top) / G.s - G.rail;
    return G.rot ? { x: T.L - sy, y: sx } : { x: sx, y: sy };
  }

  function paintTable(g, balls, o) {
    var rail = G.rail;
    // rails and cloth, in table units around the playing area
    g.fillStyle = COL.rail2;
    C.rrect(g, -rail, -rail, T.L + rail * 2, T.W + rail * 2, rail * 0.9); g.fill();
    g.fillStyle = COL.rail;
    C.rrect(g, -rail + 1, -rail + 1, T.L + rail * 2 - 2, T.W + rail * 2 - 2, rail * 0.8); g.fill();
    g.fillStyle = COL.cloth;
    g.fillRect(0, 0, T.L, T.W);
    g.fillStyle = COL.cloth2;
    g.fillRect(0, 0, T.L, 1.2); g.fillRect(0, T.W - 1.2, T.L, 1.2); g.fillRect(0, 0, 1.2, T.W); g.fillRect(T.L - 1.2, 0, 1.2, T.W);
    // the head string and foot spot
    g.strokeStyle = COL.line; g.lineWidth = 0.4;
    g.beginPath(); g.moveTo(E.HEAD, 1.2); g.lineTo(E.HEAD, T.W - 1.2); g.stroke();
    g.fillStyle = COL.line; g.beginPath(); g.arc(E.FOOT.x, E.FOOT.y, 0.8, 0, Math.PI * 2); g.fill();
    // diamonds on the rails
    g.fillStyle = 'rgba(255,240,210,.55)';
    for (var k = 1; k < 8; k++) if (k !== 4) { var dx = T.L * k / 8; g.beginPath(); g.arc(dx, -rail / 2, 0.8, 0, 7); g.arc(dx, T.W + rail / 2, 0.8, 0, 7); g.fill(); }
    for (k = 1; k < 4; k++) { var dy = T.W * k / 4; g.beginPath(); g.arc(-rail / 2, dy, 0.8, 0, 7); g.fill(); g.beginPath(); g.arc(T.L + rail / 2, dy, 0.8, 0, 7); g.fill(); }
    // pockets
    g.fillStyle = COL.pocket;
    T.pockets.forEach(function (p, i) { g.beginPath(); g.arc(p.x, p.y, i < 4 ? T.corner * 0.74 : T.side * 0.5, 0, Math.PI * 2); g.fill(); });
    if (o && o.aim) paintAim(g, balls, o);
    for (var i = 0; i < balls.length; i++) if (balls[i].inPlay) paintBall(g, balls[i]);
    if (o && o.inHand) {
      var c = balls[0];
      g.strokeStyle = COL.gold; g.lineWidth = 0.6; g.setLineDash([1.6, 1.2]);
      g.beginPath(); g.arc(c.x, c.y, R * 1.9, 0, Math.PI * 2); g.stroke(); g.setLineDash([]);
    }
    if (o && o.cue) paintCue(g, balls[0], o);
  }

  function paintBall(g, b) {
    var r = R, col = ballColor(b.id);
    g.fillStyle = 'rgba(0,0,0,.28)';
    g.beginPath(); g.arc(b.x + r * 0.15, b.y + r * 0.2, r, 0, Math.PI * 2); g.fill();
    g.save();
    g.beginPath(); g.arc(b.x, b.y, r, 0, Math.PI * 2); g.clip();
    g.fillStyle = b.id > 8 ? BALL[0] : col;
    g.fillRect(b.x - r, b.y - r, r * 2, r * 2);
    if (b.id > 8) {
      // the stripe runs across the screen whichever way the table is drawn
      g.fillStyle = col;
      if (G.rot) g.fillRect(b.x - r * 0.55, b.y - r, r * 1.1, r * 2);
      else g.fillRect(b.x - r, b.y - r * 0.55, r * 2, r * 1.1);
    }
    var hl = g.createRadialGradient(b.x - r * 0.35, b.y - r * 0.35, r * 0.1, b.x, b.y, r);
    hl.addColorStop(0, 'rgba(255,255,255,.45)'); hl.addColorStop(0.5, 'rgba(255,255,255,0)'); hl.addColorStop(1, 'rgba(0,0,0,.25)');
    g.fillStyle = hl; g.fillRect(b.x - r, b.y - r, r * 2, r * 2);
    g.restore();
    if (b.id) {
      g.fillStyle = '#FFFDF6';
      g.beginPath(); g.arc(b.x, b.y, r * 0.5, 0, Math.PI * 2); g.fill();
      g.save();
      g.translate(b.x, b.y);
      if (G.rot) g.rotate(Math.PI / 2);
      g.fillStyle = '#1A1A1A';
      g.font = '800 ' + (b.id > 9 ? r * 0.62 : r * 0.72) + 'px system-ui, sans-serif';
      g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(String(b.id), 0, r * 0.05);
      g.restore();
    }
  }

  // The aim line to the first contact, the ghost ball there, where the object
  // ball will go and where the white glances off
  function paintAim(g, balls, o) {
    var c = balls[0], a = Cue.aim(T, balls, c.x, c.y, o.angle, 0), ux = Math.cos(o.angle), uy = Math.sin(o.angle);
    g.save();
    g.beginPath(); g.rect(-R, -R, T.L + 2 * R, T.W + 2 * R); g.clip();
    g.lineCap = 'round';
    g.strokeStyle = 'rgba(255,255,255,.75)'; g.lineWidth = 0.5;
    g.beginPath(); g.moveTo(c.x + ux * R, c.y + uy * R); g.lineTo(a.x, a.y); g.stroke();
    g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 0.45;
    g.beginPath(); g.arc(a.x, a.y, R, 0, Math.PI * 2); g.stroke();
    if (a.ball !== null) {
      var ok = E.targets(F, F.turn).indexOf(a.ball) >= 0 || (F.isBreak && a.ball !== null);
      var b = E.ball({ balls: balls }, a.ball), len = 34 * Math.cos(a.cut) + 6;
      g.strokeStyle = ok ? 'rgba(255,255,255,.85)' : COL.bad; g.lineWidth = 0.6;
      g.beginPath(); g.moveTo(b.x, b.y); g.lineTo(b.x + Math.cos(a.obj) * len, b.y + Math.sin(a.obj) * len); g.stroke();
      if (!ok) {
        g.beginPath(); g.moveTo(a.x - 1.6, a.y - 1.6); g.lineTo(a.x + 1.6, a.y + 1.6); g.moveTo(a.x + 1.6, a.y - 1.6); g.lineTo(a.x - 1.6, a.y + 1.6); g.stroke();
      }
      if (a.cueSpeed > 0.05) {
        g.strokeStyle = 'rgba(255,255,255,.4)'; g.lineWidth = 0.4; g.setLineDash([1.2, 1.2]);
        var cl = 20 * a.cueSpeed + 3;
        g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(a.x + Math.cos(a.cue) * cl, a.y + Math.sin(a.cue) * cl); g.stroke();
        g.setLineDash([]);
      }
    }
    g.restore();
  }

  function paintCue(g, c, o) {
    var ux = Math.cos(o.angle), uy = Math.sin(o.angle), back = R * 1.4 + o.power * 22, len = 64;
    var x1 = c.x - ux * back, y1 = c.y - uy * back, x2 = x1 - ux * len, y2 = y1 - uy * len;
    var gr = g.createLinearGradient(x1, y1, x2, y2);
    gr.addColorStop(0, '#E9E2D0'); gr.addColorStop(0.03, '#E9E2D0'); gr.addColorStop(0.035, '#3B82C4'); gr.addColorStop(0.06, '#D9B57A'); gr.addColorStop(0.7, '#B07A3F'); gr.addColorStop(1, '#3A2414');
    g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = 2.2;
    g.beginPath(); g.moveTo(x1 + 0.6, y1 + 0.8); g.lineTo(x2 + 0.6, y2 + 0.8); g.stroke();
    g.strokeStyle = gr; g.lineWidth = 1.6;
    g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke();
  }

  function draw() {
    if (!F) return;
    var g = cv.getContext('2d');
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, cv.width, cv.height);
    tableTransform(g);
    var balls = run ? run.balls : F.balls, still = !run && !F.over;
    var cue = balls[0] && balls[0].inPlay;
    var showAim = still && cue && (humanTurn() || aiAnim);
    paintTable(g, balls, { aim: showAim, angle: aimA, cue: showAim, power: drag && drag.mode === 'sling' ? power : (power || 0), inHand: still && F.inHand && humanTurn() });
    drawSinks(g);
  }

  function cardPaint() {
    var balls = Cue.clone(F.balls);
    return function (g, W, H) {
      var keep = { s: G.s, rot: G.rot, rail: G.rail };
      var tl = T.L + G.rail * 2, tw = T.W + G.rail * 2, s = Math.min(W / tl, H / tw);
      G.rot = false;
      g.save();
      g.translate((W - tl * s) / 2 + G.rail * s, (H - tw * s) / 2 + G.rail * s);
      g.scale(s, s);
      paintTable(g, balls, null);
      g.restore();
      G.s = keep.s; G.rot = keep.rot;
    };
  }

  // A small ball for the player chips: solid or striped, or both for an open table
  function chipBall(g) {
    var c = el('canvas', { width: 44, height: 44, style: { width: '22px', height: '22px' } }), x = c.getContext('2d');
    var paint = function (cx, id) {
      x.save(); x.beginPath(); x.arc(cx, 22, 18, 0, 7); x.clip();
      x.fillStyle = id > 8 ? BALL[0] : ballColor(id); x.fillRect(0, 0, 44, 44);
      if (id > 8) { x.fillStyle = ballColor(id); x.fillRect(0, 12, 44, 20); }
      x.restore();
      x.strokeStyle = 'rgba(0,0,0,.25)'; x.lineWidth = 2; x.beginPath(); x.arc(cx, 22, 18, 0, 7); x.stroke();
    };
    if (g === 'solid') paint(22, 3);
    else if (g === 'stripe') paint(22, 11);
    else if (g === 'eight') paint(22, 8);
    else { paint(22, 0); }
    return c;
  }

  function drawPlayers() {
    playersRow.innerHTML = '';
    if (F.mode === 'daily') {
      playersRow.appendChild(el('div', { class: 'eb-player eb-player--on' }, [chipBall('eight'), el('div', { class: 'eb-player__text' }, [
        el('div', { class: 'eb-player__name', text: C.t('dailyEb') + ' — ' + C.num(F.daily || '') }),
        el('div', { class: 'eb-player__sub', text: C.t('shots') + ' ' + C.num(F.shots) + ' / ' + C.num(E.DAILY_MAX) + ' · ' + C.t('fouls') + ' ' + C.num(F.fouls[0]) })])]));
      return;
    }
    [0, 1].forEach(function (p) {
      var g = F.groups[p], left = g ? E.onTable(F, g).length : null;
      var sub = g ? gname(g) + ' · ' + C.t('ballsLeft', { n: C.num(left) }) : C.t('openTable');
      if (g && left === 0) sub = gname(g) + ' · 8';
      var box = el('div', { class: 'eb-player' + (F.turn === p && !F.over ? ' eb-player--on' : '') }, [
        chipBall(g && left === 0 ? 'eight' : g),
        el('div', { class: 'eb-player__text' }, [el('div', { class: 'eb-player__name', text: pname(p) }), el('div', { class: 'eb-player__sub', text: sub })])
      ]);
      if (F.mode === 'ai' && p === 1 && (ai || aiAnim)) box.classList.add('eb-thinking');
      playersRow.appendChild(box);
    });
  }

  function drawMsg() {
    var text = msg.text || hint();
    msgEl.textContent = text;
    msgEl.className = 'eb-msg' + (msg.kind ? ' eb-msg--' + msg.kind : '');
  }

  function drawPower() {
    var shown = power > 0 ? power : (kbOn ? kbPower : 0);
    fill.style.width = Math.round(shown * 100) + '%';
    fill.className = 'eb-power__fill' + (power > 0 ? '' : ' eb-power__fill--idle');
    plabel.textContent = power > 0 || kbOn ? C.t('power') + ' ' + C.num(Math.round(shown * 100)) + (C.isRtl() ? '٪' : '%') : C.t('pull');
    powerBar.setAttribute('aria-valuenow', String(Math.round(shown * 100)));
    var off = !humanTurn();
    powerBar.setAttribute('aria-disabled', off ? 'true' : 'false');
    fineL.disabled = off; fineR.disabled = off;
  }

  function render() {
    layout();
    drawPlayers();
    drawMsg();
    drawPower();
    draw();
  }

  /* -------------------------------------------------------------- input */

  // On the table: start on the white to pull back like a slingshot, start
  // anywhere else to aim at the finger. With the ball in hand the first movement
  // decides: straight back from the aim pulls, any other way moves the white (#278).
  cv.addEventListener('pointerdown', function (e) {
    if (!humanTurn()) return;
    e.preventDefault();
    var p = toTable(e.clientX, e.clientY), c = E.ball(F, 0);
    var dc = Math.hypot(p.x - c.x, p.y - c.y), grab = Math.max(R * 2.2, 26 / G.s);
    if (setMsgClear()) drawMsg();
    if (F.inHand && dc < grab) drag = { id: e.pointerId, mode: 'hand', x0: e.clientX, y0: e.clientY, a0: aimA, dx: c.x - p.x, dy: c.y - p.y };
    else if (dc < grab) drag = { id: e.pointerId, mode: 'sling', x0: e.clientX, y0: e.clientY, a0: aimA };
    else { drag = { id: e.pointerId, mode: 'aim' }; aimA = Math.atan2(p.y - c.y, p.x - c.x); }
    kbOn = false;
    try { cv.setPointerCapture(e.pointerId); } catch (er) { /* old browsers */ }
    draw(); drawPower();
  });
  cv.addEventListener('pointermove', function (e) {
    if (!drag || e.pointerId !== drag.id || !humanTurn()) return;
    var p = toTable(e.clientX, e.clientY), c = E.ball(F, 0);
    if (drag.mode === 'hand') {
      var h0 = toTable(drag.x0, drag.y0);
      if (Math.hypot(p.x - h0.x, p.y - h0.y) * G.s < 8) return;
      drag.mode = Cue.pullsBack(aimA, p.x - h0.x, p.y - h0.y) ? 'sling' : 'place';
    }
    if (drag.mode === 'place') {
      var nx = p.x + drag.dx, ny = p.y + drag.dy;
      if (F.kitchen) nx = Math.min(nx, E.HEAD);
      nx = Math.max(R, Math.min(T.L - R, nx)); ny = Math.max(R, Math.min(T.W - R, ny));
      if (E.legalPlace(F, nx, ny)) { c.x = nx; c.y = ny; }
    } else if (drag.mode === 'sling') {
      var q0 = toTable(drag.x0, drag.y0), vx = q0.x - p.x, vy = q0.y - p.y, len = Math.hypot(vx, vy) * G.s;
      if (len > 8) aimA = Math.atan2(vy, vx);
      power = Math.max(0, Math.min(1, (len - 8) / 150));
      drawPower();
    } else aimA = Math.atan2(p.y - c.y, p.x - c.x);
    draw();
  });
  function endTableDrag(e) {
    if (!drag || e.pointerId !== drag.id) return;
    var d = drag;
    drag = null;
    if (d.mode === 'sling') {
      // a short pull is a change of mind, not a shot
      if (e.type === 'pointerup' && power >= 0.04 && humanTurn()) { shoot({ angle: aimA, power: power }); return; }
      power = 0; aimA = d.a0;
    }
    if (d.mode === 'place') save();
    draw(); drawPower();
  }
  cv.addEventListener('pointerup', endTableDrag);
  cv.addEventListener('pointercancel', endTableDrag);
  function setMsgClear() { if (msg.text) { setMsg('', ''); return true; } return false; }

  // The power bar: pull along it, let go to shoot
  var pdrag = null;
  powerBar.addEventListener('pointerdown', function (e) {
    if (!humanTurn()) return;
    e.preventDefault();
    pdrag = { id: e.pointerId, x0: e.clientX, w: powerBar.getBoundingClientRect().width };
    power = 0; kbOn = false;
    try { powerBar.setPointerCapture(e.pointerId); } catch (er) { /* old browsers */ }
    drawPower();
  });
  powerBar.addEventListener('pointermove', function (e) {
    if (!pdrag || e.pointerId !== pdrag.id) return;
    power = Math.max(0, Math.min(1, Math.abs(e.clientX - pdrag.x0) / (pdrag.w * 0.8)));
    drawPower(); draw();
  });
  function endPower(e) {
    if (!pdrag || e.pointerId !== pdrag.id) return;
    pdrag = null;
    if (e.type === 'pointerup' && power >= 0.04 && humanTurn()) { shoot({ angle: aimA, power: power }); return; }
    power = 0; drawPower(); draw();
  }
  powerBar.addEventListener('pointerup', endPower);
  powerBar.addEventListener('pointercancel', endPower);

  // Fine turn buttons, repeating while held, for the last fraction of a degree
  function holdTurn(btn, sign) {
    var timer = null;
    var stop = function () { if (timer) { clearInterval(timer); timer = null; } };
    btn.addEventListener('pointerdown', function (e) {
      if (!humanTurn()) return;
      e.preventDefault();
      aimA += sign * 0.002; draw();
      stop();
      var n = 0;
      timer = setInterval(function () { if (!humanTurn()) { stop(); return; } n++; aimA += sign * (n > 15 ? 0.008 : 0.002); draw(); }, 60);
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (t) { btn.addEventListener(t, stop); });
    window.addEventListener('denny-pause', stop);
  }
  holdTurn(fineL, -1);
  holdTurn(fineR, 1);

  window.addEventListener('keydown', function (e) {
    if (!F || document.querySelector('.ch-scrim') || e.ctrlKey || e.metaKey || e.altKey) return;
    if (!humanTurn()) return;
    var k = e.key, step = e.shiftKey ? 0.002 : 0.02;
    if (k === 'ArrowLeft' || k === 'ArrowRight') {
      e.preventDefault();
      aimA += (k === 'ArrowRight' ? 1 : -1) * step;
      draw(); return;
    }
    if (k === 'ArrowUp' || k === 'ArrowDown') {
      e.preventDefault();
      kbOn = true;
      kbPower = Math.max(0.05, Math.min(1, kbPower + (k === 'ArrowUp' ? 0.05 : -0.05)));
      drawPower(); return;
    }
    if (k === ' ' || k === 'Enter') { e.preventDefault(); shoot({ angle: aimA, power: kbPower }); return; }
    // WASD by physical key moves the white with ball in hand, on any layout
    var mv = { KeyW: [0, -1], KeyS: [0, 1], KeyA: [-1, 0], KeyD: [1, 0] }[e.code];
    if (mv && F.inHand) {
      e.preventDefault();
      var c = E.ball(F, 0), sx = mv[0] * 2, sy = mv[1] * 2;
      // screen directions, turned into table directions when the table is upright
      var tx = G.rot ? -sy : sx, ty = G.rot ? sx : sy;
      if (E.legalPlace(F, c.x + tx, c.y + ty)) { c.x += tx; c.y += ty; draw(); }
    }
  });

  window.addEventListener('resize', function () { if (F) render(); window.DennyGameBridge.ready(window.innerWidth, window.innerHeight); });
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    if (mq.addEventListener) mq.addEventListener('change', function () { setTimeout(function () { readColors(); draw(); }, 60); });
  }

  /* --------------------------------------------------------------- help */

  function kb(k, what) {
    return el('div', { class: 'ch-item' }, [el('div', { class: 'ch-item__label', text: what }), el('span', { class: 'ch-badge', text: k })]);
  }
  function showHelp() {
    C.ui.modal({
      title: C.t('help'),
      body: [
        el('p', { class: 'ch-dim', text: C.t('rules') }),
        el('h3', { style: { 'margin-top': 'var(--s-4)' }, text: C.t('keyboard') }),
        el('div', { class: 'ch-list' }, [
          kb('← →', C.t('kbAim')), kb('Shift + ← →', C.t('kbFine')), kb('↑ ↓', C.t('kbPower')),
          kb('Space / Enter', C.t('kbShoot')), kb('W A S D', C.t('kbPlace'))
        ])
      ],
      actions: [
        { label: C.t('tutorial'), onClick: function () { ctx.showTutorial(TUT); } },
        { label: C.t('done'), kind: 'primary' }
      ]
    });
  }

  function svgBall(x, y, id) {
    var col = ballColor(id);
    if (id > 8) return '<circle cx="' + x + '" cy="' + y + '" r="9" fill="#F4F1EA"/><rect x="' + (x - 9) + '" y="' + (y - 4.5) + '" width="18" height="9" fill="' + col + '"/><circle cx="' + x + '" cy="' + y + '" r="9" fill="none" stroke="rgba(0,0,0,.3)"/>';
    return '<circle cx="' + x + '" cy="' + y + '" r="9" fill="' + col + '" stroke="rgba(0,0,0,.3)"/>' + (id === 8 ? '<circle cx="' + x + '" cy="' + y + '" r="4" fill="#fff"/>' : '');
  }
  function art(inner) {
    return '<svg viewBox="0 0 220 110" width="100%"><rect x="10" y="8" width="200" height="94" rx="10" fill="var(--eb-rail)"/><rect x="20" y="18" width="180" height="74" rx="3" fill="var(--eb-cloth)"/>' +
      '<circle cx="21" cy="19" r="6" fill="var(--eb-pocket)"/><circle cx="199" cy="19" r="6" fill="var(--eb-pocket)"/><circle cx="21" cy="91" r="6" fill="var(--eb-pocket)"/><circle cx="199" cy="91" r="6" fill="var(--eb-pocket)"/><circle cx="110" cy="18" r="5" fill="var(--eb-pocket)"/><circle cx="110" cy="92" r="5" fill="var(--eb-pocket)"/>' + inner + '</svg>';
  }
  var TUT = [
    { title: C.t('tutTitle1'), text: C.t('tutText1'), art: art('<path d="M60 70L150 40" stroke="#fff" stroke-width="1.5" stroke-dasharray="4 3"/><rect x="0" y="0" width="70" height="4" rx="2" fill="#B07A3F" transform="translate(56 71) rotate(161.6) "/>' + svgBall(60, 70, 0) + svgBall(160, 37, 3)) },
    { title: C.t('tutTitle2'), text: C.t('tutText2'), art: art(svgBall(70, 50, 2) + svgBall(95, 70, 5) + svgBall(130, 45, 12) + svgBall(160, 66, 10) + svgBall(50, 75, 0)) },
    { title: C.t('tutTitle3'), text: C.t('tutText3'), art: art(svgBall(150, 40, 8) + svgBall(70, 65, 0) + '<path d="M78 62L190 22" stroke="#fff" stroke-width="1.5" stroke-dasharray="4 3"/>') }
  ];

  /* -------------------------------------------------------------- start */

  var saved = ctx.loadSave();
  if (dailyDate) {
    // The daily table has its own save slot, so a half-played day continues
    if (validSave(saved) && saved.f.daily === dailyDate) restore(saved);
    else newGame({ daily: dailyDate });
    if (C.stats.dailyDone('eightball', dailyDate)) {
      var rec = C.stats.dailyOf(dailyDate).eightball;
      C.ui.toast({ icon: 'check', title: C.t('dailyDone'), sub: rec.label });
    }
    // The bilingual Denny Games guide replaces the upstream first-run tutorial.
  } else if (validSave(saved) && saved.f.mode !== 'daily') {
    restore(saved);
  } else {
    newGame({ mode: prefs.mode, level: prefs.level });
    // The bilingual Denny Games guide replaces the upstream first-run tutorial.
  }
  setTimeout(function () { if (F) render(); window.DennyGameBridge.ready(window.innerWidth, window.innerHeight); }, 40);
})();