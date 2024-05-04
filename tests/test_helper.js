const Blog = require('../models/blogs');
const User = require('../models/users');


const initialBlogs = [
  {
    title: "Up",
    author: "Disney",
    url: "disney.com",
    likes: 55,
  },
  {
    title: "Drive",
    author: "Ryan",
    url: "google.com",
    likes: 89,
  },
]

const nonExistingId = async () => {
    const blog = new Blog({
    title: "to be or not to be",
    author: "Cena",
    url: "yahoo.com",
    likes: 5,
    id: "6634cec5e0549f4abdb8b94e"
})
    await blog.save()
    await blog.deleteOne()
  
    return blog._id.toString()
  }
  
  const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
  }

  const usersInDb = async () =>{
    const users = await User.find({})
    return users.map(u => u.toJSON())
  }
  
  module.exports = {
    initialBlogs, nonExistingId, blogsInDb, usersInDb
  }