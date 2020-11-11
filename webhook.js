const http = require('http')
const createHandler = require('github-webhook-handler')
const handler = createHandler({
    path: '/deploy',
    secret: 'myhash'
})

function run_cmd(cmd, args, callback) {
    const { spawn } = require('child_process')
    let child = spawn(cmd,args)
    child.stdout.on('data', data =>{
        // console.log('stdout:',data, '>>>>>')
        callback(data)
    })
    child.stderr.on('data',data =>{
        console.log('stderr:',data);
    })
   
}

http.createServer((req, res) => {
    handler(req, res, err => {
        res.statusCode = 404
        res.end('no such location')
    })
}).listen(1818, () => {
    console.log('webhook running...');
})

handler.on('error', error => {
    console.log("received error...");
})

handler.on('*', event => {
    console.log('interceptor event *');
    let str = ``
    run_cmd('sh', ['./test.sh'], buffer =>{
        str += buffer.toString()
        console.log(str)
    })
})

