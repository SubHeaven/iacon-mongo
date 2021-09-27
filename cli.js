const project = require('./index');

setTimeout(async() => {
    // data = {
    //     codigo: 6,
    //     nome: 'Teste 5',
    //     checked: false
    // }
    // await project.insertOne('apagar', data);

    // await project.updateOne('apagar', { codigo: 3 }, { nome: 'Teste 3' });

    await project.deleteOne('apagar', { codigo: 6 });

    let dataset = await project.find('apagar');
    console.table(dataset);
}, 500);