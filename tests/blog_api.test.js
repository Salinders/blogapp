const { test, after, beforeEach, describe} = require('node:test');
const assert = require('node:assert');

const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);

const helper = require('./test_helper')

const Blog = require('../models/blogs')


beforeEach(async () => {
  await Blog.deleteMany({});

  for(let blog of helper.initialBlogs){
    let blogObject = new Blog(blog)
    await blogObject.save()
  }

});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('all notes are returned', async () => {
  const response = await api.get('/api/blogs');

  assert.strictEqual(response.body.length, helper.initialBlogs.length);
});

test('one of the blogs have title Up', async () => {
  const response = await api.get('/api/blogs');

  const titles = response.body.map(blog => blog.title);
  assert(titles.includes('Up'));
});

describe('viewing a specific blog',  () =>{

    test('succeeds with a valid blog', async() => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToView = blogsAtStart[0]

        const resultBlog = await api
          .get(`/api/blogs/${blogToView.id}`)
          .expect(200)
          .expect('Content-Type', /application\/json/)
    assert.deepStrictEqual(resultBlog.body, blogToView)
    })

    test('fails with statuscode 400 if blog doesnt exist', async ()=>{
        const noneExistingId = await helper.nonExistingId()

        await api
          .get(`/api/blogs/${noneExistingId}`)
          .expect(404)
    })  
    test('fails with statuscode 400 if id is not valid ', async ()=> {
        const invalidId = '548rgr5t1e54ry47'

        await api
         .get(`/api/blogs/${invalidId}`)
         .expect(400)
    })
})
describe('deletion of a blog',  ()=> {
    test('succeeds with status code 204 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
          .delete(`/api/blogs/${blogToDelete.id}`)
          .expect(204)
        
        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length,blogsAtStart.length - 1 )

        const titles = blogsAtEnd.map(b => b.title)
        assert(!titles.includes(blogToDelete.title))
    })
})

describe('addition of a new blog', () => {
    test('suceeds with valid data', async() => {
        const newBlog  ={
            title: "to be or not to be",
            author: "Cena",
            url: "yahoo.com",
            likes: 5,
        }

        await api
          .post('/api/blogs')
          .send(newBlog)
          .expect(201)
          .expect('Content-Type', /application\/json/)
        
        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length,helper.initialBlogs.length + 1 )

        const title = blogsAtEnd.map(b => b.title)
        assert(title.includes('to be or not to be'))
    })

    test('fails with status code 400 if title or author missing', async() => {
        const newBlog = {
            url: 'yahoo.com',
            likes: 8,
        }
        await api 
          .post('/api/blogs')
          .send(newBlog)
          .expect(400)
        
        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length,helper.initialBlogs.length)
    
          
    })
  
})

after(async () => {
  await Blog.deleteMany({});
  await mongoose.connection.close();
});
