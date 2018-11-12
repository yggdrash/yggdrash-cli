const exec = require('child_process').exec
const getHomePath = require('home-path')

const test = () => {
        exec("cd ~;mkdir .yggdrash;cd .yggdrash;ls", (error, stdout, stderr) => {    
            return stdout    
        });
 }

 module.exports = {
    test
}