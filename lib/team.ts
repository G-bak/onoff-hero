// Role placeholders for the character edition. Replace displayName and roles
// with supplied employee information when the actual team list is available.
export const team = [
  { displayName: null, role: '전략 기획자', category: 'BRAND STRATEGY', line: '브랜드가 나아갈 방향을 찾습니다.', visual: 0 },
  { displayName: null, role: '아트 디렉터', category: 'CREATIVE DIRECTION', line: '아이디어에 개성을 더합니다.', visual: 1 },
  { displayName: null, role: '디자이너', category: 'VISUAL DESIGN', line: '작은 디테일까지 세심하게 만듭니다.', visual: 2 },
  { displayName: null, role: '영상 제작자', category: 'FILM & MOTION', line: '이야기를 생생한 영상으로 만듭니다.', visual: 3 },
  { displayName: null, role: '개발자', category: 'DIGITAL EXPERIENCE', line: '아이디어를 디지털 경험으로 구현합니다.', visual: 4 },
  { displayName: null, role: '미디어 기획자', category: 'MEDIA & GROWTH', line: '브랜드와 고객의 접점을 설계합니다.', visual: 5 },
] satisfies Array<{ displayName: string | null; role: string; category: string; line: string; visual: number }>;
