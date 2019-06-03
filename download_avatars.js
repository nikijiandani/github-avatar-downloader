var secret = require('./secrets');
var request = require('request');

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

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  result.forEach(element => {
    console.log(element["avatar_url"]);
  });;
});