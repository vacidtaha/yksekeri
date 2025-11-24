/**
 * YouTube API Keys Configuration
 * Her ders için ayrı API key kullanarak quota limitini artırıyoruz
 * Her key günlük 10,000 unit = Toplam 120,000 unit/gün
 * 
 * API key'ler .env.local dosyasından yüklenir
 */

export type SubjectType = 
  | 'tyt-matematik'
  | 'tyt-fen'
  | 'tyt-sosyal'
  | 'tyt-turkce'
  | 'ayt-matematik'
  | 'ayt-fizik'
  | 'ayt-kimya'
  | 'ayt-biyoloji'
  | 'ayt-edebiyat'
  | 'ayt-tarih'
  | 'ayt-cografya'
  | 'ayt-felsefe';

/**
 * Her ders için API key mapping
 * Environment variable'lardan yüklenir
 */
export const API_KEY_MAP: Record<SubjectType, string> = {
  'tyt-matematik': process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_TYT_MATEMATIK || '',
  'tyt-fen': process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_TYT_FEN || '',
  'tyt-sosyal': process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_TYT_SOSYAL || '',
  'tyt-turkce': process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_TYT_TURKCE || '',
  'ayt-matematik': process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_AYT_MATEMATIK || '',
  'ayt-fizik': process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_AYT_FIZIK || '',
  'ayt-kimya': process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_AYT_KIMYA || '',
  'ayt-biyoloji': process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_AYT_BIYOLOJI || '',
  'ayt-edebiyat': process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_AYT_EDEBIYAT || '',
  'ayt-tarih': process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_AYT_TARIH || '',
  'ayt-cografya': process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_AYT_COGRAFYA || '',
  'ayt-felsefe': process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_AYT_FELSEFE || '',
};

/**
 * Ders adından API key'i döndürür
 * @param subject - Ders tipi (örn: 'tyt-matematik')
 * @returns YouTube API key
 */
export function getApiKeyForSubject(subject: SubjectType): string {
  const apiKey = API_KEY_MAP[subject];
  
  if (!apiKey) {
    console.warn(`⚠️ ${subject} için API key bulunamadı! Mock data kullanılacak.`);
    return '';
  }
  
  console.log(`🔑 ${subject} dersi için API key yüklendi`);
  return apiKey;
}

/**
 * API key'in hangi derse ait olduğunu döndürür (debug için)
 */
export function getSubjectForApiKey(apiKey: string): SubjectType | null {
  const entry = Object.entries(API_KEY_MAP).find(([, key]) => key === apiKey);
  return entry ? entry[0] as SubjectType : null;
}

