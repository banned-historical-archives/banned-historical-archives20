require('dotenv').config();
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
    const content = fs.readFileSync(
        path.join(process.env.WHB_HTML_PATH, Math.floor(i/1000).toString(), i.toString() + '.html')
    ).toString();

    const ytitle = find(content, '<P class=ytitle><B>', '</B>');
    const mtitle = find(content, '<P class=mtitle><B>', '</B>');
    const ftitle = find(content, '<P class=ftitle><B>', '</B>');
    const authors = find(content, '<P class=author>', '</P>');

    if (!(
        includes(ytitle, keys) || 
        includes(mtitle, keys) || 
        includes(ftitle, keys) || includes(authors, [
            '江青',
            '王洪文',
            '张春桥',
            '姚文元',
        ])
    )) continue;
    const text = find(content, '<P class=text>', '</P>');
    const date_str = find(content, '<FONT class=brief>日期:</FONT></TD>\r\n<TD class=td1>', '</TD>');
    const res = {
        id: i,
        date: [{year: parseInt(date_str.split('.')[0]), month: parseInt(date_str.split('.')[1]), day: parseInt(date_str.split('.')[2])}],
        page: find(content, '<TD class=td>版次:</TD>\r\n<TD class=td1>', '</TD>'),
        source: find(content, '<TD class=td vAlign=top>来源:</TD>\r\n<TD class=td1>', '</TD>'),
        region: find(content, '<TD class=td vAlign=top>地区:</TD>\r\n<TD class=td1>', '</TD>'),
        masthead: find(content, '<TD class=td vAlign=top>版名:</TD>\r\n<TD class=td1>', '</TD>'),
        special_issue: find(content, '<TD class=td vAlign=top>专刊:</TD>\r\n<TD class=td1>', '</TD>'),
        column: find(content, '<TD class=td vAlign=top>栏目:</TD>\r\n<TD class=td1>', '</TD>'),
        genre: find(content, '<TD class=td vAlign=top>体裁:</TD>\r\n<TD class=td1>', '</TD>'),
        count: find(content, '<TD class=td>字数:</TD>\r\n<TD class=td1>', '</TD>'),
        ytitle: ytitle,
        mtitle: mtitle,
        ftitle,
        authors: authors.split(';').map(i => i.trim()).filter(i => i),
        text: text.split('<BR>').map(i => ({type: 'paragraph', text: i.trim()})).filter(i => i.text),
    }
    const dir = path.join(__dirname, 'selected', Math.floor(i / 1000).toString());
    fs.ensureDirSync(dir);
    fs.writeFileSync(path.join(dir, i + '.json'), JSON.stringify(res))
}
console.log('done');