var secret = require('./secrets');
var request = require('request');
var fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors?client_secret=" + secret ,
    headers: {
      'User-Agent': secret.GITHUB_ID,
      'Authorization': "token " + secret.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    let data = JSON.parse(body);
    cb(err, data);
  });
}

function downloadImageByURL(url, filePath) {
  request.get(url)
    .on('error', function (err) {
    console.log("Errors:", err); 
    })
    .on('response', function (response) {
      console.log('Downloading image...'); 
      console.log('Response Status Code: ', response.statusCode);
    })
    .pipe(fs.createWriteStream(filePath))
    .on('finish', function () {
      console.log("Download complete.")
    });   
}

// downloadImageByURL('https://avatars1.githubusercontent.com/u/43004?v=4', 'avatars/pbakaus.jpg');

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  const dirName = './avatars';
  if(!fs.existsSync(dirName)){
    fs.mkdirSync(dirName);
  }
  result.forEach(element => {
    downloadImageByURL(element['avatar_url'], dirName + '/' + element['login'] + '.jpg');
  });;
});