const dummy = (blogs) => {
    return 1
  }
  


const totalLikes = (blogs) => {
  const total = blogs.map(blog => blog.likes)
  const sum = total.reduce((sum, item)=> sum + item,0)
   return sum
  }

const favoriteBlog = (blogs) => {
 /*  const initial = blogs.map(({title, author, likes}) => ({title, author, likes}))
  const likes = blogs.map(blog => blog.likes)
  const indexOfBiggestLike = likes.indexOf(Math.max(...likes))
  const favBlog =  blogs[indexOfBiggestLike] */

  const favBlog2 = blogs.reduce((prev, curr) => prev.likes < curr.likes? curr : prev)
  return ({title:favBlog2.title, author: favBlog2.author, likes: favBlog2.likes})

 
 

}



module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  }