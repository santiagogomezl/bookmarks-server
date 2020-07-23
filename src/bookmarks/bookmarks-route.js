const express = require('express')
const { bookmarks } = require('../store')
const { v4: uuid } = require('uuid')
const logger = require('../logger')

const bookmarksRouter = express.Router()
const bodyParser = express.json();

bookmarksRouter
  .route('/bookmarks')
  .get((req, res) => {
    res.json(bookmarks)
  })
  .post(bodyParser, (req, res) => {
    const { url, title, rating, description } = req.body;
      
    if (!url) {
        logger.error(`Url is required`);
        return res
        .status(400)
        .send('Invalid data');
    }

    if (!title) {
        logger.error(`Title is required`);
        return res
            .status(400)
            .send('Invalid data');
        }

    if (!rating) {
        logger.error(`Rating is required`);
        return res
            .status(400)
            .send('Invalid data');
    }

    const id = uuid();
    
    const bookmark = {
        id,
        url,
        title,
        rating,
        description: description ? description : ''
    };
    
    bookmarks.push(bookmark);
    
    logger.info(`Bookmark with id ${id} created`);
    
    res
        .status(201)
        .location(`http://localhost:8000/bookmarks/${id}`)
        .json({id});
  })


bookmarksRouter
  .route('/bookmarks/:id')
  .get((req, res) => {
    const { id } = req.params;
    const bookmark = bookmarks.find(b => b.id == id);
  
    if (!bookmark) {
      logger.error(`Bookmark with id ${id} not found.`);
      return res
        .status(404)
        .send('Bookmark Not Found');
    }
  
    res.json(bookmark);
  })
  .delete((req, res) => {
    const { id } = req.params;
  
    const bookmarkIndex = bookmarks.findIndex(b => b.id == id);
  
    if (bookmarkIndex === -1) {
      logger.error(`Bookmark with id ${id} not found.`);
      return res
        .status(404)
        .send('Not Found');
    }
  
    bookmarks.splice(bookmarkIndex, 1);
  
    logger.info(`Bookmark with id ${id} deleted.`);
    res
      .status(204)
      .end();
  })

module.exports = bookmarksRouter