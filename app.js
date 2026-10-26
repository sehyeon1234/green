// 조항데이터.json 을 읽어 카드로 표시하고, 본문에 검색어가 포함된 조만 필터링한다.
let data = [];
const q = document.getElementById('q');
const list = document.getElementById('list');
const count = document.getElementById('count');

fetch('조항데이터.json')
  .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
  .then(d => { data = d; update(); })
  .catch(() => {
    count.textContent = '';
    list.textContent = '조항 데이터를 불러오지 못했습니다. (file:// 직접 열기가 아닌 웹서버/Vercel 로 접속하세요)';
  });

q.addEventListener('input', update);

function update() {
  const kw = q.value.trim().toLowerCase();
  render(kw ? data.filter(a => a.본문.toLowerCase().includes(kw)) : data, kw);
}

// 사용자/데이터 문자열은 textContent 로만 삽입(XSS 방지), 일치 부분만 <mark> 처리
function highlight(el, text, kw) {
  if (!kw) { el.textContent = text; return; }
  const lower = text.toLowerCase();
  let i = 0, j;
  while ((j = lower.indexOf(kw, i)) !== -1) {
    el.append(text.slice(i, j));
    const m = document.createElement('mark');
    m.textContent = text.slice(j, j + kw.length);
    el.append(m);
    i = j + kw.length;
  }
  el.append(text.slice(i));
}

function render(arr, kw) {
  count.textContent = `결과 ${arr.length}건`;
  list.replaceChildren();
  if (!arr.length) {
    const p = document.createElement('div');
    p.className = 'empty';
    p.textContent = '검색 결과가 없습니다.';
    list.append(p);
    return;
  }
  for (const a of arr) {
    const card = document.createElement('div');
    card.className = 'card';
    const label = document.createElement('span');
    label.className = 'label';
    label.textContent = a.조;
    const title = document.createElement('div');
    title.className = 'title';
    title.textContent = a.제목;
    const body = document.createElement('div');
    body.className = 'body';
    highlight(body, a.본문, kw); // 전문 표시(잘라내면 잘린 부분의 일치가 안 보임)
    card.append(label, title, body);
    list.append(card);
  }
}
