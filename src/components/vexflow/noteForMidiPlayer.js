import NoteFormationMidi from './noteFormationMidi';

const NoteForMidi = (stave_note) => {
    let notes = stave_note.split(' ');
    let notesTone = notes.map((note) => {

      if (note[0]==='$') {
        let noteSplit = note.split('$')
        console.log(noteSplit);
        let noteArray = noteSplit[1].split('&');
        let noteObject = noteArray.map(note => NoteFormationMidi(note))
        return noteObject
      } else {


      }

      let noteObject = NoteFormationMidi(note)
      return(
        noteObject
      )

    })

    return(notesTone);
}

export default NoteForMidi
