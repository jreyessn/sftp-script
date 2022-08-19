/**
 * ===========================================================================
 * @Imports
 * ===========================================================================
 */
const Client = require('ssh2-sftp-client');
const fs     = require('fs');
const { exit } = require('process');
require('events').EventEmitter.prototype._maxListeners = 100;

/**
 * ===========================================================================
 * @Configuration
 * ===========================================================================
 */
const sftp = new Client()
const args = process.argv.filter(arg => arg.indexOf("sv") !== -1).map(arg => arg.split("="))?.[0]?.[1] ?? null

if(!args){
    console.log("\x1b[36m", "No se ha seleccionado el servidor. Debe utilizar el argumento 'sv=name'")
    console.log("\x1b[37m", "Ejemplo: npm run start sv=stg_11")
    console.log("")
    exit(0)
}

const jsonCredentials = JSON.parse(fs.readFileSync('./access.json', "utf8"))
const sftpAccess      = jsonCredentials.find(jc => jc.alias == args)

if(!sftpAccess){
    console.log("\x1b[36m", "Debe colocar un 'sv' que se encuentre como alias dentro del access.json")
    console.log("")
    exit(0)
}


connectSftp()


/**
 * ===========================================================================
 * @METHODS
 * ===========================================================================
 */
function connectSftp(){
    const { credentials, remotePath, localPath } = sftpAccess;

    sftp.connect(credentials)
        .then(() => sftp.list(remotePath))
        .then((dir) => {
            const fileNames  = dir.filter(fileRemote => {
                return fileRemote.type != 'd' && fileRemote.name != '.htaccess'
            }).map(fileRemote => fileRemote.name)

            const sftpDelete = fileNames.map(fileName => sftp.delete(`${remotePath}${fileName}`))
            return Promise.all(sftpDelete)
        })
        .then(() => {
            return new Promise((resolve) => {
                const sftpUpload      = listDir(localPath).map(fileName => sftp.put(`${localPath}${fileName}`, `${remotePath}${fileName}`))
                let promisesCompletes = 0
                console.log("Start...")
                sftpUpload.forEach((sftpUp) => {
                    sftpUp.then(() => {
                        promisesCompletes++
                        console.log(`Complete ${promisesCompletes}/${sftpUpload.length}`)
                        if(promisesCompletes >= sftpUpload.length) resolve(true)
                    })
                })
            })
        })
        .then(() => {
            console.log("End...")
            sftp.end();
        })
}

function listDir(path = ''){
    return fs.readdirSync(path).filter(fileName => fileName.indexOf('assets') === -1)
}
