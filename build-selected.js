const path = require('path');
const fs = require('fs-extra');

function find(str, start, end) {
    const a = str.indexOf(start);
    const b = str.indexOf(end, a + start.length);
    return str.substring(a + start.length, b);
}

function includes(str, arr) {
    str = str.replace(/松江青[浦年]/g, '').replace(/[浙镇吴隆黄]江青/g, '');
    for (const i of arr) {
        if (str.indexOf(i) >= 0) {
            console.log('#', i)
            return true;
        }
    }
    return false;
}

const keys = [
    '江青',
    '王洪文',
    '张春桥',
    '姚文元',
    '翻案',
    // '揭发',
    '四人帮',
    '王张江姚',
    '天安门事件',
];
for (let i = 1; i <= 1231692; ++i) {
    if (i%1000 == 0) console.log(i);
    const json = JSON.parse(fs.readFileSync(
        path.join('json', Math.floor(i/1000).toString(), i.toString() + '.json')
    ).toString());

    if (!(
        includes(json.ytitle, keys) || 
        includes(json.mtitle, keys) || 
        includes(json.ftitle, keys) || includes(authors, [
            '江青',
            '王洪文',
            '张春桥',
            '姚文元',
        ])
    )) continue;
    const dir = path.join(__dirname, 'selected', Math.floor(i / 1000).toString());
    fs.ensureDirSync(dir);
    fs.writeFileSync(path.join(dir, i + '.json'), JSON.stringify(json))
}
console.log('done');