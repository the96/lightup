const FILE_PREFIX = "https://pub-4b13c7fd75994c589dfcb821cf58f84b.r2.dev"

async function loadFilenames(memberName) {

//   const dummy_csv_text = `
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
    .filter(Boolean); // 空行除去

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

function createButtons(memberName, category_to_filenames) {
  var container = document.getElementById('buttons');
  keys = Object.keys(category_to_filenames);
  sorted_keys = keys.sort((a, b) => {
    const a_num = parseInt(a.split('_')[0]);
    const b_num = parseInt(b.split('_')[0]);
    return a_num - b_num;
  });

  sorted_keys.forEach((category) => {    
    var categoryHeader = document.createElement('h2');
    categoryHeader.textContent = category.replace(/^\d+_*/, '');
    container.appendChild(categoryHeader);
    
    var filenames = category_to_filenames[category];
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

const memberName = 'mipu'
loadFilenames(memberName).then(filenames => {
  console.log(filenames);
  createButtons(memberName, filenames);
});