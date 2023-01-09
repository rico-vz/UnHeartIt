# UnHeartIt

A script to unheart all posts on a [WeHeartIt](https://weheartit.com/) account.

## How it works

This script logs into your WeHeartIt account and goes through all of your posts, unhearting each one. It does this by making HTTP requests to the WeHeartIt API using the [axios](https://github.com/axios/axios) library. To parse the HTML response, it uses the [cheerio](https://github.com/cheeriojs/cheerio) library. 

The script reads in a `config.json` file with your WeHeartIt account name and login token. It then loads the first page of your posts, parses the HTML response to find the links to each post, and unhearts each post using the API. If it finds that it has already unhearted a post, it will reset and start unhearting again from the first page.

## Usage

1. Make sure you have [Node.js](https://nodejs.org/) installed.
2. Clone this repository and navigate to the directory:
3. 
```bash
git clone https://github.com/rico-vz/UnHeartIt.git
cd weheartit-unheart-all
```

4. Edit the `config.json` file in the root directory with your WeHeartIt account name and login token:
```json
{
  "name": "your-username",
  "login_token": "your-login-token"
}
```
5. Install the dependencies:
```bash
npm install
```
6. Run the script:
```bash
node index.js
```

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.