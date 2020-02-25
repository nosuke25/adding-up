'use strict';
const fs = require('fs');
const readline = require ('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rf = readline.createInterface({'input' : rs , 'output': {} });
const prefectureDataMap = new Map();//key:都道府県　value:集計データ
rf.on('line', (lineString) => {
  const columns = lineString.split(',');
  const year =parseInt(columns[0]);
  const prefecture = columns[1];
  const popu = parseInt(columns[3]);
  if(year===2010||year===2015){
    let value = prefectureDataMap.get(prefecture);
    if(!value)
    value= {
      popu2010: 0,
      popu2015: 0,
      change: null
    };
  if(year===2010){
  value.popu2010= popu;
  }
  if(year===2015){
  value.popu2015=popu ;
  }
  prefectureDataMap.set(prefecture, value);
  }
});
rf.on('close',()=>{
  for(let [key, value] of prefectureDataMap){
    value.change= value.popu2015/value.popu2010;
  }
  const rankingarray=Array.from(prefectureDataMap).sort((pair1, pair2) => {
    return pair2[1].change-pair1[1].change;
  });
  const rankingStrings = rankingarray.map(([key, value]) => { 
    return key + ': ' + value.popu2010 + '=>' + value.popu2015 + ' 変化率:' + value.change;
  });
  console.log(rankingStrings);
});