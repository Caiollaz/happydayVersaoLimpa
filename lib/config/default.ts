import type { SiteConfig } from "./schema";
import { CONFIG_VERSION } from "./schema";

/**
 * The Léo & Ana site, expressed as a SiteConfig.
 *
 * Three jobs at once: it's the /demo content, it's the starting point every
 * new draft is cloned from, and it's the fixture that proves the refactor
 * didn't change anything — a site rendered from this must be identical to
 * the hardcoded version it replaced.
 */
export const DEFAULT_CONFIG: SiteConfig = {
  version: CONFIG_VERSION,

  couple: {
    authorName: "Léo",
    recipientName: "Ana",
  },

  dates: {
    met: "2025-02-14",
    relationshipStart: "2025-04-05",
    gift: "2026-04-05",
  },

  anchor: {
    headline: "{author} preparou um *presente* especial",
    subhead: "1 ano. Muitos capítulos. Uma retrospectiva feita pra você.",
    ctaLabel: "Ver presente",
  },

  player: {
    audioSrc: "/audio/nossa-cancao.mp3",
    trackTitle: "Nossa canção",
    trackArtist: "Instrumental",
    covers: [
      "/photos/player-covers/FOTO1.jpeg",
      "/photos/player-covers/FOTO2.jpeg",
      "/photos/player-covers/FOTO3.jpeg",
      "/photos/player-covers/FOTO4.jpeg",
      "/photos/player-covers/FOTO5.jpeg",
      "/photos/player-covers/FOTO6.jpeg",
      "/photos/player-covers/FOTO7.jpeg",
      "/photos/player-covers/FOTO8.jpeg",
      "/photos/player-covers/FOTO9.jpeg",
    ],
  },

  about: {
    heading: "Sobre o casal",
    photo: "/photos/about-us.jpeg",
    subtitle: "Juntos desde 2025",
  },

  letter: {
    eyebrow: "Uma carta",
    title: "Pra você",
    body: `{recipient},

Um ano atrás eu não fazia ideia de que dava pra sentir tanta falta de alguém que eu tinha acabado de conhecer. Hoje eu não consigo mais lembrar direito de como era o meu dia antes de você aparecer nele.

Cada café que virou almoço, cada filme ruim que a gente jurou que ia ser bom, cada playlist que a gente ouviu até enjoar, cada viagem, cada foto tirada no susto — tudo isso virou matéria-prima de uma história que eu quero continuar escrevendo com você por muitos e muitos anos.

Esse presente é pequeno perto de tudo que você me dá todos os dias só por existir do meu lado. Mas ele é feito com tudo que eu tenho — com o mesmo cuidado com que eu te amo.

Obrigado por ser minha parceira, meu lugar preferido no mundo.

Feliz 1 ano. Daqui 10 anos a gente volta nesse site e vê que já valia a pena desde aqui.`,
    signatureLabel: "Com todo meu amor,",
    signature: "{author} 💚",
    ctaLabel: "Mostrar mensagem",
  },

  galleries: [
    {
      id: "dates",
      title: "Nossos dates",
      thumbnail: "/photos/dates/thumb.jpeg",
      photos: [
        "/photos/dates/photo-1.jpeg",
        "/photos/dates/photo-2.jpeg",
        "/photos/dates/photo-3.jpeg",
        "/photos/dates/photo-4.jpeg",
        "/photos/dates/photo-5.jpeg",
        "/photos/dates/photo-6.jpeg",
        "/photos/dates/photo-7.jpeg",
        "/photos/dates/photo-8.jpeg",
        "/photos/dates/photo-9.jpeg",
        "/photos/dates/photo-10.jpeg",
      ],
    },
    {
      id: "random",
      title: "Fotos aleatórias",
      thumbnail: "/photos/random/thumb.jpeg",
      photos: [
        "/photos/random/photo-1.jpeg",
        "/photos/random/photo-2.jpeg",
        "/photos/random/photo-3.jpeg",
        "/photos/random/photo-4.jpeg",
        "/photos/random/photo-5.jpeg",
        "/photos/random/photo-6.jpeg",
        "/photos/random/photo-7.jpeg",
        "/photos/random/photo-8.jpeg",
        "/photos/random/photo-9.jpeg",
      ],
    },
    {
      id: "first-trip",
      title: "Primeira viagem",
      thumbnail: "/photos/first-trip/thumb.jpeg",
      photos: [
        "/photos/first-trip/photo-1.jpeg",
        "/photos/first-trip/photo-2.jpeg",
        "/photos/first-trip/photo-3.jpeg",
        "/photos/first-trip/photo-4.jpeg",
        "/photos/first-trip/photo-5.jpeg",
      ],
    },
  ],

  retroCard: {
    eyebrow: "Retrospectiva",
    titleTop: "Nossa",
    titleBottom: "retrospectiva",
    description:
      "Explore o nosso tempo de casal em uma experiência feita pra você.",
    ctaLabel: "Vamos lá",
  },

  retro: {
    enabled: true,
    audioSrc: "/audio/retrospectiva.mp3",

    slides: {
      intro: {
        enabled: true,
        eyebrow: "Retrospectiva",
        subhead: "os momentos que viraram história",
      },
      whereStarted: {
        enabled: true,
        eyebrow: "Onde começou",
        context: "o dia em que a conversa não teve hora pra acabar",
      },
      movie: {
        enabled: true,
        eyebrow: "ESTREIA MUNDIAL",
        title: "O PORÃO",
        date: "01·03·25",
        tagline1: "o filme era ruim.",
        tagline2: "a companhia não.",
        rating: 2,
      },
      days: {
        enabled: true,
        eyebrow: "Dias juntos",
        caption: "dias de nós dois",
      },
      messages: {
        enabled: true,
        eyebrow: "Mensagens trocadas",
        total: 47_312,
        caption: "e nenhuma delas deu conta de explicar o que eu sinto.",
      },
      trips: {
        enabled: true,
        eyebrow: "Viagens",
        label: "LITORAL SUDESTE",
        destinations: [
          { name: "Ilhabela, SP", color: "#FF7A5A" },
          { name: "Paraty, RJ", color: "#FFE07A" },
        ],
      },
      song: {
        enabled: true,
        eyebrow: "Nossa música",
        title: "Nossa canção",
        artist: "Instrumental",
        coverSrc: "/covers/nossa-cancao.jpg",
        verse: "a que toca e a gente se olha antes do refrão",
      },
      photos: {
        enabled: true,
        eyebrow: "Fotos guardadas",
        caption: "momentos que a gente guardou pra sempre",
        countLabel: "412+",
        collage: [
          "/photos/dates/photo-1.jpeg",
          "/photos/random/photo-5.jpeg",
          "/photos/first-trip/photo-1.jpeg",
          "/photos/dates/photo-4.jpeg",
          "/photos/random/photo-2.jpeg",
          "/photos/first-trip/photo-2.jpeg",
          "/photos/dates/photo-6.jpeg",
          "/photos/random/photo-9.jpeg",
          "/photos/dates/photo-3.jpeg",
          "/photos/random/photo-7.jpeg",
          "/photos/first-trip/photo-4.jpeg",
          "/photos/dates/photo-9.jpeg",
        ],
      },
      favPhoto: {
        enabled: true,
        eyebrow: "Nossa foto favorita",
        src: "/photos/fav-photo.jpeg",
        caption: "café da manhã às três da tarde",
      },
      poster: {
        enabled: true,
        eyebrow: "Nosso ano",
        statLabels: {
          days: "Dias juntos",
          messages: "Mensagens",
          trips: "Viagens",
          song: "Música do ano",
        },
      },
      whatsNext: {
        enabled: true,
        eyebrow: "um pequeno resumo",
        phrase: "e o melhor ainda nem começou.",
        backLabel: "voltar pro site",
      },
    },
  },

  meta: {
    title: "Um presente para {recipient}",
    description: "1 ano de nós. Um presente especial.",
  },
};
