# 미국 국립공원 트레일 pSEO 사이트 — Claude Code 핸드오프 기획서 **v3**

> **상태**: 3인 패널 + 5인 레드팀 + 5인 신규 패널(빌드·콜드스타트·유통·RPM·승인) 반영 / Phase 0.5 검증 전 / 코드 착수 전
> **한 줄 정의**: 미국 국립공원의 **객관·저난도(terrain gentleness) 우선 트레일 데이터 허브**. AllTrails(주관·리뷰)·NPS.gov(공식 head term)와 정면으로 붙지 않고, **DEM으로 직접 계산한 지형 메트릭 + 계산 롱테일 필터 + 입력형 도구**로 차별화한다.
> **v1→v2 변경**: 헤드라인을 OSM 접근성 태그 → DEM 계산 gentleness로 피벗. moat를 "데이터 moat"에서 "실행·큐레이션·UX 엣지"로 정직화.
> **v2→v3 변경(이번)**: ① MVP 스티칭 = route relation only ② 링커블 데이터 스토리 페이지 타입 ③ Pinterest-first 비-SEO 시드 유통 ④ 고RPM 동반 콘텐츠 클러스터 ⑤ AdSense 승인 게이트 강화(에디토리얼 코어만 신청).

---

## 0. 전제 & ROI 정직 평가 (착수 판단)

> ⚠️ **이건 고CPC 플래그십이 아니라 mid-RPM 볼륨 베팅이다.** 빌드·유지비가 형님의 CSV·API 버티컬보다 무겁다(OSM 스티칭, DEM 호스팅, 재추출). **진행은 아래 전제를 수용할 때만 합리적이다:**

1. **빌드 = 재사용 가능한 geo-pSEO 인프라.** OSM 추출·스티칭·DEM 프로파일링 파이프라인을 일회성이 아니라 향후 트레일/아웃도어/지오 버티컬의 공용 자산으로 본다.
2. **유지비 상한.** 트레일 지오메트리 재추출 = **분기 1회**. 잦은 폴링은 NPS alerts/closures만.
3. **이 둘을 수용 못 하면**, 고CPC 큐(솔라·모기지 등)를 먼저 하는 게 ROI상 옳다.

**moat의 정직한 정의**: raw DEM grade 계산은 복제 가능하다 → **데이터 우위가 아니다.** 실제 방어선은 ① AllTrails/NPS가 안 만드는 **pSEO 롱테일 필터 페이지 인벤토리**, ② **입력형 도구**(SEO로 복제 가장 어려움), ③ 큐레이션·UX 실행력이다.

---

## 1. 핵심 의사결정 (합의 완료)

| 항목 | 결정 |
|---|---|
| 시장/언어 | 영어 / 미국·글로벌 |
| 수익화 1순위 | AdSense 중심 (제휴 REI·Amazon 보조), **mid-RPM 볼륨 플레이로 인식** |
| 진입 wedge | **저난도·가족/초보** (헤드라인 데이터 = DEM 계산 gentleness) → broad 확장 |
| 지리 | 국립공원 앵커 (단 head term 비타깃) + 메트로·주립·지역 병행 확장 |
| 데이터 | OSM Overpass(지오메트리·태그) + 자체호스팅 DEM(표고) + NPS(경계·alerts) |
| Hero 자산 | **Trail Fit Score** 3종 (가중: Gentleness/Family = 헤드라인, Accessibility = 보조신호, Difficulty = 확장) |

---

## 2. 라이선스 & 컴플라이언스 게이트 (Hard Gate)

### 2.1 OSM (ODbL)
- 상업·AdSense·금전청구 OK. **출처표기 의무.** share-alike는 "파생 DB 배포" 시 발동.
- **Produced Work 설계**: 가공 DB 외부배포 금지. Overpass는 **운영 트래픽 직접 호출 금지** → 배치로 자체 Turso 적재 후 서빙.
- **분리 표기**: 페이지 데이터 출처 영역 `© OpenStreetMap contributors`(링크) / 지도 타일 출처 / 표고 출처 각각.

### 2.2 표고 (DEM)
- OSM에 트레일 표고 없음 → 외부 DEM 필수. **Open-Meteo elevation = 상업 금지 → 사용 금지.**
- 채택: **Open-Topo-Data 자체 호스팅** — 미국 USGS NED/3DEP 10m급(PD), 미국 외 Copernicus GLO-30. 자체호스팅으로 rate/상업 제약 제거.
- ⚠️ Phase 0.5: 정확한 데이터셋명 지원 여부 라이브 검증.

### 2.3 NPS (US Federal PD)
- 공원 경계·메타·**alerts/closures** 활용(퍼블릭 도메인). ⚠️ alerts 엔드포인트 Phase 0.5 검증.

---

## 3. Phase 0.5 검증 게이트 (코드 전 라이브 검증)

- [ ] **🔴 HARD: 경쟁 saturation.** 계산 롱테일·필터 쿼리("stroller friendly trails under 2 miles in [park]", "easiest hike to [feature]" 등)를 **이미 장악한 pSEO incumbent 존재 여부.** 있으면 중단 또는 재wedge. (형님 하드룰)
- [ ] **🔴 HARD: OSM 태그 커버리지 실측.** 대표 공원 3곳에서 `surface`·`smoothness`·`wheelchair`·`incline` 채움율 측정. *주의: wedge 생존은 DEM 기반이라 태그가 낮아도 OK — 이 측정은 "Accessibility 보조신호를 표시할 수 있는가" 판단용.*
- [ ] **NPS 경계 소스** 확정 (NPS API / data.gov / OSM `boundary=national_park`).
- [ ] **NPS alerts/closures 엔드포인트** 존재·필드 검증.
- [ ] **route relation vs way-cluster 비율** → 스티칭 난이도.
- [ ] **표고 smoke test** → DEM 노이즈 고도상승 과대추정 측정 → 스무딩 파라미터 튜닝.
- [ ] **Open-Topo-Data 데이터셋명** 지원 확인.
- [ ] **검색 수요** 검증 (롱테일 필터 쿼리 볼륨·경쟁도).
- [ ] **per-cell 임계치 통과율** 추정 → 공원 우선순위 확정.

---

## 4. 데이터 소스 & ETL (L1)

| 소스 | 용도 | 라이선스 |
|---|---|---|
| OSM Overpass | 트레일 지오메트리·태그·POI·피크 | ODbL |
| Open-Topo-Data(자체호스팅) | 표고 → 고도 프로파일 | PD/표기 |
| NPS API | 공원 경계·메타·**alerts/closures** | US Federal PD |

### 4.1 추출
- 공원 경계 폴리곤으로 한정. 후보: `way[highway=path|footway|track]`, `relation[route=hiking]`.
- 태그: `name`, `sac_scale`, `trail_visibility`, `surface`, `smoothness`, `width`, `incline`, `wheelchair`, `access`.
- POI: `viewpoint`, `parking`, `drinking_water`, `toilets`, `information`, `natural=peak(+ele)`, `natural=cliff`, `waterfall`.

### 4.2 스티칭 (가장 어려운 ETL)
- 논리적 트레일 = route relation(정렬 멤버) 또는 동일 `name` 연결 way 집합 → 폴리라인 스티칭(방향·갭 처리).
- **🟢 MVP 범위 축소(v3)**: **MVP는 `route=hiking` relation만 처리**(이미 순서대로 묶여 있어 스티칭 거의 불필요). 임의 way-cluster 스티칭은 Phase 2+로 연기. relation 트레일 = 명명된 고수요 트레일이라 wedge와 정합하면서 빌드 리스크를 크게 낮춤.
- 멀티스테이트/초장거리 → 공원 경계 내 세그먼트로 한정. (Open Issue)

### 4.3 표고 프로파일
- 폴리라인 10~30m 리샘플 → Open-Topo-Data 조회.
- **스무딩/히스테리시스(5~10m 임계)로 고도상승 과대추정 방지(필수).** → total gain/loss, max grade, sustained grade, grade-adjusted distance.

### 4.4 운영 / 신선도
- ETL 배치: GitHub Actions / Vercel Cron.
- **재추출 분기 1회**(지오메트리 저빈도 변화). `last_verified_at` 기록.
- **NPS alerts/closures만 잦은 폴링** → 각 공원·트레일 페이지에 "현재 공식 경보·폐쇄" 노출. *현재 조건은 절대 자체 단정 안 함 — 공식 경보를 링크/표시로만.*

---

## 5. 3-Layer 아키텍처

- **L1 Raw**: OSM 지오메트리·태그·POI + DEM 표고 + NPS alerts (Turso).
- **L2 Derived (계산 엣지)**: §6 메트릭·스코어. 결정론적.
- **L3 Narrative**: Gemini 2.5 Flash 서술. **안전·접근성 문구 human-review 게이트.**

---

## 6. 계산 엣지 — Trail Fit Score (Hero)

> 페르소나별 적합도 3종. 입력 = L2 결정론 메트릭. **방법론 전면 공개(GEO/EEAT).** **가중 변경(v2):** Gentleness/Family = 헤드라인, Accessibility = 보조신호, Difficulty = 확장.

### 6.1 입력 메트릭 (결정론)
거리, 총 고도상승, 최대/지속 경사, surface 구성(%), 형태(loop/out-back), `sac_scale`, POI 근접(주차·식수·화장실·전망·절벽·폭포).

### 6.2 ① Gentleness / Family-Fit — **헤드라인 (full coverage)**
- **DEM 계산 기반(우리가 100% 통제)**: 짧은 거리·낮은 고도상승·완만한 max grade·loop·POI 근접 → 보상. 급경사·`natural=cliff`·긴 거리 → 감점.
- 이게 wedge의 토대 — OSM 태그가 아니라 **우리 계산값**에 의존하므로 커버리지 문제 없음.

### 6.3 ② Accessibility — **보조 신호 (하드 클레임 금지)**
- `wheelchair`·`smoothness`·`surface`·max grade(ADA 정보 기반 ~5%) 가 **있을 때만** 표시. 없으면 "OSM 미확인 — 방문 전 확인".
- **휠체어 접근 가능을 절대 단정하지 않는다.** 보수적 면책 필수.

### 6.4 ③ Objective Difficulty — **확장용**
- 투명 합성(예: `sqrt(2 × gain × distance)` 정규화 + 지속경사·`sac_scale`). 진지한 하이커층 확장 시.

### 6.5 시간·노력 추정 (입력형 도구)
- Tobler/Naismith(+Langmuir) 프로파일 기반. 사용자 입력(체력·동반자·유모차/휠체어·배낭)으로 보정.

---

## 7. DB 스키마 (Drizzle/Turso, 초안)

```ts
park { id, slug, name, state, nps_unit_code, boundary_geojson,
       alerts_json, alerts_updated_at,        // NPS alerts/closures
       blurb_l3, trail_count, fit_score_distribution_json, last_verified_at }

trail { id, slug, park_id, name, osm_type, osm_id,
        geometry_geojson, length_m,
        elevation_profile_json, total_gain_m, total_loss_m, max_grade, sustained_grade,
        surface_breakdown_json, smoothness, sac_scale, trail_visibility,
        wheelchair_tag,                        // 'yes'|'no'|null(미확인)
        shape,
        gentleness_score, family_fit_score,    // 헤드라인 (DEM 기반)
        accessibility_score, accessibility_verified(bool),  // 보조신호
        difficulty_score,                       // 확장용
        narrative_l3, narrative_status, publish_state('held'|'noindex'|'live'),
        last_verified_at }

poi { id, park_id, trail_id?, type, name, lat, lng, ele }
comparison { id, trail_a_id, trail_b_id, slug, narrative_l3, publish_state }
```

- `geometry_geojson`/`elevation_profile_json` 단순화 후 저장.

---

## 8. 라우팅 / 페이지 택소노미 (우선순위 재배치 v2/v3)

> **트래픽 head = 계산 롱테일 필터 + 도구.** trail-detail·park-hub는 **권위·내부링크용 supporting**. NPS head term `"[park] trails"`는 **비타깃.**

| 경로 | 역할 | 우선순위 |
|---|---|---|
| `/parks/[park]/stroller-friendly` `/easy-flat-trails` `/kid-friendly` `/trails-under-2-miles` `/least-steep-to-[feature]` | **계산 롱테일 필터** | 🔵 트래픽 head |
| `/tools/hiking-time-calculator`, 비교, 파인더 | **입력형 도구** | 🔵 가장 방어적 |
| `/stories/[slug]` (예: "폭포까지 가장 완만한 트레일 25선") | **링커블 데이터 스토리(v3)** | 🟣 권위 부트스트랩 / 핸드크래프트 월 1회 |
| `/guides/[park]/family-trip` `/gear/[topic]` (토들러 하이킹 준비물, 트레일용 유모차 등) | **고RPM 동반 클러스터(v3)** | 🟠 수익 워크호스 |
| `/parks/[park]/trails/[trail]` | 트레일 상세(고유성) | ⚪ supporting authority |
| `/parks/[park]` | 공원 허브 + alerts 노출 | ⚪ supporting authority |
| `/compare/[a]-vs-[b]` | 비교(선별) | 🔵 |
| `/methodology` | 방법론 공개 | ⚪ EEAT/GEO |

- **링커블 데이터 스토리(🟣)**: original-data 랭킹/저널리즘. 백링크를 끌어 도메인 권위를 만들고, 그 권위가 supporting·롱테일 페이지로 흐른다. 콜드스타트 권위 문제의 핵심 해법.
- **고RPM 동반 클러스터(🟠)**: 데이터 페이지(저RPM)는 디스커버리·내부링크 역할, trip-planning·gear-intent·여행 의도 페이지가 실제 수익. 데이터 페이지에서 동반 클러스터로 내부링크.

병행 확장: **메트로·주립·지역 오픈스페이스**(국립공원 head 경쟁 회피, demand 확보).

---

## 9. 인터랙티브 도구 (가장 방어적인 moat)

1. **Time & Effort 계산기** — 사용자 입력 → 보정 소요시간·effort tier. (AI Overviews 저항)
2. **트레일 A vs B 비교** — 고도프로파일·grade·surface %·scores.
3. **필터형 파인더** — gentleness·max grade·거리·gain 범위.

React 클라이언트, 정적 빌드 메트릭 구동.

---

## 10. 콘텐츠 파이프라인 (L3)

- Gemini 2.5 Flash. **L2 결정론 메트릭을 사실 근거로 주입**(숫자는 L2, 문장만 L3).
- **안전·접근성 문구 human-review 게이트(YMYL).**
- 고볼륨 단순 페이지는 **결정론 NLG 우선** → Scaled Content Abuse 회피.

---

## 11. 품질 게이트 / Scaled Content Abuse 회피

- **per-cell 임계치(미달 = `held`)**: 스티칭 길이/노드, `name` 존재, 표고 프로파일 성공. (gentleness는 DEM이라 항상 계산 가능)
- 큐레이션 리스트 최소 N개 확보 시만 발행(빈 리스트 금지).
- 비교는 검색 수요 검증된 쌍만.

---

## 12. 발행 램프 & Go-to-Market (v3)

**발행 순서**:
1. **핸드빌드 에디토리얼 코어 ~20-30p** (링커블 스토리 + 플래그십 공원 가이드 + 방법론) — 프로그래매틱 셸 없이.
2. **AdSense 승인은 이 코어로만 신청.** ⚠️ **프로그래매틱 레이어는 승인 전까지 `noindex` + 네비 제외** (리뷰어가 템플릿 페이지를 못 보게 → "low value content" 거절 회피).
3. 승인 후 7일 dry-run(noindex) → 스팟체크 → wave 발행(GSC 인덱싱 속도 governor) → 공원 단위 확장.

**콜드스타트 시드 유통(비-SEO, v3)**: 신규 도메인은 수개월 트래픽 0 → SEO 성숙 가교로 **Pinterest-first**. 가족/저난도 하이킹은 Pinterest에서 강력(시각·플래닝 의도·에버그린). 링커블 스토리 + 상위 필터 리스트를 배포 → 비구글 트래픽 + 인게이지먼트 시그널 + 백링크 유도. (스팸 금지, 큐레이션)

---

## 13. EEAT / YMYL / GEO

- 하이킹 = 경상 YMYL. 신뢰 신호: 방법론 공개, 출처 표기, `last_verified_at`, **NPS 공식 경보 링크**, 접근성 보수적 단정 금지+면책, about, schema.
- GEO: 산식 투명성·구조화 데이터로 AI Overviews에 "방법론 출처"로 인용 유도.

---

## 14. 수익화

- **AdSense 중심**(콘텐츠 통합형, 도구 페이지 배치 신중). **mid-RPM 인식** → 볼륨으로.
- **고RPM 동반 클러스터(v3)가 수익 워크호스**: trip-planning·gear-intent·여행/숙박 의도 페이지(데이터 페이지보다 CPC↑). 데이터 페이지 = 디스커버리·내부링크.
- **제휴 보조(트래픽 형성 후)**: REI/Amazon 키즈·유모차·아웃도어. 가족/장비 의도 정합 → 블렌디드 RPM↑.

---

## 15. 로드맵

| Phase | 내용 |
|---|---|
| 0.5 | §3 게이트 (특히 🔴 saturation·태그 커버리지) |
| 1 | ETL(**relation only**·표고) + L2 스코어 + 스키마 + NPS alerts |
| 2 | 핸드빌드 에디토리얼 코어 ~20-30p(**링커블 스토리 3-5개** + 플래그십 가이드 + 방법론) → **코어만으로 AdSense 승인 신청**, 프로그래매틱 noindex |
| 2.5 | **Pinterest 시드 유통** 시작(스토리·필터 리스트) — 비-SEO 트래픽 가교 |
| 3 | 도구 3종 + 롱테일 필터 템플릿 + 고RPM 동반 클러스터 |
| 4 | 승인 후 dry-run → wave 발행 |
| 5 | way-cluster 스티칭 확대 + 메트로·주립·지역 확장 → broad → 글로벌 |

---

## 16. 컴플라이언스 / 리스크 테이블 (v3)

| 리스크 | 완화 |
|---|---|
| AllTrails/NPS.gov head term 장악 | head term 비타깃, 계산 롱테일·도구로 우회 |
| AI Overviews 잠식 | 입력형 도구·필터·비교 |
| **moat 복제 가능(DEM 계산)** | moat=실행·큐레이션·UX·도구로 정직화. 🔴 saturation 하드 게이트 |
| **콜드스타트 트래픽 0(v3)** | Pinterest-first 시드 유통 + 링커블 스토리 백링크 |
| **도메인 권위 부재(v3)** | 링커블 데이터 스토리로 권위 부트스트랩 → 내부링크 전파 |
| **AdSense 승인 거절(v3)** | 핸드빌드 코어로만 신청, 프로그래매틱 noindex until 승인 |
| **빌드 리스크(스티칭, v3)** | MVP = relation only, way-cluster Phase 5 |
| **ROI/유지비 부담** | mid-RPM 인식, 재사용 인프라로 정당화, 재추출 분기 1회 |
| OSM 태그 결손 | 헤드라인을 DEM 기반으로(태그 비의존). 태그는 보조신호 |
| DEM 노이즈 | 스무딩/히스테리시스 |
| Scaled Content Abuse | 계산 고유성·결정론 NLG·human review·wave |
| **접근성 오표기** | wheelchair 태그 없으면 단정 금지·강한 면책 |
| 시즌/현장조건 | NPS 공식 경보 링크 + "방문 전 확인" |
| ODbL share-alike | Produced Work·DB 외부배포 금지·분리 표기 |

---

## 17. Open Issues

1. NPS 경계·alerts 최종 소스/필드 (Phase 0.5).
2. 멀티스테이트/초장거리 세그먼트 처리.
3. trail slug 충돌 처리.
4. route-relation vs way-cluster 스티칭 우선순위.
5. 비교 페이지 자동 생성 기준.
6. 제휴 레이어 투입 시점.
7. Open-Topo-Data 데이터셋명 확정.
8. 메트로·주립·지역 확장 데이터 소스(국립공원 외 경계).

---

### 동반 문서
- **Claude Design 프롬프트** (롱테일 필터 리스트·트레일 상세·도구·공원 허브 UI) — 요청 시 별도 제작.
