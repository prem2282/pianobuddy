
let noteCount = 0;

const noteFormation = (noteStr) => {
            //noteStr is in the format <note><number><acc><acc>
            //example 1: c (default assumed as 4)
            //example 2: c# or cb (default assumed as 4 with acc)
            //example 3: c4 (here no accidental)
            //example 4: d4b (here one accidental)
            //example 5: e5bb (here two accidental values)

            let noteSplit = noteStr.split('-')

            // console.log(noteSplit);
            let noteArray = noteSplit[0].split('')
            let note = [];
            let duration = 'q';
            let acc = null;
            // console.log("noteArray", noteArray);
            // console.log("length", noteArray.length);
            if (noteArray.length===1) { //default assumed to be 4
              note = [`${noteArray[0]}/${4}`]
            } else if (noteArray.length===2) { //it can either have acc or scale
              if (!isNaN(noteArray[1])) { //if the second byte is numeric then it is the scale
                note = [`${noteArray[0]}/${noteArray[1]}`]
              } else {
                acc = noteArray[1] //if the second byte is not numeric then it is the acc. default scale to 4
                note = [`${noteArray[0]}${acc}/${4}`]
              }

            } else if (noteArray.length===3) { //see examble 4
              acc = noteArray[2]
              note = [`${noteArray[0]}${acc}/${noteArray[1]}`]
            } else if (noteArray.length===4) { // see examble 5
              acc = noteArray[2] + noteArray[3]
              note = [`${noteArray[0]}${acc}/${noteArray[1]}`]
            }


            // console.log("note:", note);
            if (noteSplit.length === 2) {
              duration = noteSplit[1]
              // console.log("duration:" ,duration );
            } else {
              duration = "q"
            }

            switch (duration) {
              case "w":
                noteCount = 4
                break;
              case "h":
                noteCount = 2
                break;
              case "q":
                noteCount = 1
                break;
              case "qr":
                noteCount = 1
                break;
                case "8":
                noteCount = .5
                break;
              default:

            }

            let noteObject = {
              clef: "treble",
              keys: note,
              duration: duration,
              acc: acc,
              noteCount: noteCount,
            }
            // tickContext.preFormat().setX(50*this.state.nthNote);

            return noteObject;
}

export default noteFormation;
