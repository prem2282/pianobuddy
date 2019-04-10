import _ from 'lodash'; 
 
const base_s = ['s'];
const base_r = ['r1','r2','r3'];
const base_g = ['g1','g2','g3'];
const base_m = ['m1','m2'];
const base_p = ['p'];
const base_d = ['d1','d2','d3'];
const base_n = ['n1','n2','n3'];
const base_C = ['S'];

const carnaticNotation = ['s','r1','r2','r3','g1','g2','g3','m1','m2','p','d1','d2','d3','n1','n2','n3','S'];

const westernNoation = ['C4','C4#','D4','D4#','D4','D4#','E4','F4','F4#','G4','G4#','A4','A4#','A4','A4#','B4','C5'];

const MelakarthaChakras = ['Indu', 'Netra', 'Agni', 'Veda', 'Bana', 'Rutu','Rishi','Vasu','Brahma','Disi','Rudra','Aditya'];

const MelakarthaRagaNames = [
  ['Kanakangi',	'Ratnangi',	'Ganamurti',	'Vanaspati',	'Manavati',	'Tanarupi',],
  ['Senavati',	'Hanumatodi',	'Dhenuka',	'Natakapriya',	'Kokilapriya',	'Rupavati',],
  ['Gayakapriya',	'Vakulabharanam',	'Mayamalavagowla',	'Chakravakam',	'Suryakantam',	'Hatakambari',],
  ['Jhankaradhwani',	'Natabhairavi',	'Keeravani',	'Kharaharapriya',	'Gourimanohari',	'Varunapriya',],
  ['Mararanjani',	'Charukesi',	'Sarasangi',	'Harikambhoji',	'Dheerasankarabaranam',	'Naganandini',],
  ['Yagapriya',	'Ragavardhini',	'Gangeyabhushani',	'Vagadheeswari',	'Shulini',	'Chalanata',],
  ['Salagam',	'Jalarnavam',	'Jhalavarali',	'Navaneetam',	'Pavani',	'Raghupriya',],
  ['Gavambhodi',	'Bhavapriya',	'Shubhapantuvarali',	'Shadvidamargini',	'Suvarnangi',	'Divyamani',],
  ['Dhavalambari',	'Namanarayani',	'Kamavardani',	'Ramapriya',	'Gamanashrama',	'Vishwambari',],
  ['Shamalangi',	'Shanmukhapriya',	'Simhendramadhyamam',	'Hemavati',	'Dharmavati',	'Neetimati',],
  ['Kantamani',	'Rishabhapriya',	'Latangi',	'Vachaspati',	'Mechakalyani',	'Chitrambari',],
  ['Sucharitra',	'Jyoti swarupini',	'Dhatuvardani',	'Nasikabhushani',	'Kosalam',	'Rasikapriya',]
];


const varisai =
[
  [[1,2,3,4,5,6,7,8],],
  [[1,2,1,2,1,2,3,4],],
  [[1,2,3,1,2,3,1,2],],
  [[1,2,3,4,1,2,3,4],],
  [[1,2,3,4,5,5,1,2],],
  [[1,2,3,4,5,6,1,2],],
  [[1,2,3,4,5,6,7,7],],
  [[1,2,3,4,5,4,6,2],],
  [[1,2,3,4,5,4,6,5],],
];

const noteArray = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
const keys = ['C4','C4#','D4','D4#','E4','F4','F4#','G4','G4#','A4','A4#','B4','C5'];
const major = [1,3,5,6,8,10,12,13];
const naturanMinor = [1,3,4,6,8,9,11,13];
const harmonicMinor = [1,3,4,6,8,9,12,13];
const melodicMinor = [1,3,4,6,8,10,12,13];

export const RagaNames = (category, subCategory) => {
//category 0 - Melakartha
  if (category === 0) {
    let ragaList = MelakarthaRagaNames[subCategory];
    return ragaList;
  }
  // return [MelakarthaRagaNames];
}

export const RagaCategories = () => {
  return ['Melakartha'];
}

export const RagaSubCategories = () => {
  return [MelakarthaChakras]
}

export const noteNum = (noteStr) => {
  return noteArray.indexOf(noteStr) + 1;
}

export const carnaticToWestern = (carnatic) => {

  return carnatic.map(note => {
    return westernNoation[carnaticNotation.indexOf(note)];
  })

}
export const MelakarthaList = () => {

  let ragamList1 = ['S']
  let ragamList2 = base_n.map(n => {
    return(
      [n,...ragamList1]
    )
  })


  // console.log({ragamList2});
  let ragamList3 = base_d.map(d => {
    return(
      ragamList2.map(list => {
        return(
          [d,...list]
        )
      })
    )
  })

  // console.log({ragamList3});

  let ragamList4 = base_p.map(p => {
    return(
      ragamList3.map(list2 => {
        return(
          list2.map(list => {
            return(
              [p,...list]
            )
          })
        )
      })
    )
  })

  // console.log({ragamList4});

  let ragamList5 = base_m.map(m => {
    return(
      ragamList4.map(list4 => {
        return(
          list4.map(list3 => {
            return(
              list3.map(list => {
                return(
                  [m,...list]
                )
              })
            )
          })
        )
      })
    )
  })

  // console.log({ragamList5});

  let ragamList6 = base_g.map(g => {
    return(
      ragamList5.map(list5 => {
        return(
          list5.map(list4 => {
            return(
              list4.map(list3 => {
                return(
                  list3.map(list => {
                    return(
                      [g,...list]
                    )
                  })
                )
              })
            )
          })
        )
      })
    )
  })

  // console.log({ragamList6});

  let ragamList7 = base_r.map(r => {
    return(
      ragamList6.map(list6 => {
        return(
          list6.map(list5 => {
            return(
              list5.map(list4 => {
                return(
                  list4.map(list3 => {
                    return(
                      list3.map(list => {
                        return(
                          ['s',r,...list]
                        )
                      })
                    )
                  })
                )
              })
            )
          })
        )
      })
    )
  })

    // console.log({ragamList7});
    let ragamList = []
    for (var i = 0; i < ragamList7.length; i++) {
      for (var j = 0; j < ragamList7[i].length; j++) {
        for (var k = 0; k < ragamList7[i][j].length; k++) {
          for (var l = 0; l < ragamList7[i][j][k].length; l++) {
            for (var m = 0; m < ragamList7[i][j][k][l].length; m++) {
              for (var n = 0; n < ragamList7[i][j][k][l][m].length; n++) {
                // console.log(ragamList7[i][j][k][l][m][n]);
                let ragam = ragamList7[i][j][k][l][m][n]

                if ((ragam[1] === 'r2' && ragam[2] === 'g1')||
                    (ragam[1] === 'r3' && ragam[2] === 'g1')||
                    (ragam[1] === 'r3' && ragam[2] === 'g2')||
                    (ragam[5] === 'd2' && ragam[6] === 'n1')||
                    (ragam[5] === 'd3' && ragam[6] === 'n1')||
                    (ragam[5] === 'd3' && ragam[6] === 'n2')
                ) {

                } else {
                    ragamList.push(ragamList7[i][j][k][l][m][n])
                }


              }
            }
          }
        }
      }
    }


    console.log(ragamList.length);
    console.log({ragamList});
    let melakarthaList = [..._.sortBy(ragamList ,[o => o[3]])]
    console.log({melakarthaList});

    return melakarthaList;

}

export const createSarali = (scalekeys) => {

  let sarali = varisai.map(line => {
    let line1 = line[0].map(index => scalekeys[index-1])
    let line2 = [...scalekeys]
    let reverseIndex = line[0].map(index => (9-index))
    let line3 = reverseIndex.map(index => scalekeys[index-1])
    let line4 = _.reverse([...line2]);
    return [line1,line2,line3,line4]
  })
  // console.log({sarali});
  return sarali


}

export const formScale = (base,mode) => {
  let baseIndex = keys.indexOf(base);

  let modekeys = [];
  switch (mode) {
    case 'major':
      modekeys = [...major];
      break;
    case 'minor':
      modekeys = [...naturanMinor];
      break;
    case 'hminor':
      modekeys = [...harmonicMinor];
      break;
    case 'mminor':
      modekeys = [...melodicMinor];
      break;

    default:

  }

  let modeIndex = modekeys.map(key => key - 1);

  let scalekeys = modeIndex.map(index => {
    return(
      keys[(index+baseIndex)%12]
    )
  })

  // console.log({scalekeys});
  // createSarali(scalekeys);
  // createRagamList();
  // createRagamListRev();

}
