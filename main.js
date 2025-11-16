const FILE_PREFIX = "https://pub-4b13c7fd75994c589dfcb821cf58f84b.r2.dev/"

async function loadFilenames(memberName) {
  const text = await fetch(`${memberName}.csv`).then(res => res.text());
  const lines = text
    .split(/\r?\n/)
    .map(s => s.trim())
    .filter(Boolean);

  console.log(lines);
  return lines;
}

function createButtons(memberName, filenames) {
  var container = document.getElementById('buttons');
  filenames.forEach(function(filename) {
    var button = document.createElement('button');
    button.textContent = filename.replace('.mp3', '');
    button.onclick = function() {
      var audio = new Audio(`${FILE_PREFIXO}/${memberName}/${filename}`);
      audio.play();
    };
    container.appendChild(button);
  });

}

memberName = 'mipu'
filenames = loadFilenames(memberName);
createButtons(memberName, filenames);