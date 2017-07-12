const fs = require('fs');
const exec = require('child_process').exec;

const cmd = 'git log -1 --format="%h %at"';

fs.readFile('src/metadata.json', (err, content) => {
  if (err) throw err;
  const metadata = JSON.parse(content);
  exec(cmd, (error, stdout, stderr) => {
    const [build, buildTimestamp] = stdout.trim().split(' ');
    metadata.build = build;
    metadata.buildTimestamp = Number(buildTimestamp) * 1000;
    fs.writeFile('src/metadata.json', JSON.stringify(metadata, null, 2), 'utf-8', (err) => {
      if (err) throw err;
    });
  });
});
