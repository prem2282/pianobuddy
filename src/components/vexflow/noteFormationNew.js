


let noteCount = 0;

const noteFormation = (noteObject) => {

            let {noteString, noteLetter, noteDuration, durationVex, noteScale, acc} = noteObject;

            let note = [`${noteString}/${noteScale}`];
            let duration = durationVex;

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

            let noteReturn = {
              clef: "treble",
              keys: note,
              duration: duration,
              acc: acc,
              noteCount: noteCount,
            }

            return noteReturn;
}

export default noteFormation;
