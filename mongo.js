const mongoose = require('mongoose')

const password = process.argv[2]
const title = process.argv[3]
const author = process.argv[4]


const url =
  `mongodb+srv://dejentesfaldet16:${password}@cluster0.chkqbww.mongodb.net/TestBlog?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
})



const Person = mongoose.model('Blog', blogSchema)

const person = new Person({
    title: title,
    author: author
})

if (process.argv.length===5) {
    person.save().then(result => {
        console.log('person saved')
        mongoose.connection.close()
      })

  
  }else if(process.argv.length === 3){
    Person.find({}).then(result => {
        result.forEach(person =>{
            console.log(person)
        })
        mongoose.connection.close()
    })

  }else{
    console.log('give password as argument')
    process.exit(1)
  }

  


 