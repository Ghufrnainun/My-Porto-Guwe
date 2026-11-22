export interface ListeningTrack {
  id: string;
  title: string;
  artist: string;
  streamUrl: string;
  ytId: string;
  coverImage: string;
  coverBg: string;
  coverLabel: string;
  coverSub: string;
  duration?: string;
}

export const RECENT_TRACKS: readonly ListeningTrack[] = [
  {
    id: 'loser',
    title: 'LOSER',
    artist: 'Kenshi Yonezu',
    streamUrl: '/audio/loser.m4a',
    ytId: 'Dx_fKPBPYUI',
    coverImage: 'https://i.ytimg.com/vi/Dx_fKPBPYUI/hqdefault.jpg',
    coverBg:
      'radial-gradient(circle at 30% 30%, #ff5f57 0%, #3a1c28 52%, #121015 100%)',
    coverLabel: 'LOSER',
    coverSub: '米津玄師',
    duration: '4:02',
  },
  {
    id: 'supernova',
    title: 'Supernova',
    artist: 'aespa',
    streamUrl: '/audio/supernova.m4a',
    ytId: 'phuiiNCxRMg',
    coverImage: 'https://i.ytimg.com/vi/phuiiNCxRMg/hqdefault.jpg',
    coverBg: 'linear-gradient(145deg, #c084fc 0%, #818cf8 48%, #38bdf8 100%)',
    coverLabel: 'SUPERNOVA',
    coverSub: 'aespa',
    duration: '3:13',
  },
  {
    id: 'odoriko',
    title: 'Odoriko',
    artist: 'Vaundy',
    streamUrl: '/audio/odoriko.m4a',
    ytId: '7HgJIAUtICU',
    coverImage: 'https://i.ytimg.com/vi/7HgJIAUtICU/hqdefault.jpg',
    coverBg:
      'radial-gradient(circle at 70% 25%, #fb923c 0%, #7c2d12 58%, #18181b 100%)',
    coverLabel: '踊り子',
    coverSub: 'Vaundy',
    duration: '4:05',
  },
  {
    id: 'whiplash',
    title: 'Whiplash',
    artist: 'aespa',
    streamUrl: '/audio/whiplash.m4a',
    ytId: 'jWQx2f-CErU',
    coverImage: 'https://i.ytimg.com/vi/jWQx2f-CErU/hqdefault.jpg',
    coverBg:
      'radial-gradient(circle at 50% 45%, #a3e635 0%, #27272a 48%, #09090b 100%)',
    coverLabel: 'WHIPLASH',
    coverSub: 'aespa',
    duration: '3:11',
  },
  {
    id: 'kickback',
    title: 'KICK BACK',
    artist: 'Kenshi Yonezu',
    streamUrl: '/audio/kickback.m4a',
    ytId: 'M2cckDmNLMI',
    coverImage: 'https://i.ytimg.com/vi/M2cckDmNLMI/hqdefault.jpg',
    coverBg: 'linear-gradient(135deg, #facc15 0%, #ef4444 55%, #1f2937 100%)',
    coverLabel: 'KICK BACK',
    coverSub: '米津玄師',
    duration: '3:47',
  },
  {
    id: 'nightcall',
    title: 'Nightcall',
    artist: 'Kavinsky',
    streamUrl: '/audio/nightcall.m4a',
    ytId: 'MV_3Dpw-BRY',
    coverImage: 'https://i.ytimg.com/vi/MV_3Dpw-BRY/hqdefault.jpg',
    coverBg: 'linear-gradient(150deg, #ec4899 0%, #6366f1 52%, #0f172a 100%)',
    coverLabel: 'NIGHTCALL',
    coverSub: '1986',
    duration: '4:17',
  },
  {
    id: 'shinunoga',
    title: 'Shinunoga E-Wa',
    artist: 'Fujii Kaze',
    streamUrl: '/audio/shinunoga.m4a',
    ytId: 'dawrQnvwMTY',
    coverImage: 'https://i.ytimg.com/vi/dawrQnvwMTY/hqdefault.jpg',
    coverBg:
      'radial-gradient(circle at 40% 30%, #ef4444 0%, #7f1d1d 55%, #18181b 100%)',
    coverLabel: '死ぬのがいいわ',
    coverSub: 'Fujii Kaze',
    duration: '5:22',
  },
  {
    id: 'idol',
    title: 'Idol',
    artist: 'YOASOBI',
    streamUrl: '/audio/idol.m4a',
    ytId: 'ZRtdQ81jPUQ',
    coverImage: 'https://i.ytimg.com/vi/ZRtdQ81jPUQ/hqdefault.jpg',
    coverBg:
      'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%)',
    coverLabel: 'アイドル',
    coverSub: 'YOASOBI',
    duration: '3:46',
  },
  {
    id: 'glimpse',
    title: 'Glimpse of Us',
    artist: 'Joji',
    streamUrl: '/audio/glimpse.m4a',
    ytId: 'FvOpPeKSf_4',
    coverImage: 'https://i.ytimg.com/vi/FvOpPeKSf_4/hqdefault.jpg',
    coverBg:
      'radial-gradient(circle at 50% 50%, #52525b 0%, #27272a 50%, #09090b 100%)',
    coverLabel: 'GLIMPSE OF US',
    coverSub: 'Joji',
    duration: '3:54',
  },
  {
    id: 'getlucky',
    title: 'Get Lucky',
    artist: 'Daft Punk',
    streamUrl: '/audio/getlucky.m4a',
    ytId: '5NV6Rdv1a3I',
    coverImage: 'https://i.ytimg.com/vi/5NV6Rdv1a3I/hqdefault.jpg',
    coverBg:
      'linear-gradient(135deg, #f59e0b 0%, #d97706 48%, #1e1b4b 100%)',
    coverLabel: 'RANDOM ACCESS',
    coverSub: 'Daft Punk',
    duration: '4:09',
  },
];
