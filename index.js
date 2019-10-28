const mongoose = require('mongoose');
const faker = require('faker');

mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log('connected to mongodb'))
    .catch(err => console.error('Could not connect to mongodb: ', err));

// string, number, date, buffer, boolean, objectID, Array
const courseSchema = new mongoose.Schema({
    name: String,
    author: String,
    tags: [String],
    date: { type: Date, default: Date.now },
    isPublished: Boolean
});

// A Class is a blueprint and an Object is an instance of that blueprint
// To compile schema into class we use a mongoose model  -->
//Create class. Course is capitalized because its a class.
const Course = mongoose.model('Course', courseSchema);
//Create object from created class. Lower case because its an object.
async function createCourse() {
    const courseOne = new Course({
        name: faker.hacker.noun(),
        author: faker.name.firstName(),
        tags: [faker.random.word(), faker.random.word()],
        //date is default
        isPublished: faker.random.boolean()
    });
    const result = await courseOne.save();
    console.log(result);
}
// populate fake data for development -->
// for(let i = 0; i < 100; i++){
//     createCourse();
// }
// How to retrieve documents from mongoDb database
// To filter Course.find({author: 'William', isPublished: false})
async function getCourses() {
    // eq (equal)
    // ne (not equal)
    // gt (greater than)
    // lt (less than)
    // lte (less than or equal to)
    // in
    // nin (not in)
    // or
    //and

    const pageNumber = 2;
    const  pageSize = 10;
    // /api/courses?pageNumber=2&pageSize=10

    const courses = await Course
        // .find()
        // .find({price: { $gte: 10, $lte: 20 }}) //more than 10
        // .find({price: { $in:[10,15,20] }})
        // .find()
        // .or([{ author: 'William'}, { isPublished: true}]) //
        // .and([ ]) //same thing as or

        //using regular expression for filtering strings
        // find docs that start with Will
        // .find({ author: /^A/ }) //^startwith

        // find ends with Phrase
        // .find({ author: /Phrase$/i }) //^startwith
        .find()
        //author that contains the eem
        // .find({ author:/.*eem.*/i}) //.*.* contains, i turns off case sensitivity
        // .limit(10)
        .skip( (pageNumber - 1 ) * pageSize )
        // .sort({ name: 1 }) //1 is defending order -1 is opposite
        // .select({ name: 1, tags: 1})
        .count();
    console.log("All Courses:", courses)
}
// getCourses();

async function updateCourseRetrieveFirst(id){
    // first approach: query first
    // findById()
    // Modify its properties
    // save()

    const course = await Course.findById(id);
    if (!course) return;
    course.isPublished = true;
    course.author = faker.name.firstName();
            //OR
    course.set({
        isPublished: true,
        author: faker.name.firstName()
    });

    const result = await course.save();
    console.log(result)
} //END async updateCourse(id)\

async function updateCourseUpdateFirst(id){
    // second approach: Update first
    // Update directly
    // optionally: get the updated document
    //www.docs.mongodb.com/manual/reference/operator/update/
    // findByIdAndUpdate will update and return the course object instead of meta data
    // the second argument should be the object to update with
    const  course = await Course.update(
        {_id: id}, //specify what to update like find()
        {$set: {
            author: faker.name.firstName(),
            isPublished: false }
        });
    console.log(course)
}
updateCourseUpdateFirst('5db6f3f0f9e11eeaa0bb91ed');

// updateCourseRetrieveFirst('5db6f316cb98ceea4d76d561');

// Errors in console -->
// { useUnifiedTopology: true }
// { useNewUrlParser: true }

// to import json data into a mongo db from the terminal
// mongoimport --db mongo-exercises --collection courses --file exercise-data.json
