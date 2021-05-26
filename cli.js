const project = require('./index');

setTimeout(async() => {
    let config = await project.findOne('configuracao', {});
    console.log(config);
    let queue = await project.findOne('empresas', {});
    console.log(queue);
    process.exit(0);
}, 500);