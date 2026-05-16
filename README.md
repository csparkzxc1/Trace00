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
  _layout.tsx         루트 레이아웃
  (tabs)/             하단 탭
    _layout.tsx
    index.tsx         오늘
    history.tsx       기록
    settings.tsx      설정
src/
  data/               AsyncStorage CRUD
  lib/                util (notifications, date 등)
  components/         재사용 컴포넌트
```

## 진행
- [x] 1. 프로젝트 셋업
- [ ] 2. 데이터 레이어
- [ ] 3. 오늘 탭
- [ ] 4. 설정 탭 - 항목 관리
- [ ] 5. 알림
- [ ] 6. 기록 탭
- [ ] 7. 백업/복원/초기화
