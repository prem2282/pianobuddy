const tfmNotation = ['s','r1','r2','r3','g1','g2','g3','m1','m2','p','d1','d2','d3','n1','n2','n3',
                     'S','R1','R2','R3','G1','G2','G3','M1','M2','P','D1','D2','D3','N1','N2','N3',
                     's.','r1.','r2.','r3.','g1.','g2.','g3.','m1.','m2.','p.','d1.','d2.','d3.','n1.','n2.','n3.'
                    ];
const westernNoation = ['C4','C4#','D4','D4#','D4','D4#','E4','F4','F4#','G4','G4#','A4','A4#','A4','A4#','B4',
                        'C5','C5#','D5','D5#','D5','D5#','E5','F5','F5#','G5','G5#','A5','A5#','A5','A5#','B5',
                        'C3','C3#','D3','D3#','D3','D3#','E3','F3','F3#','G3','G3#','A3','A3#','A3','A3#','B3',
                        ];
const westernNumber = [1,2,3,4,3,4,5,6,7,8,9,10,11,10,11,12]

let classicBase = [];
let westernBase = [];

const tfmLineSplitter =  (noteLine) => {
  let notes = noteLine.split(' ');
  console.log({notes});

  let newNoteLine = notes.map(note => {
    return westernBase[classicBase.indexOf(note)];
  }).join(" ")

  console.log({newNoteLine});

}

const tfmToNoteObject = (tfmObject) => {
  let {baseNotes, Notes} = tfmObject;
  let tfmBase = baseNotes.split(' ');
  westernBase = tfmBase.map(tfmNote => {

    // if ((tfmNote.substring(tfmNote.length-1) === ".")) {
    //   tfmNote = tfmNote.substring(0, tfmNote.length-1)
    // }
    let tfmIndex = tfmNotation.indexOf(tfmNote);
    let westernNote = westernNoation[tfmIndex];
    return westernNote;
  })
  console.log({westernBase});

  classicBase = tfmBase.map(tfmNote => {
    let noteArray = tfmNote.split('');
    let newNoteArray = [];
    for (var i = 0; i < noteArray.length; i++) {
      if (isNaN(Number(noteArray[i]))) {
        newNoteArray.push(noteArray[i])
      }
    }
    let baseNote = newNoteArray.join('')
    return baseNote
  })

  console.log({classicBase});

  let noteForm = Notes.map(noteLine => tfmLineSplitter(noteLine))

}

export default tfmToNoteObject;
