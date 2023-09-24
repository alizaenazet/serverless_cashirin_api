
function sqlInfoToObj(info) {
    const inputString = info;
    // Mencocokkan pola menggunakan ekspresi reguler
    const matchResult = inputString.match(/\d+/g);
    // Membuat objek dengan nilai yang diambil
    const result = {
      rowsMatched: matchResult[0],
      changed: matchResult[1],
      warnings: matchResult[2]
    };
    return result    
}


module.exports = {sqlInfoToObj};