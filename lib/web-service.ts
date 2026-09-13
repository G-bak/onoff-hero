// Customer-facing summary of the supplied v4 proposal. It contains no approved
// prices; proposed quantities, schedules and conflicting hosting terms stay out
// of public offers. See WEB-SERVICE-NOTES.md for the page-level source audit.
export const webPackages = [
  { code: 'STARTER', name: '랜딩페이지', purpose: '한 가지 상품이나 서비스를 집중해서 알릴 때', scope: '한 페이지 구성', features: ['핵심 정보와 문의를 한 페이지에', '브랜드에 맞춘 기본 레이아웃', 'PC·태블릿·모바일 대응', '일반 문의폼·검색 기초 설정'] },
  { code: 'BUSINESS', name: '기업 홈페이지', purpose: '회사 소개, 사업 안내, 소식을 나누어 보여줄 때', scope: '여러 페이지 구성', features: ['회사·사업별 메뉴와 페이지 기획', '회사에 맞춘 메인 화면 디자인', '소식 게시판의 목록·상세 화면', '일반 문의폼·기본 방문 분석'] },
  { code: 'BRAND', name: '브랜드 홈페이지', purpose: '브랜드의 특징과 콘텐츠를 더 자세히 보여줄 때', scope: '브랜드 맞춤 구성', features: ['레퍼런스 분석과 주요 화면 설계', '브랜드에 맞춘 디자인 방향 제안', '콘텐츠별 게시판·화면 모션', '페이지별 검색 설정·방문 분석'] },
] as const;

export const webProcess = [
  { title: '어떤 홈페이지가 필요한지 정합니다', text: '업종, 주요 고객, 소개할 내용과 원하는 문의 방식을 확인합니다. 필요한 페이지와 작업 범위, 예산·일정을 함께 정리합니다.', result: '필요한 자료: 회사 소개·로고·참고 사이트' },
  { title: '페이지 구성과 디자인을 확인합니다', text: '메뉴와 내용의 순서를 잡고 주요 화면을 디자인합니다. 고객이 먼저 알아야 할 정보와 문의 버튼의 위치를 확인합니다.', result: '확인할 내용: 페이지 구성안·주요 화면 시안' },
  { title: '실제로 작동하는 홈페이지를 만듭니다', text: '확정한 디자인을 개발하고 글과 사진을 넣습니다. PC와 휴대폰에서 화면, 링크, 문의 기능이 제대로 작동하는지 확인합니다.', result: '확인할 내용: 제작 화면·기능 검수 결과' },
  { title: '공개하고, 관리 방법을 안내합니다', text: '협의한 주소와 운영 환경으로 사이트를 공개합니다. 전달 자료와 수정 요청 방법을 안내하고, 필요한 경우 유지보수를 연결합니다.', result: '확인할 내용: 공개 주소·전달 자료·운영 안내' },
] as const;

export const webFaqs = [
  { question: 'SNS나 블로그가 있어도 홈페이지가 필요한가요?', answer: 'SNS는 소식을 알리고 고객과 소통하기 좋습니다. 홈페이지는 회사 소개, 서비스, 사례, 문의 방법을 정해진 메뉴에서 확인하게 할 수 있습니다. 여러 채널에서 같은 안내 페이지로 연결하고 싶을 때 함께 활용할 수 있습니다.' },
  { question: '글과 사진이 아직 준비되지 않았는데 문의해도 되나요?', answer: '현재 가진 자료와 소개하려는 사업부터 알려주세요. 고객이 제공할 자료와 새로 준비할 자료를 구분합니다. 원고 작성, 촬영, 영상·로고 제작이 필요하면 홈페이지 제작 범위와 비용을 구분해 안내합니다.' },
  { question: '제작 기간과 수정 횟수는 어떻게 정하나요?', answer: '페이지 수, 디자인과 기능의 범위, 자료 준비 상태를 확인한 뒤 견적서에서 안내합니다. 제작 중 수정 범위와 공개 이후의 변경 요청은 구분합니다. 추가 페이지나 구조 변경이 생기면 비용과 일정을 먼저 협의합니다.' },
  { question: '오픈 후 문구나 사진은 직접 바꿀 수 있나요?', answer: '이 제작 상품은 고객용 편집 관리자 화면을 제공하지 않습니다. 변경할 문구나 사진을 담당자에게 요청하는 방식이며, 필요한 작업만 건별로 맡기거나 월 관리로 진행할 수 있습니다.' },
  { question: '쇼핑몰이나 예약·결제 기능도 만들 수 있나요?', answer: '이 페이지의 상품은 회사·브랜드 소개와 일반 문의를 위한 홈페이지입니다. 쇼핑몰, 회원가입, 예약 처리, 결제, 업무용 시스템은 해당 상품의 제공 범위에 포함되지 않습니다.' },
] as const;

export const webSources = {
  devices: 'https://unsplash.com/photos/a-laptop-computer-sitting-on-top-of-a-wooden-table-c2k8vBHyNwM',
  planning: 'https://unsplash.com/photos/assorted-color-comic-script-D-_zRKxP9Rw',
  license: 'https://unsplash.com/license',
  responsive: 'https://web.dev/articles/responsive-web-design-basics',
  google: 'https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=ko',
  naver: 'https://searchadvisor.naver.com/guide/seo-basic-intro',
} as const;
