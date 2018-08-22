const express = require('express');
const _  = require('lodash');
const shortid = require('shortid');
const cors = require('cors');

const Post = require('./models/post');

const app = express();

app.use(express.json());
app.use(cors());

let posts = [];

app.get('/post', (req, res) => {
  res.json(posts);
});

app.get('/post/:id', (req, res) => {
  console.log('params:', req.params);
  console.log('query:', req.query);
  const post = _.find(posts, x => x.id === req.params.id);
  res.json(post);
});

app.put('/post/:id', (req, res) => {
  const index = _.findIndex(posts, x => x.id === req.params.id);
  if (index > -1 ) {
    const request = _.pick(req.body, Object.keys(Post));
    posts[index] = { ...posts[index], ...request };
    res.json(true)
  } else {
    res.json(false)
  }
});

app.delete('/post/:id', (req, res) => {
  const removedElements = _.remove(posts, x => x.id === req.params.id);
  res.json(!!removedElements.length);
})

app.post('/post', (req, res) => {
  console.log('body:', req.body);

  let request = _.pick(req.body, Object.keys(Post));
  let post = { ...Post, ...request };

  post.id = shortid.generate();

  posts.push(post);

  res.json(post);
});

app.use((err, req, res, next) => {
  console.error('ERROR FOUND:', err);
  res.status(500).send('Something broke!');
});

app.listen(8080, () => {
  console.log(`Server is now up @ port: 8080`);
});
