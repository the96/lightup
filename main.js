const FILE_PREFIX = "https://pub-4b13c7fd75994c589dfcb821cf58f84b.r2.dev"

async function loadFilenames(memberName) {

//   const text = `
// 1_あいさつ,ありがとうございます！.mp3
// 3_その他,あーいーうーえーおー.mp3
// 3_その他,あーん.mp3
// 3_その他,おい！くじだよ！.mp3
// 1_あいさつ,きこえておりますでしょうか.mp3
// 1_あいさつ,きこえてますかー.mp3
// 3_その他,きづいてよ！.mp3
// 3_その他,ばか.mp3
// 1_あいさつ,ぱにゃにゃんだー.mp3
// 1_あいさつ,みなのしゅぱにゃにゃんだー.mp3
// 2_おねえさん,みぷちおねえさんだよ.mp3
// 1_あいさつ,よろしくおねがいしまーす.mp3
// 1_あいさつ,スーパーチャットありがとうございます.mp3
// 1_あいさつ,雑談リレー務めさせていただきます.mp3
// `;

  const text = await fetch(`${memberName}.csv`).then(res => res.text());
  const lines = text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);

  const result = {};

  for (const line of lines) {
    const [category, filename] = line.split(",").map(s => s.trim());

    if (!category || !filename) continue;

    if (!result[category]) {
      result[category] = [];
    }
    result[category].push(filename);
  }

  return result;
}

function getVolume() {
  const volume = document.getElementById('volume').value;
  return volume ?? 0.3;
}

function getAsyncPlay() {
  const asyncPlay = document.getElementById('toggle-async-play').checked;
  return asyncPlay;
}

var prevPlayAudioObject = null;

function createButtons(memberName, categoryToFilenames) {
  var container = document.getElementById('buttons');
  keys = Object.keys(categoryToFilenames);
  sorted_keys = keys.sort((a, b) => {
    const a_num = parseInt(a.split('_')[0]);
    const b_num = parseInt(b.split('_')[0]);
    return a_num - b_num;
  });

  sorted_keys.forEach((category) => {    
    var categoryHeader = document.createElement('h2');
    categoryHeader.textContent = category.replace(/^\d+_*/, '');
    container.appendChild(categoryHeader);
    
    var filenames = categoryToFilenames[category];
    filenames.forEach((filename) => {
      var button = document.createElement('button');
      button.textContent = filename.replace('.mp3', '');
      button.onclick = function() {
        path = `${FILE_PREFIX}/${memberName}/${filename}`
        var audio = new Audio(path);
        audio.volume = getVolume();

        if (!getAsyncPlay()) {
          if (prevPlayAudioObject) {
            prevPlayAudioObject.pause();
            prevPlayAudioObject.currentTime = 0;
          }
          prevPlayAudioObject = audio;
        }

        audio.play();
      };
      container.appendChild(button);
    });
  });
}

async function loadMembers() {
//   const text = `
// mipu,甘苺みぷ,@amaimipu,@AmaiMipu
// `
  const text = await fetch(`members.csv`).then(res => res.text());
  const lines = text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);
    console.log(lines);

  const result = {};

  for (const line of lines) {
    const [key, name, x, youtube] = line.split(",").map(s => s.trim());

    if (!key || !name) continue;
    if (result[key]) {
      console.error(`Duplicate member key: ${key}`);
      continue;
    }

    result[key] = {name, x, youtube};
  }

  return result;
}

function createMemberLink(keyToMember) {
  var container = document.getElementById('members');
  Object.keys(keyToMember).forEach((key) => {    
    var member = keyToMember[key]['name'];
    var li = document.createElement('li');
    container.appendChild(li);

    var link = document.createElement('a');
    link.href = `index.html?member=${key}`;
    link.textContent = member;
    li.appendChild(link);
  });
}

function getMemberKey(memberKeys) {
  const urlParams = new URLSearchParams(window.location.search);
  const key = urlParams.get('member');
  return memberKeys.includes(key) ? key : null;
}

function hideMemberContent() {
  var container = document.getElementById('member-content');
  container.style.display = 'none';
}

function setMemberName(name) {
  var container = document.getElementById('name');
  container.textContent = name;
}

// {name, x, youtube}
function createLinks(member) {
  name = member['name'];
  x = member['x'];
  youtube = member['youtube'];

  var container = document.getElementById('links');
  var xListItem = document.createElement('li');
  var xLink = document.createElement('a');
  xLink.href = `https://x.com/${x.replace(/^@/, '')}`;
  xLink.textContent = `X: ${x}`;
  xListItem.appendChild(xLink);
  container.appendChild(xListItem);

  var youtubeListItem = document.createElement('li');
  var youtubeLink = document.createElement('a');
  youtubeLink.href = `https://www.youtube.com/${youtube}`;
  youtubeLink.textContent = `YouTube: ${youtube}`;
  youtubeListItem.appendChild(youtubeLink);
  container.appendChild(youtubeListItem);
}

async function main() {
  const keyToMember = await loadMembers();
  createMemberLink(keyToMember);

  const memberName = getMemberKey(Object.keys(keyToMember));
  
  if (memberName) {
    const categoryToFilenames = await loadFilenames(memberName);
    setMemberName(keyToMember[memberName]['name']);
    createButtons(memberName, categoryToFilenames);
    createLinks(keyToMember[memberName]);
  } else {
    hideMemberContent();
  }
}

main().then();
