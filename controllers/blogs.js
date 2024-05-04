const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')
const User = require('../models/users')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {name:1})
        response.json(blogs)
      })

blogsRouter.get('/:id', async (request, response) =>{
    const blog = await Blog.findById(request.params.id)
    if(blog){
        response.json(blog)
    }else{
        response.status(404).end()
    }
     
})
  
blogsRouter.post('/',  async (request, response) => {
    const body = request.body
    if(!body.title ||!body.author){
        return response.status(400).json({
            error: 'content missing'
        })
    }
    const user = await User.findById(body.userId)

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user.id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async(request, response) =>{
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()

})


module.exports = blogsRouter