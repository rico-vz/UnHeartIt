const cheerio = require('cheerio');
const colorette = require('colorette');
const axios = require('axios');
const fs = require('fs');

async function main() {

    const config = JSON.parse(fs.readFileSync('config.json'));
    const name = config.name;
    const login_token = config.login_token;

    let entryIds = [];

    let page = 1;

    while (true) {
        const response = await axios.get(`https://weheartit.com/${name}?scrolling=true&page=${page}`, {
            headers: {
                cookie: `login_token=${login_token}; auth=yes`,
            },
        });

        // Find the <a> with the following class: "js-entry-detail-link js-blc js-blc-t-entry"
        // These are the links to the posts that we want to unheart
        const $ = cheerio.load(response.data);
        const entryLinks = $('.js-entry-detail-link.js-blc.js-blc-t-entry');

        if (entryLinks.length === 0) {
            console.log(colorette.green('We have unhearted everything!'));
            break;
        }

        entryLinks.each((i, element) => {
            const href = $(element).attr('href');
            const entryId = href.match(/\/entry\/(\d+)/)[1];
            entryIds.push(entryId);
        });

        if (hasDuplicate(entryIds)) {
            for (const entryId of entryIds) {
                const delay = Math.random() * 400 + 100;

                await new Promise(resolve => setTimeout(resolve, delay));

                try {
                    const response = await axios.post(`https://weheartit.com/entry/${entryId}/heart`, {
                        _method: 'delete',
                    }, {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            cookie: `login_token=${login_token}; auth=yes`,
                        },
                    });
                    console.log(colorette.green(`Unhearted entry ${entryId}`));
                } catch (error) {
                    // If we get a "Too many requests" error, wait 5 seconds and continue
                    // This seems to happen very inconsistently 
                    if (error.response.statusText === 'Too Many Requests') {
                        console.log(colorette.red('Rate limited, waiting 5 seconds...'));
                        await new Promise(resolve => setTimeout(resolve, 5000));
                        continue;
                    }
                }
            }
            entryIds = [];
            page = 1;
        } else {
            page++;
        }
    }
}

function hasDuplicate(array) {
    return new Set(array).size !== array.length;
}

main();
