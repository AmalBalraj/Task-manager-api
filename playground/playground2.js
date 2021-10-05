require("../src/db/mongoose")
const User = require('../src/models/user')

const updateAgeAndCount = async (id) => {
    const user = await User.findByIdAndUpdate(id,{age:1})
    const count = await User.count({age: 1})
    return count
}

updateAgeAndCount('615434aa2ed71f83297ded35').then((count) => {
    console.log(count)
}).catch((e) => {
    console.log(e)
})