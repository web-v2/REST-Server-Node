const path = require('path');
const {v4: uuidv4 } = require('uuid');
const eValidas = ['png', 'jpg', 'jpeg', 'gif'];
const subirArchivo = (files, extencionesValidas=eValidas, carpeta='') => {

    return new Promise((resolve, reject) => {
        const { archivo } = files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[ nombreCortado.length-1 ];
        
        if(!extencionesValidas.includes(extension)){
           return reject(`La extención ${extension} No es permitida`);
        }
        
        const nombreTemp = uuidv4()+'.'+extension;
        const uploadPath = path.join( __dirname, '../uploads/', carpeta, nombreTemp);
        archivo.mv(uploadPath, (err) => {
            if (err) {
                return reject(err);
            }
            resolve(nombreTemp);
        });
    });

    

}

module.exports = {
    subirArchivo
}