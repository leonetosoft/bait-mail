import csvtojson from 'csvtojson';
import fs from 'fs';
import path from 'path';

export async function csvToArray<T>(csvText: string): Promise<T[]> {
  return new Promise((resolve, reject) => {
    csvtojson({
      noheader: false,
      delimiter: ';'
    })
      .fromString(csvText)
      .then((csvRow) => {
        resolve(csvRow)
      });
  });
};

export function saveClickTxt(email: string) {
  let filePath = path.join(__dirname, 'data', `${email}.txt`);
  fs.writeFileSync(filePath, new Date().toLocaleString("pt-BR"));
}

export function saveClickCsv(email: string) {
  let filePath = path.join(__dirname, 'data', `clicks.csv`);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, 'email;data;\n')
  }
  fs.appendFileSync(filePath, `${email};${new Date().toLocaleString("pt-BR")};\n`);
}