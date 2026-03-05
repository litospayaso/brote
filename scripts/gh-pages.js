import ghpages from 'gh-pages';

ghpages.publish('gh-pages', function(err) {
  if (err) {
    console.log('\x1b[31m', 'ERROR: ', '\x1b[4m\x1b[31m', err, '\x1b[0m');
  } else {
    console.log('*---------------------------------------------------------------------------*');
    console.log('|                                                                           |');
    console.log('|     ✨⭐', '\x1b[32m', 'released at: ', '\x1b[4m\x1b[36m', 'https://litospayaso.github.io/brote', '\x1b[0m', '⭐✨         |');
    console.log('|                                                                           |');
    console.log('*---------------------------------------------------------------------------*');
  }
});