
let noteCount = 0;

const noteMassage = (noteStr) => {
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
            let duration = 'q';
            let acc = null;
            let noteString = noteStr;

            if (noteSplit.length === 2) {
              duration = noteSplit[1]

            }

            // console.log("noteArray", noteArray);
            // console.log("length", noteArray.length);
            if (noteArray.length===1) { //default assumed to be 4
              // note = [`${noteArray[0]}/${4}`]
              noteString = noteArray[0] + '4' + '-' + duration;

            } else if (noteArray.length===2) { //it can either have acc or scale
                if (!isNaN(noteArray[1])) { //if the second byte is numeric then it is the scale
                  noteString = noteStr + '-' + duration;
                } else {
                  acc = noteArray[1] //if the second byte is not numeric then it is the acc. default scale to 4
                  noteString = noteArray[0] + '4' + acc + '-' + duration;
                }

            } else if (noteArray.length===3) { //it can either have acc or scale
                if (!isNaN(noteArray[1])) { //if the second byte is numeric then it is the scale
                  noteString = noteStr + '-' + duration;
                } else {
                  acc = noteArray[1] +  noteArray[2]//if the second byte is not numeric then it is the acc. default scale to 4
                  noteString = noteArray[0] + '4' + acc + '-' + duration;
                }

            }
            return noteString;
}

export default noteMassage;
