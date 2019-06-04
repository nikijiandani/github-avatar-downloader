//declare dependencies
var secret = require('./secrets');
var request = require('request');
var fs = require('fs');

//Welcome message
console.log('Welcome to the GitHub Avatar Downloader!');


function getRepoContributors(repoOwner, repoName, cb) {
  //declare object to use for request
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': secret.GITHUB_ID,
      'Authorization': "token " + secret.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    //parse body string to convert to JSON
    let data = JSON.parse(body);
    console.log('Status code : ', res.statusCode);
    console.log('Status message : ', res.statusMessage)
    if(res.statusCode !== 200){
      console.log(`You have encountered an error. Please check your arguments and try again. Error code: ${res.statusCode}`);
    } else {
      //pass data to callback
      cb(err, data);
    }
  });
}

function downloadImageByURL(url, filePath) {
  //send get request to url
  request.get(url)
    .on('error', function (err) {
    console.log("Errors:", err); 
    })
    //
    .on('response', function (response) {
      console.log('Response Status Code: ', response.statusCode);
      console.log('Downloading image...');
    })
    .pipe(fs.createWriteStream(filePath))
    .on('finish', function () {
      console.log("Download complete.")
    });   
}
//get arguments from the command line
let args = process.argv.slice(2);
if(args.length < 2){
  console.log('Error: Enter two arguments, a repository owner and the respository name');
} else {
  getRepoContributors(args[0], args[1], function(err, result) {
    console.log("Errors:", err);
    //declare the desired directory name
    const dirName = './avatars';
    //if the directory doesn't exist
    if(!fs.existsSync(dirName)){
      //create a new directory
      fs.mkdirSync(dirName);
    }
    
    result.forEach(element => {
      downloadImageByURL(element['avatar_url'], dirName + '/' + element['login'] + '.jpg');
    });;
  });
}