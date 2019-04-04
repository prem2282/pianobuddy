import SongDetails from '../..//components/data/songDetails';


export const getComposerList = () => {

  let list = new Set(SongDetails.map( (song) => {
    return song.composer
  }))

  return list

}

export const getDirectorList = () => {

  let list = new Set(SongDetails.map( (song) => {
    return song.director
  }))

  return list

}

export const getActorList = () => {

  let list = new Set(SongDetails.map( (song) => {
    return song.actor
  }))

  return list

}

export const getGenreList = () => {

  let list = new Set(SongDetails.map( (song) => {
    return song.genre
  }))

  return list

}

export const getPeriodList = () => {

  let list = new Set(SongDetails.map( (song) => {
    return song.period
  }))

  return list

}



export const getComposerSongList = (input) => {

  let list = SongDetails.filter(song => song.composer === input)

  return list

}

export const getDirectorSongList = (input) => {

  let list = SongDetails.filter(song => song.director === input)

  return list

}

export const getActorSongList = (input) => {

  let list = SongDetails.filter(song => song.actor === input)

  return list

}

export const getGenreSongList = (input) => {

  let list = SongDetails.filter(song => song.genre === input)

  return list

}

export const getPeriodSongList = (input) => {

  let list = SongDetails.filter(song => song.period === input)

  return list

}
