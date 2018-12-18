const { Ygg } = require("@yggdrash/sdk")

const api = net => {
    return new Ygg(new Ygg.providers.HttpProvider(net ? `http://${net}` : 'http://localhost:8080'))
}
    
module.exports = {
    api
}