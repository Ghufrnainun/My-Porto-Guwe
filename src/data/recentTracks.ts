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
    streamUrl:
      'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/c6/d9/2a/c6d92a27-e5e5-7b96-55bd-69c57206ba9e/mzaf_718874132971187979.plus.aac.p.m4a',
    ytId: 'Dx_fKPBPYUI',
    coverImage:
      'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/1b/7a/5e/1b7a5e77-b0c4-6e32-f3ee-c09c70f8378e/jacket_SRCL09571B00Z_550.jpg/600x600bb.jpg',
    coverBg:
      'radial-gradient(circle at 30% 30%, #ff5f57 0%, #3a1c28 52%, #121015 100%)',
    coverLabel: 'LOSER',
    coverSub: '米津玄師',
    duration: '0:30',
  },
  {
    id: 'attitude',
    title: 'ATTITUDE',
    artist: 'aespa',
    streamUrl:
      'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/84/34/f0/8434f0e6-0d39-0340-030a-0168bba3825b/mzaf_7352837177102038356.plus.aac.p.m4a',
    ytId: '4xDzrJKXOOY',
    coverImage:
      'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/50/7e/e0/507ee09f-ccfd-1e3c-af90-ca5e92b1221b/00888735949869_Cover.jpg/600x600bb.jpg',
    coverBg: 'linear-gradient(145deg, #c084fc 0%, #818cf8 48%, #38bdf8 100%)',
    coverLabel: 'ATTITUDE',
    coverSub: 'aespa',
    duration: '0:30',
  },
  {
    id: 'odoriko',
    title: 'Odoriko',
    artist: 'Vaundy',
    streamUrl:
      'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/b7/6c/e1/b76ce16b-bbb1-b2f1-37a8-50b7fe734860/mzaf_12745039835044644768.plus.aac.p.m4a',
    ytId: '7HgJIAUtICU',
    coverImage:
      'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/a2/5f/07/a25f0778-e092-ca34-5125-c2e1433c4f26/198009368648.png/600x600bb.jpg',
    coverBg:
      'radial-gradient(circle at 70% 25%, #fb923c 0%, #7c2d12 58%, #18181b 100%)',
    coverLabel: '踊り子',
    coverSub: 'Vaundy',
    duration: '0:30',
  },
  {
    id: 'flowers',
    title: 'Flowers',
    artist: 'aespa',
    streamUrl:
      'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/7d/1b/a1/7d1ba15e-19fb-0411-e503-61e4379abd10/mzaf_16342830676435185944.plus.aac.p.m4a',
    ytId: 'jfKfPfyJRdk',
    coverImage:
      'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/d5/c1/f5/d5c1f505-f588-775f-df05-c672a8ec22e9/888735949562_Cover.jpg/600x600bb.jpg',
    coverBg:
      'radial-gradient(circle at 50% 45%, #a3e635 0%, #27272a 48%, #09090b 100%)',
    coverLabel: 'FLOWERS',
    coverSub: 'aespa',
    duration: '0:30',
  },
  {
    id: 'kickback',
    title: 'KICK BACK',
    artist: 'Kenshi Yonezu',
    streamUrl:
      'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/86/2d/45/862d4572-805c-3a72-49a4-905a8c327888/mzaf_14805576631717868964.plus.aac.p.m4a',
    ytId: 'M2cckDmNLMI',
    coverImage:
      'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/4e/a8/75/4ea875d1-bdb6-9b83-185a-646391cbffbd/4547366589849.jpg/600x600bb.jpg',
    coverBg: 'linear-gradient(135deg, #facc15 0%, #ef4444 55%, #1f2937 100%)',
    coverLabel: 'KICK BACK',
    coverSub: '米津玄師',
    duration: '0:30',
  },
  {
    id: 'nightcall',
    title: 'Nightcall',
    artist: 'Kavinsky',
    streamUrl:
      'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/d2/45/fb/d245fbf9-8570-fdc0-5e6b-aa528c130486/mzaf_11947081694159530687.plus.aac.p.m4a',
    ytId: 'MV_3Dpw-BRY',
    coverImage:
      'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/c1/2d/fe/c12dfe8f-cdf6-e179-d69a-8ec35f760266/00602537248681.rgb.jpg/600x600bb.jpg',
    coverBg: 'linear-gradient(150deg, #ec4899 0%, #6366f1 52%, #0f172a 100%)',
    coverLabel: 'NIGHTCALL',
    coverSub: '1986',
    duration: '0:30',
  },
];
