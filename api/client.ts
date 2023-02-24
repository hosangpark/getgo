import axios from 'axios'



const client = axios.create({
})

client.defaults.baseURL = 'http://ec2-13-125-251-68.ap-northeast-2.compute.amazonaws.com:4000/api'
client.defaults.headers.common['Authorization'] = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHgiOjEsImlhdCI6MTY3MzQ4MzQ2NX0.ZbFX8K1lEEX2Ce-2dPQl7hyq6Y4DBlzL_4fdIu9TzH8`

client.defaults.timeout = 1500

export default client


