

let noteCount = 0;

const noteForMidiPlayer = (noteStr) => {
            //noteStr is in the format <note><number><acc><acc>
            //example 1: c (default assumed as 4)
            //example 2: c# or cb (default assumed as 4 with acc)
            //example 3: c4 (here no accidental)
            //example 4: d4b (here one accidental)
            //example 5: e5bb (here two accidental values)
            // console.log({noteStr});
            let noteSplit = noteStr.split('-')

            // console.log({noteSplit});
            let noteArray = noteSplit[0].split('')
            let note = null;
            let duration = '4n';
            let durationVex = 'q';
            let acc = null;
            if (noteSplit.length === 2) {
              durationVex = noteSplit[1]
            }

            if (noteSplit.length === 2) {
              duration = noteSplit[1]

              switch (noteSplit[1]) {
                case "w":
                  duration = '1n'
                  break;
                case "h":
                  duration = '2n'
                  break;
                case "q":
                  duration = '4n'
                  break;
                case "qr":
                  duration = '4n'
                  break;
                case "8":
                duration = '8n'
                  break;
                default:

              }
            } else {
              duration = '4n'
            }

            // console.log("noteArray", noteArray);
            // console.log("length", noteArray.length);
            if (noteArray.length===1) { //default assumed to be 4
              // note = [`${noteArray[0]}/${4}`]
              note = {
                noteString : noteArray[0],
                noteScale : 4,
                noteDuration: duration,
                durationVex: durationVex,
                acc: '',
                noteLetter:noteArray[0],
              }

            } else if (noteArray.length===2) { //it can either have acc or scale
              if (!isNaN(noteArray[1])) { //if the second byte is numeric then it is the scale
                // note = [`${noteArray[0]}/${noteArray[1]}`]
                note = {
                  noteString : noteArray[0],
                  noteScale : noteArray[1],
                  noteDuration: duration,
                  durationVex: durationVex,
                  acc: '',
                  noteLetter:noteArray[0],
                }
              } else {
                acc = noteArray[1] //if the second byte is not numeric then it is the acc. default scale to 4

                // note = [`${noteArray[0]}${acc}/${4}`]
                note = {
                  noteString : noteArray[0] + acc,
                  noteScale : 4,
                  noteDuration: duration,
                  durationVex: durationVex,
                  acc: acc,
                  noteLetter:noteArray[0],
                }
              }

            } else if (noteArray.length===3) { //see examble 4
              acc = noteArray[2]
              // note = [`${noteArray[0]}${acc}/${noteArray[1]}`]
              note = {
                noteString : noteArray[0] + acc,
                noteScale : noteArray[1],
                noteDuration: duration,
                durationVex: durationVex,
                acc: acc,
                noteLetter:noteArray[0],
              }

            } else if (noteArray.length===4) { // see examble 5
              acc = noteArray[2] + noteArray[3]
              // note = [`${noteArray[0]}${acc}/${noteArray[1]}`]
              note = {
                noteString : noteArray[0] + acc,
                noteScale : noteArray[1],
                noteDuration: duration,
                durationVex: durationVex,
                acc: acc,
                noteLetter:noteArray[0],
              }
            }

            return note;
}

export default noteForMidiPlayer;
