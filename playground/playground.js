require('../src/db/mongoose')
const Task = require('../src/models/task')

const deleteTaskandCount = async (id) => {
    const task = await Task.findByIdAndDelete(id)
    const count = await Task.count({completed:false})
    return count
    
}

deleteTaskandCount('615485457df53e5f9f6e53c0').then((count) => {
    console.log(count)
}).catch((e) => {
    console/log(e)
})