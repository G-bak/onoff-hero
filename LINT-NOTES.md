# 린트 검사와 예외 기록

2026-09-10 기준. 프로젝트 전체를 검사하며, `components/ui`나 테스트 폴더를 통째로 제외하지 않는다. 기존 33건은 코드 수정 17건과 아래 제한된 규칙 예외 16건으로 정리했다. 예외는 `.oxlintrc.json`의 정확한 파일 목록에만 적용한다.

## 수정한 코드

- `useIsMobile`: `matchMedia`를 `useSyncExternalStore`로 구독한다. 서버·초기 hydration 값은 기존처럼 `false`이며, 브라우저 상태를 읽은 뒤 변경 이벤트를 구독·해제한다.
- `Carousel`: 외부 Embla 상태를 구독해 이전·다음 버튼 상태를 읽는다. `select`와 `reInit`을 모두 해제한다. 이전 코드에서는 `reInit` 해제가 빠져 있었다.
- `CardRibbon`: `enabled`가 꺼졌을 때 준비 상태를 현재 컴포넌트 렌더 단계에서 조건부로 초기화한다. effect에서는 외부 WebGL 자원 준비·해제만 담당한다. 다시 켤 때 폐기된 장면의 준비 상태를 재사용하지 않는다.
- `Chart`: 설정 키는 문자열·숫자만 허용하고, 콜백 `dataKey`나 객체는 다음 이름 또는 `value`로 대체한다. 함수의 소스 문자열을 설정 키로 만들지 않는다. 숫자 `0`과 빈 문자열은 유효한 키로 보존한다.
- `Label`·`PaginationLink`: 호출자가 전달한 `htmlFor`와 `children`을 명시적으로 전달해 실제 연결·내용을 검사기가 확인하도록 했다.
- `BreadcrumbPage`: 클릭할 수 없는 현재 페이지 표시는 `span`과 `aria-current="page"`를 사용한다.
- 로딩 안내·회전 방향 상태는 네이티브 `output` 요소를 사용한다. 로딩 오류의 `role="alert"`는 유지한다.
- Node 테스트 등록은 `await test(...)`로 완료를 기다린다. 폰트 도구는 설치된 OpenType 패키지의 네이티브 ESM `parse`를 가져온다.

외부 상태 구독 방식은 [React 문서](https://react.dev/reference/react/useSyncExternalStore)를 따른다.

## 제한한 검사 규칙

| 파일 | 규칙 | 이유와 유지할 조건 |
| --- | --- | --- |
| `components/ui/button-group.tsx`, `field.tsx`, `input-group.tsx` | `jsx-a11y/prefer-tag-over-role` | 공용 `div` 그룹 API를 유지한다. `fieldset` 등 다른 요소로 자동 치환하지 않는다. 폼 라벨·컨트롤 연결은 별도로 검사한다. |
| `components/ui/carousel.tsx` | 같은 규칙 | [WAI 캐러셀 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/)이 허용하는 `region`·`group`과 슬라이드 설명을 유지한다. 호출자는 캐러셀의 접근 가능한 이름을 제공해야 한다. |
| `components/ui/item.tsx` | 같은 규칙 | 다양한 요소를 받는 목록 컨테이너 API를 보존한다. 사용 시 자식은 `listitem` 역할 또는 적절한 네이티브 목록 구조를 갖춰야 한다. 현재 첫 화면은 이 컴포넌트를 사용하지 않는다. |
| `components/ui/input-otp.tsx` | 같은 규칙 | 아이콘이 들어 있는 구분자다. 자식을 가질 수 없는 `hr`로 자동 교체하지 않는다. |
| `components/ui/spinner.tsx` | 같은 규칙 | SVG 아이콘에 로딩 상태 역할·접근 가능한 이름을 제공하는 API를 유지한다. |
| `app/components/card-ribbon.tsx` | 같은 규칙, `no-noninteractive-element-interactions`, `no-noninteractive-tabindex` | 3D 조작 영역 전체가 포커스를 받아 방향키·스페이스·드래그를 처리한다. 단일 버튼이나 폼 그룹으로 바꾸지 않는다. `tabIndex`, 접근 가능한 이름, 키보드 조작을 함께 유지한다. |
| `components/ui/input-group.tsx` | `click-events-have-key-events`, `no-noninteractive-element-interactions` | 부가 영역 클릭은 입력에 포커스를 옮기는 편의 기능이다. 키보드는 실제 입력에 Tab으로 접근한다. 부가 영역에 중복 Tab 정지점이나 가짜 버튼 역할을 추가하지 않는다. |
| `app/page.tsx`, `app/components/scene-loader.tsx` | `nextjs/no-img-element` | 두 곳의 로고는 사전에 크기를 조정한 로컬 PNG이며 명시적 크기와 우선 로딩을 사용한다. 이 권고를 없애기 위해 현재 Vinext 로고를 별도 이미지 처리 서비스로 바꾸지 않는다. |

이것은 접근성 전체를 검증했다는 의미가 아니다. 다른 접근성 규칙, React 규칙, 타입 관련 규칙은 계속 실행한다. 새 기능이나 파일 때문에 예외가 필요하면 실제 구현을 검토하고 이 표에 이유와 범위를 기록한다.

## 실행과 배포 연결

`npm run lint`는 `oxlint --deny-warnings`를 실행한다. 오류와 경고 모두 실패로 처리한다.

`npm run ci:build` → `npm run check` → 린트·타입·테스트 → 자산 생성·빌드·CSS/자산 검사 순서다. Cloudflare의 기존 빌드 명령을 그대로 사용한다. 수동 `npm run deploy`도 `ci:build`를 통과해야 한다. 검사 실패를 숨기는 옵션은 사용하지 않는다.

## 검증 기록

- 전체 린트 오류·경고 0, 타입 검사 통과.
- 로딩 5개·렌더링 7개·글꼴 3개·공용 상태 5개, 총 20개 테스트 통과.
- 공용 상태 테스트는 서버 렌더링, 캐러셀 버튼 상태·두 이벤트의 해제, 차트의 문자열·숫자·콜백 키를 확인한다.
- 프로젝트 밖 임시 파일에 `var` 위반을 넣어 같은 린트 설정이 실패하는 것도 확인했다. 검사 후 임시 파일을 제거했다.
- 네이티브 ESM 폰트 파서로 기존 글꼴의 `O`, `N`, `&`, `F`를 읽었다. 보관 중인 폰트 산출물은 다시 쓰지 않았다.
- 전체 빌드, 기존 배포 CSS 검사, 글꼴 92개 조각 및 이미지 검사 통과. 실제 브라우저 조작·화면 검증은 수행하지 않았다.
- 로컬 변경이며 커밋·GitHub push·운영 배포는 하지 않았다. 배포 절차 변경도 다음 push 이후 원격에 적용된다.
