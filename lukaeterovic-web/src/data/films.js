// src/data/films.js

export const films = [
  {
    // used for routing: /film/hunch
    slug: 'hunch',

    // existing FilmCard fields (DO NOT BREAK FilmCard)
    title: 'HUNCH',
    year: '2025',
    duration: '00:30:00',
    type: 'Narrative',
    genres: 'Thriller, Fantasy',
    tagline: 'If You Can See The Future, Can You Then Change It?',
    description:
      'Born With The Ability To See The Fragments Of The Future, Šime Must Piece Them Together To Prevent A Tragedy—Before It’s Too Late.',
    poster: '/assets/images/film/Hunch/Poster.jpg',

    // ===== Film detail fields (top-level) =====
    originalTitle: 'Špurijus',
    language: 'Croatian, English',
    runtime: '00:30:00',
    releaseYear: '2025',
    genreFull: 'Thriller, Mystery, Fantasy',
    format: 'Student short, narrative',

    plotSummary: `
"If you can see the future, can you then change it?"

Born with the ability to see fragments of the future, Šime must piece them
together in order to prevent a tragedy—before it’s too late.
    `,

    aboutProject: `
HUNCH is a student narrative short film exploring fate, determinism,
and the psychological weight of foresight.
    `,

    credits: [
      { role: 'Director', name: 'Luka Eterović' },
      { role: 'Writer', name: 'Luka Eterović' },
      { role: 'Cinematography', name: 'Name' },
      { role: 'Editing', name: 'Name' }
    ],

    gallery: [
      '/assets/images/film/Hunch/still-1.jpg',
      '/assets/images/film/Hunch/still-2.jpg',
      '/assets/images/film/Hunch/still-3.jpg',
      '/assets/images/film/Hunch/still-4.jpg'
    ],

    watchUrl: 'https://vimeo.com/your-link',

    // ===== Compatibility block for your current FilmDetailPage template =====
    // (Your template currently reads film.tech.* — this prevents breakage.)
    tech: {
      runtime: '00:30:00',
      year: '2025',
      originalTitle: 'Špurijus',
      genre: 'Thriller, Mystery, Fantasy',
      type: 'Narrative',
      language: 'Croatian, English'
    }
  },

  {
    // SECOND FILM EXAMPLE
    slug: 'second-film',

    title: 'SECOND FILM',
    year: '2024',
    duration: '00:12:00',
    type: 'Experimental',
    genres: 'Drama',
    tagline: 'A short exploration of silence.',
    description:
      'An experimental short film exploring atmosphere, stillness, and memory.',
    poster: '/assets/images/film/TheStillness/Poster.jpeg',

    originalTitle: 'Second Film',
    language: 'English',
    runtime: '00:12:00',
    releaseYear: '2024',
    genreFull: 'Drama, Experimental',
    format: 'Short film',

    plotSummary: `
An abstract exploration of space and time through fragmented imagery.
    `,

    aboutProject: `
This project was created as an exploration of visual rhythm and mood.
    `,

    credits: [
      { role: 'Director', name: 'Luka Eterović' },
      { role: 'Sound Design', name: 'Name' }
    ],

    gallery: [
      '/assets/images/film/SecondFilm/still-1.jpg',
      '/assets/images/film/SecondFilm/still-2.jpg'
    ],

    watchUrl: '',

    tech: {
      runtime: '00:12:00',
      year: '2024',
      originalTitle: 'Second Film',
      genre: 'Drama, Experimental',
      type: 'Experimental',
      language: 'English'
    }
  }
]