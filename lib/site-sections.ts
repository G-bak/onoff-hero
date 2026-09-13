export const siteSections = [
  { id: 'home', number: '01', label: 'HOME', description: '홈 섹션으로 이동' },
  { id: 'why', number: '02', label: 'SYSTEM', description: '온앤오프 통합 서비스 보기' },
  { id: 'design', number: '03', label: 'DESIGN', description: '디자인 작업물 보기' },
  { id: 'web', number: '04', label: 'WEB', description: '웹 서비스 보기' },
  { id: 'card', number: '05', label: 'MARKETING', description: '마케팅 콘텐츠 보기' },
  { id: 'services', number: '06', label: 'SERVICES', description: '서비스별 상세 안내 보기' },
  { id: 'film', number: '07', label: 'TOGETHER', description: '온앤오프 마무리 페이지 보기' },
] as const;

export type SiteSection = typeof siteSections[number]['id'];
export type SectionTransition = { progress: number; backActive: boolean };

// Later transitions must not move the indicator before their front is reached.
export function getSiteNavigation(transitions: readonly SectionTransition[]) {
  let index = 0;
  let position = 0;
  for (const transition of transitions) {
    position += Math.max(0, Math.min(1, transition.progress));
    if (transition.progress < 1) break;
  }
  for (const transition of transitions) {
    if (!transition.backActive) break;
    index++;
  }
  return {
    section: siteSections[Math.min(index, siteSections.length - 1)].id,
    progress: transitions.length ? position / transitions.length : 0,
  };
}
