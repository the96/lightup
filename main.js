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
// 2_かわいい,みぷちおねえさんだよ.mp3
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
        console.log(path);
        var audio = new Audio(path);
        audio.play();
      };
      container.appendChild(button);
    });
  });

}

async function loadMembers() {
//   const text = `
// mipu,甘苺みぷ  
// `
  const text = await fetch(`members.csv`).then(res => res.text());
  const lines = text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);
    console.log(lines);

  const result = {};

  for (const line of lines) {
    const [key, member] = line.split(",").map(s => s.trim());

    if (!key || !member) continue;

    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(member);
  }

  return result;
}

function createMemberLink(keyToMember) {
  var container = document.getElementById('members');
  Object.keys(keyToMember).forEach((key) => {    
    var members = keyToMember[key];
    members.forEach((member) => {
      var li = document.createElement('li');
      container.appendChild(li);

      var link = document.createElement('a');
      link.href = `index.html?member=${key}`;
      link.textContent = member;
      li.appendChild(link);
    });
  });
}

function getMemberKey() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('member');
}

function hideMemberContent() {
  var container = document.getElementById('member-content');
  container.style.display = 'none';
}

async function main() {
  const keyToMember = await loadMembers();
  createMemberLink(keyToMember);

  const memberName = getMemberKey();
  
  console.log(memberName);
  if (memberName) {
    const categoryToFilenames = await loadFilenames(memberName);
    createButtons(memberName, categoryToFilenames);
  } else {
    hideMemberContent();
  }
}

main().then();
