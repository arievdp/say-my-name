import Course from '../models/Course'

const CourseResolver = {
    Query: {
        course: async (root, args, context) => {
            return await Course.findById(args.id)
        },
        courses: async (root, args, context) => {
            return await Course.find({})
        }
    },
    Mutation: {
        createCourse: async (_, { input }, context) => {
            const { name, description } = input
            const course = new Course({
                name,
                description
            })
            const { id } = await course.save()
            return {
                id: id,
                name,
                description,
                user: []
            }
        },
        updateCourse: async (_, args, context) => {
            const { name, description } = args.input
            await Course.findByIdAndUpdate(args.id, {
                name,
                description,
            }, function (err, result) {
                if (err) {
                    console.log(err)
                }
            })
            return {
                id: args.id,
                name,
                description,
                user: []
            }
        }
    }
}


export { CourseResolver }