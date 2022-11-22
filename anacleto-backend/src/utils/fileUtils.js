const fs = require('fs');
const path = require("path")

class FileUtils {

  /**
   * Lista i file e le sottocartelle a partire dal path indicato
   * @param {String} dirPath 
   * @param {Array} arrayOfFiles 
   * @returns 
   */
  getAllFiles(dirPath, arrayOfFiles) {

    /*
    [
      {
        file : "file_name",
        filePath : "absolute/path",
        isDir : false
      },
      {
        file : "file_name",
        filePath : "absolute/path",
        isDir : true,
        list : [
          {
            file : "file_name",
            filePath : "absolute/path",
            isDir : false
          },
        ]
      }
    ]
    */

    if(!fs.existsSync(dirPath)){
      return;
    }
    
    const files = fs.readdirSync(dirPath)
    const _this = this;
    arrayOfFiles = arrayOfFiles || [];

    let fileTmp;
    files.forEach(function (file) {

      if (file.indexOf(".") === 0) {
        return;
      }

      if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
        //creo la sottocartella 
        fileTmp = {
          file: file,
          filePath: path.join(dirPath, file),
          isDir: true,
          list: [],
        };
        arrayOfFiles.push(fileTmp);

        fileTmp.list = _this.getAllFiles(path.join(dirPath, file))
      } else {
        fileTmp = {
          file: file,
          filePath: path.join(dirPath, file),
          isDir: false
        };

        arrayOfFiles.push(fileTmp);
      }
    });

    return arrayOfFiles;
  }

}

module.exports = new FileUtils();