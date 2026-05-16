# 영성훈련 체크리스트 (Trace00)

개인용 영성훈련 체크리스트 앱. Expo + React Native + TypeScript.

매일 정한 항목 체크 + 정해진 시각에 로컬 알림. 인증/서버/공유 없음. 100% 기기 내 저장.

## 스택
- Expo SDK 54 + React Native + TypeScript
- expo-router (탭 네비)
- NativeWind v4 (Tailwind)
- AsyncStorage (로컬 저장)
- expo-notifications (로컬 예약 알림)
- date-fns

## 실행
```bash
npm install
npx expo start
```

- Android: Expo Go 가능
- iOS: 로컬 알림 실기기 테스트는 development build 필요 (Expo Go 푸시 제한)

## 구조
```
app/                  expo-router 라우트
  _layout.tsx         루트 레이아웃 (앱 시작 시 데이터 로드 + 알림 재예약)
  (tabs)/             하단 탭
    _layout.tsx
    index.tsx         오늘 (체크 + 메모)
    history.tsx       기록 (히트맵 + streak + 항목별 30일)
    settings.tsx      설정 (항목 / 알림 / 데이터)
src/
  data/
    types.ts          AppData 모델 + 기본 항목
    storage.ts        AsyncStorage CRUD
    store.ts          useSyncExternalStore 기반 메모리 캐시
  lib/
    date.ts           한국어 날짜 포맷
    id.ts             단순 uid
    notifications.ts  권한 요청 + scheduleNotificationAsync
    stats.ts          히트맵 / streak / 30일 완료율
  components/         재사용 컴포넌트
```

## 데이터 키
`AsyncStorage` 키 `checklist:v1`
```json
{
  "items": [{ "id": "...", "name": "QT", "order": 0 }],
  "records": { "2026-05-16": { "checks": { "<itemId>": true }, "memo": "..." } },
  "settings": { "notification": { "enabled": true, "hour": 6, "minute": 30 } }
}
```

## 진행
- [x] 1. 프로젝트 셋업
- [x] 2. 데이터 레이어 (CRUD + 시드)
- [x] 3. 오늘 탭 (체크 + 메모, 자정 넘김 대응)
- [x] 4. 설정 탭 - 항목 CRUD + 순서 변경
- [x] 5. 알림 (권한 요청 + 시각 변경 시 재예약)
- [x] 6. 기록 탭 (히트맵 12주 + streak + 항목별 30일)
- [x] 7. 백업/복원/초기화 (JSON Share + import + reset)
