import NoteFormationMidi from './noteFormationMidi';

const NoteForMidi = (stave_note) => {
    let notes = stave_note.split(' ');
    let notesTone = notes.map((note) => {
      let {noteString,noteScale, noteDuration} = NoteFormationMidi(note)
      return(
        {noteString, noteScale, noteDuration}
      )

    })

    return(notesTone);
}

export default NoteForMidi
