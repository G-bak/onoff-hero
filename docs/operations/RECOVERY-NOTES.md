# 사용 중 3D 장애 복구 기록

2026-09-10, 검토 항목 7의 로컬 수정·검증 기록이다. Git 커밋, GitHub push, 운영 배포는 하지 않았다.

## 변경한 동작

- 앞·뒤 WebGL 캔버스 중 하나라도 연결을 잃으면 두 3D 레이어를 즉시 숨기고 기존 HTML 기본 카드를 표시한다. 복구 안내는 다른 메뉴를 막지 않는다.
- 두 컨텍스트가 모두 복원되고 양쪽 렌더링이 끝난 뒤 3D를 다시 표시한다. 복원 이벤트 하나만으로 완료 처리하지 않는다. MOTION OFF에서도 복구에 필요한 프레임을 요청한다.
- 화면이 보이는 시간을 합산해 10초 동안 복구되지 않으면 기본 화면으로 확정한다. 숨겨진 탭과 두 번째 섹션에 완전히 가려진 첫 화면의 시간은 제외하며 반복 손실 이벤트가 제한 시간을 늘리지 않는다. 최초 로딩의 기존 5분 제한과 별도 정책이다. 두 번째 화면에서는 3D 프레임과 안내도 쉬며, 복귀하면 모션·방향 상태를 유지해 재개한다. 실제 컨텍스트 손실 후 11초 동안 가린 상태와 복귀·복원 검증은 [PAGE2-NOTES.md](../pages/PAGE2-NOTES.md)에 기록했다.
- 복구 중 `기본 화면으로 보기`를 선택할 수 있다. 기본 화면의 `3D 다시 시도`는 해당 장면만 새로 만든다. 페이지를 새로고침하지 않으며 모션 ON/OFF와 회전 방향 설정을 유지한다.
- 로딩 완료 후 발생한 렌더링·크기 조정 예외도 기본 화면으로 전환한다. 재시도 초기화가 실패해도 기본 화면에서 다시 시도할 수 있다.
- 복구 중에는 3D 조작 버튼과 키보드 진입을 비활성화하고 드래그 캡처·관성을 정리한다. 메뉴와 상담 안내 창은 계속 사용할 수 있다.

## 자원과 유지보수

`lib/scene-recovery.ts`가 두 컨텍스트의 상태와 제한 시간을 관리한다. `card-ribbon.tsx`는 실제 브라우저 이벤트·렌더링·자원 정리를 연결하며, `scene-recovery-notice.tsx`와 페이지가 안내 및 재시도를 담당한다. 복구 제한 시간은 `sceneRecoveryTiming.maximumVisibleMs`에서 바꾼다.

브라우저 재현 중 복원 전 세대의 버퍼를 나중에 삭제하면서 `INVALID_OPERATION` 경고가 발생하는 것을 발견했다. 손실 직후 geometry·material·texture의 GPU 자원을 양쪽에서 정리하고, CPU의 형상·이미지 데이터를 유지해 복원 후 다시 업로드하도록 수정했다. 정리할 때 배열을 비우지 않아 이후 최종 해제도 수행한다. 복구 중인 캔버스는 투명도 전환 없이 즉시 숨겨 깨진 캔버스가 노출되지 않게 했다.

최종 종료 시 타이머·프레임·이벤트·ResizeObserver·요청·GPU 자원을 해제하고 캔버스를 제거한다. 살아 있는 컨텍스트도 명시적으로 해제하여 반복 재시도가 브라우저의 컨텍스트 수 제한을 소모하지 않게 한다. 이미 잃은 컨텍스트에는 중복 손실 요청을 하지 않는다.

## 확인 결과

- `npm run ci:build` 통과: 린트 오류·경고 0, 타입 검사, 테스트 32개(기존 20개 + 복구 12개), 프로덕션 빌드 및 CSS·자산 검사.
- 복구 단위 테스트는 양쪽 복원 순서, 중복 이벤트, 실제 렌더 완료 확인, 숨겨진 시간 제외, 제한 시간, 정리 이후 호출 무시, 이벤트 해제, MOTION OFF의 한 번 재렌더링을 검증한다. `npm run test:recovery`로 개별 실행하며 `npm run check`에도 포함된다.
- 설치된 Chrome 152.0.7977.83에서 `WEBGL_lose_context`로 실제 컨텍스트 손실·복원을 발생시켰다. 로컬 개발 서버 5187과 빌드한 Worker의 임시 로컬 서버 5188에서 각각 아래 10가지 시나리오를 통과했다.

| 시나리오 | 결과 |
| --- | --- |
| 처음 양쪽 렌더링 및 로더 종료 | 정상 |
| 앞쪽 손실·복원 및 조작 잠금 | 정상 |
| 뒤쪽 손실·복원 | 정상 |
| 양쪽 손실 후 한쪽만 복원 | 복구 중 유지, 양쪽 복원 후 정상 |
| MOTION OFF·역방향에서 복구 | 설정 유지, 방향키 조작 가능 |
| 10초 복원 실패 | 캔버스 제거·기본 카드 표시, 상담 안내 이용 가능 |
| 기본 화면에서 재시도 | 새로고침 없이 정상, 기존 설정 유지 |
| 복구 중 즉시 기본 화면 선택·재시도 | 정상 |
| 렌더링 함수에 예외 주입 | 기본 화면 전환 및 재시도 정상 |
| 390×844 모바일 화면 | 안내가 화면 안에 표시되고 양쪽 복구 정상 |

브라우저 페이지 오류 0, 의도적으로 주입한 렌더링 실패에 대한 앱 경고 1건 외 콘솔 오류·경고 0이었다. 데스크톱 1440×900과 모바일 390×844의 복구 중·복원 후 스크린샷을 열어 기본 카드와 3D 카드가 실제로 표시되는 것도 확인했다. 단순히 `is-ready` 클래스나 복원 이벤트만 검사하지 않았다.

결과·이미지는 Git 제외 경로 `outputs/qa/2026-09-10/home/recovery-browser-results.json`, `outputs/qa/2026-09-10/home/recovery-production-browser-results.json`, `outputs/recovery-*.png`에 보관했다. 전체 검사 로그는 `outputs/qa/2026-09-10/home/recovery-ci.log`다. 검증용 Playwright는 프로젝트 밖 임시 폴더에 설치하여 앱 의존성은 변경하지 않았다. 임시 Worker 서버는 종료하고 사용자의 5187 서버는 유지했다.

확인 범위는 해당 Chrome의 제어된 WebGL 손실·복원과 예외 주입이다. 실제 GPU 드라이버 충돌, 다른 브라우저·실물 모바일 기기 전체에 대한 무오류 보장은 아니다. 숨겨진 탭의 시간 정책은 가상 시계 단위 테스트로 검증했다. 기존 500kB 초과 Three.js 청크 빌드 경고 및 로딩 시간 실측은 별도 성능 검토 대상으로 유지한다.

## 브라우저에서 다시 확인하는 방법

로컬 페이지가 완전히 열린 뒤 개발자 도구 콘솔에서 아래 코드를 실행한다. 이 명령은 현재 확인 중인 로컬 탭의 3D만 일시적으로 끊는다.

```js
const pair = [...document.querySelectorAll('.ribbon-stage canvas')].map(canvas =>
  canvas.getContext('webgl2').getExtension('WEBGL_lose_context'));
pair.forEach(extension => extension.loseContext());
setTimeout(() => pair.forEach(extension => extension.restoreContext()), 1500);
```

기본 카드와 복구 안내가 나타난 뒤 3D로 돌아와야 한다. 시간 초과를 확인할 때는 마지막 `setTimeout` 줄을 실행하지 않고 10초 기다린다. 이후 `3D 다시 시도`를 누른다. 정상 복원 확인 때는 의도된 0.65초 표시 전환이 끝난 화면까지 확인한다. 최초 초기화 오류를 재현할 때는 기존 전체 로더의 오류 안내도 별도로 확인한다.

이벤트의 의미와 복구 조건: [MDN 컨텍스트 손실](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextlost_event), [MDN 컨텍스트 복원](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextrestored_event), [MDN WEBGL_lose_context](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_lose_context). Three.js 동작은 설치된 `node_modules/three/src/renderers/WebGLRenderer.js`와 `webgl/WebGLGeometries.js`를 함께 확인했다.
