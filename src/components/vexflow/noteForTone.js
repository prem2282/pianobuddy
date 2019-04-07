import NoteFormation from './noteFormation';

const NoteForTone = (stave_note) => {
    let notes = stave_note.split(' ');
    let notesTone = notes.map((note) => {
      let {keys, duration} = NoteFormation(note)
      let noteTone = keys[0].split('/').join('')
      switch (duration) {
        case 'q':
          duration = '4n'
          break;
        case 'qr':
        duration = '4n'
        break;
        case 'h':
          duration = '2n'
          break;
        case 'w':
          duration = '1n'
        case '8':
        duration = '8n'
        break;
      }
      // console.log({noteTone} ,{duration})
      return(
        {noteTone, duration}
      )

    })

    return(notesTone);
}

export default NoteForTone