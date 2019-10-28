const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log('connected to mongodb'));

const courseSchema = new mongoose.Schema({
    name: String,
    author: String,
    tags: [String],
    date: Date,
    isPublished: Boolean,
    price: Number
});

const Course = mongoose.model('Course', courseSchema);

async function getCourses() {
  return await Course
      //exercise one
        .find({tags: ['backend']})
        .sort({name: 1})
        //or .sort('name') or .sort('-name')
        .select({ name: 1, author: 1});
    //or .select('name author')

    //exercise two
    // .find({isPublished: true})
    //     .or([
    //         { name: /.*by.*/i},
    //         { price: {$gte: 15}}]
    //     )
}

async function run() {
    const courses = await getCourses();
    console.log(courses);
}
run();


