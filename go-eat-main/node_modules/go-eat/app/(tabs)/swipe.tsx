import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity,
  Dimensions, ScrollView, Modal, Animated, PanResponder,
} from 'react-native';
import { X, Heart, BookmarkPlus, Star, Shuffle, SlidersHorizontal } from 'lucide-react-native';
import { STORES } from '../../constants/mockData';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');
const TAB_BAR_OFFSET = 105;
const SWIPE_THRESHOLD = width * 0.3;

const MOODS = [
  { id: 'tired',  label: '好累',  sub: '想吃輕食', emoji: '😴' },
  { id: 'hungry', label: '超餓',  sub: '要吃飽',   emoji: '🔥' },
  { id: 'biz',    label: '商務',  sub: '客戶聚餐', emoji: '💼' },
  { id: 'date',   label: '約會',  sub: '浪漫一點', emoji: '💑' },
  { id: 'sad',    label: '療癒',  sub: '吃爽的',   emoji: '🥺' },
];

const BUDGETS = [
  { id: 'low',  label: '銅板',    sub: '$100以下', emoji: '💰' },
  { id: 'mid',  label: '中等',    sub: '$100–300', emoji: '🍱' },
  { id: 'high', label: '享受一下', sub: '$300以上', emoji: '🥂' },
];

const EXCLUDE_OPTIONS = [
  { id: 'oily',   label: '太油膩的', emoji: '🐷' },
  { id: 'soup',   label: '湯湯水水', emoji: '🍜' },
  { id: 'spicy',  label: '太辣的',   emoji: '🌶️' },
  { id: 'beef',   label: '吃過牛肉', emoji: '🐄' },
  { id: 'pricey', label: '太貴了',   emoji: '💸' },
  { id: 'garlic', label: '蔥蒜類',   emoji: '🧅' },
];

const QUICK_FILTERS = [
  { id: 'near', label: '步行可達',  emoji: '📍' },
  { id: 'fast', label: '15分鐘內', emoji: '⏱' },
  { id: 'top',  label: '4.8分以上', emoji: '🌟' },
];

type Step = 'mood' | 'budget' | 'main';

export default function SwipeScreen() {
  const [step, setStep] = useState<Step>('mood');
  const [mood, setMood] = useState<string | null>(null);
  const [budget, setBudget] = useState<string | null>(null);
  const [excluded, setExcluded] = useState<string[]>([]);
  const [quickFilters, setQuickFilters] = useState<string[]>([]);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [swipeIdx, setSwipeIdx] = useState(0);
  const [candidates, setCandidates] = useState<typeof STORES>([]);
  const [resultStore, setResultStore] = useState<typeof STORES[0] | null>(null);
  const [showResult, setShowResult] = useState(false);
  const router = useRouter();

  // Step entrance animations
  const entrance = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    entrance.setValue(0);
    Animated.spring(entrance, { toValue: 1, useNativeDriver: true, friction: 7, tension: 60 }).start();
  }, [step]);

  // Card animations
  const position        = useRef(new Animated.ValueXY()).current;
  const nextCardScale   = useRef(new Animated.Value(0.93)).current;
  const nextCardOpacity = useRef(new Animated.Value(0.7)).current;
  const skipScale       = useRef(new Animated.Value(1)).current;
  const heartScale      = useRef(new Animated.Value(1)).current;
  const bookmarkScale   = useRef(new Animated.Value(1)).current;

  const nopeOpacity  = position.x.interpolate({ inputRange: [-SWIPE_THRESHOLD, 0], outputRange: [1, 0], extrapolate: 'clamp' });
  const likeOpacity  = position.x.interpolate({ inputRange: [0, SWIPE_THRESHOLD], outputRange: [0, 1], extrapolate: 'clamp' });
  const maybeOpacity = position.y.interpolate({ inputRange: [-SWIPE_THRESHOLD, 0], outputRange: [1, 0], extrapolate: 'clamp' });
  const cardRotate   = position.x.interpolate({ inputRange: [-width, 0, width], outputRange: ['-18deg', '0deg', '18deg'] });

  const currentFood = STORES[swipeIdx % STORES.length];
  const nextFood    = STORES[(swipeIdx + 1) % STORES.length];

  const resetCard = () => {
    position.setValue({ x: 0, y: 0 });
    nextCardScale.setValue(0.93);
    nextCardOpacity.setValue(0.7);
  };

  const animateOut = (direction: 'left' | 'right' | 'up', onDone: () => void) => {
    const toX = direction === 'left' ? -width * 1.5 : direction === 'right' ? width * 1.5 : 0;
    const toY = direction === 'up' ? -height : 0;
    Animated.parallel([
      Animated.timing(position, { toValue: { x: toX, y: toY }, duration: 350, useNativeDriver: true }),
      Animated.timing(nextCardScale, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.timing(nextCardOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
    ]).start(() => { onDone(); resetCard(); });
  };

  const panResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, g) => {
      position.setValue({ x: g.dx, y: g.dy });
      const p = Math.min(Math.abs(g.dx) / SWIPE_THRESHOLD, 1);
      nextCardScale.setValue(0.93 + p * 0.07);
      nextCardOpacity.setValue(0.7 + p * 0.3);
    },
    onPanResponderRelease: (_, g) => {
      if (g.dx < -SWIPE_THRESHOLD) {
        animateOut('left', () => setSwipeIdx(p => p + 1));
      } else if (g.dx > SWIPE_THRESHOLD) {
        animateOut('right', () => setSwipeIdx(p => p + 1));
      } else if (g.dy < -SWIPE_THRESHOLD) {
        animateOut('up', () => {
          const food = STORES[swipeIdx % STORES.length];
          setCandidates(prev => prev.find(c => c.id === food.id) ? prev : [...prev, food]);
          setSwipeIdx(p => p + 1);
        });
      } else {
        Animated.spring(position, { toValue: { x: 0, y: 0 }, useNativeDriver: true, friction: 5 }).start();
        Animated.spring(nextCardScale, { toValue: 0.93, useNativeDriver: true }).start();
        Animated.spring(nextCardOpacity, { toValue: 0.7, useNativeDriver: true }).start();
      }
    },
  })).current;

  const pressBtn = (anim: Animated.Value, action: () => void) => {
    Animated.sequence([
      Animated.spring(anim, { toValue: 0.75, useNativeDriver: true, speed: 50 }),
      Animated.spring(anim, { toValue: 1.15, useNativeDriver: true, speed: 30 }),
      Animated.spring(anim, { toValue: 1,    useNativeDriver: true, speed: 20 }),
    ]).start();
    setTimeout(action, 120);
  };

  const handleSkip  = () => pressBtn(skipScale,  () => animateOut('left', () => setSwipeIdx(p => p + 1)));
  const handleLike  = () => pressBtn(heartScale, () => animateOut('right', () => router.push({ pathname: '/detail' as any, params: { id: currentFood.id } })));
  const handleMaybe = () => pressBtn(bookmarkScale, () => {
    animateOut('up', () => {
      setCandidates(prev => prev.find(c => c.id === currentFood.id) ? prev : [...prev, currentFood]);
      setSwipeIdx(p => p + 1);
    });
  });

  const decideForMe = () => {
    const pool = candidates.length > 0 ? candidates : STORES;
    setResultStore(pool[Math.floor(Math.random() * pool.length)]);
    setShowResult(true);
  };

  const entranceStyle = {
    opacity: entrance,
    transform: [{ translateY: entrance.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }],
  };

  // ── STEP 1: 心情 ──
  if (step === 'mood') {
    return (
      <View style={styles.onboardContainer}>
        <Animated.View style={[{ flex: 1 }, entranceStyle]}>
          <Text style={styles.onboardTitle}>今天想吃什麼？</Text>
          <Text style={styles.onboardSub}>先告訴我你現在的狀態 👇</Text>
          <View style={styles.moodGrid}>
            {MOODS.map(m => {
              const isSelected = mood === m.id;
              return (
                <TouchableOpacity
                  key={m.id}
                  style={[styles.moodCard, isSelected && styles.moodCardActive]}
                  onPress={() => setMood(m.id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.moodEmoji}>{m.emoji}</Text>
                  <Text style={[styles.moodLabel, isSelected && styles.moodLabelActive]}>{m.label}</Text>
                  <Text style={[styles.moodSub, isSelected && styles.moodSubActive]}>{m.sub}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <TouchableOpacity
            style={[styles.nextBtn, !mood && styles.nextBtnDisabled]}
            onPress={() => mood && setStep('budget')}
            activeOpacity={mood ? 0.85 : 1}
          >
            <Text style={[styles.nextBtnText, !mood && styles.nextBtnTextDisabled]}>下一步 →</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setStep('budget')} style={styles.skipStep}>
            <Text style={styles.skipStepText}>跳過，直接幫我選</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  // ── STEP 2: 預算 ──
  if (step === 'budget') {
    return (
      <View style={styles.onboardContainer}>
        <Animated.View style={[{ flex: 1 }, entranceStyle]}>
          <TouchableOpacity onPress={() => setStep('mood')} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← 返回</Text>
          </TouchableOpacity>
          <Text style={styles.onboardTitle}>預算大概多少？</Text>
          <Text style={styles.onboardSub}>我幫你篩掉超出範圍的選項 💰</Text>
          <View style={styles.budgetRow}>
            {BUDGETS.map(b => {
              const isSelected = budget === b.id;
              return (
                <TouchableOpacity
                  key={b.id}
                  style={[styles.budgetCard, isSelected && styles.budgetCardActive]}
                  onPress={() => setBudget(b.id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.budgetEmoji}>{b.emoji}</Text>
                  <Text style={[styles.budgetLabel, isSelected && styles.budgetLabelActive]}>{b.label}</Text>
                  <Text style={[styles.budgetSub, isSelected && styles.budgetSubActive]}>{b.sub}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <TouchableOpacity
            style={[styles.nextBtn, !budget && styles.nextBtnDisabled]}
            onPress={() => budget && setStep('main')}
            activeOpacity={budget ? 0.85 : 1}
          >
            <Text style={[styles.nextBtnText, !budget && styles.nextBtnTextDisabled]}>開始選餐 🍽</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setStep('main')} style={styles.skipStep}>
            <Text style={styles.skipStepText}>跳過</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  // ── STEP 3: 主頁面 ──
  const activeFilterCount = excluded.length + quickFilters.length + (mood ? 1 : 0) + (budget ? 1 : 0);

  return (
    <View style={styles.container}>

      {/* Header row */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.headerLabel}>AI 選餐推薦</Text>
          <View style={styles.activeIndicator} />
        </View>
        <ScrollView
          horizontal showsHorizontalScrollIndicator={false}
          style={{ flex: 1, marginHorizontal: 10 }}
          contentContainerStyle={{ gap: 6, alignItems: 'center', paddingRight: 4 }}
        >
          {mood && (
            <View style={styles.activeFilterTag}>
              <Text style={styles.activeFilterText}>{MOODS.find(m => m.id === mood)?.emoji} {MOODS.find(m => m.id === mood)?.label}</Text>
              <TouchableOpacity onPress={() => setMood(null)}><Text style={styles.activeFilterX}>✕</Text></TouchableOpacity>
            </View>
          )}
          {budget && (
            <View style={styles.activeFilterTag}>
              <Text style={styles.activeFilterText}>{BUDGETS.find(b => b.id === budget)?.emoji} {BUDGETS.find(b => b.id === budget)?.label}</Text>
              <TouchableOpacity onPress={() => setBudget(null)}><Text style={styles.activeFilterX}>✕</Text></TouchableOpacity>
            </View>
          )}
          {QUICK_FILTERS.map(f => {
            const on = quickFilters.includes(f.id);
            return (
              <TouchableOpacity
                key={f.id}
                style={[styles.qfTag, on && styles.qfTagActive]}
                onPress={() => setQuickFilters(prev => prev.includes(f.id) ? prev.filter(x => x !== f.id) : [...prev, f.id])}
              >
                <Text style={styles.qfEmoji}>{f.emoji}</Text>
                <Text style={[styles.qfLabel, on && styles.qfLabelActive]}>{f.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <TouchableOpacity style={styles.filterBtn} onPress={() => setShowFilterPanel(true)}>
          <SlidersHorizontal size={17} color="#FF6B6B" />
          {activeFilterCount > 0 && <View style={styles.filterDot} />}
        </TouchableOpacity>
      </View>

      {/* Card Stack */}
      <View style={styles.cardArea}>
        {/* Next card behind */}
        <Animated.View style={[styles.cardWrapper, { transform: [{ scale: nextCardScale }], opacity: nextCardOpacity }]}>
          <Image source={{ uri: nextFood.img }} style={styles.cardImg} />
          <View style={styles.overlay} />
        </Animated.View>

        {/* Current card */}
        <Animated.View
          {...panResponder.panHandlers}
          style={[styles.cardWrapper, { transform: [{ translateX: position.x }, { translateY: position.y }, { rotate: cardRotate }] }]}
        >
          <Image source={{ uri: currentFood.img }} style={styles.cardImg} />
          <View style={styles.overlay}>

            {/* Swipe hints */}
            <Animated.View style={[styles.hintBadge, styles.hintNope, { opacity: nopeOpacity }]}>
              <Text style={styles.hintText}>✕ 不吃</Text>
            </Animated.View>
            <Animated.View style={[styles.hintBadge, styles.hintLike, { opacity: likeOpacity }]}>
              <Text style={styles.hintText}>❤ 就這家</Text>
            </Animated.View>
            <Animated.View style={[styles.hintBadge, styles.hintMaybe, { opacity: maybeOpacity }]}>
              <Text style={styles.hintText}>🔖 也許吧</Text>
            </Animated.View>

            {/* 社交壓力 badge */}
            <View style={styles.socialProof}>
              <Text style={styles.socialProofText}>🔥 今天 {(swipeIdx % 20) + 10} 人也在看</Text>
            </View>

            {/* Card info */}
            <View>
              <View style={styles.tagRow}>
                <View style={[styles.badge, { backgroundColor: '#FF6B6B' }]}>
                  <Text style={styles.badgeText}>{currentFood.cat}</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                  <Text style={styles.badgeText}>{currentFood.dist}</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: currentFood.status === '營業中' ? 'rgba(76,217,100,0.85)' : 'rgba(255,150,0,0.85)' }]}>
                  <Text style={styles.badgeText}>{currentFood.status}</Text>
                </View>
              </View>
              <Text style={styles.foodName}>{currentFood.name}</Text>
              <View style={styles.rateRow}>
                <Star size={15} color="#FFAD0E" fill="#FFAD0E" />
                <Text style={styles.rateValue}>{currentFood.rate}</Text>
                <Text style={styles.priceTag}>{currentFood.price}</Text>
              </View>
              {currentFood.tags && (
                <View style={styles.featureRow}>
                  {currentFood.tags.map((tag: string, i: number) => (
                    <View key={i} style={styles.featureTag}>
                      <Text style={styles.featureTagText}># {tag}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        </Animated.View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonArea}>
        <View style={styles.buttonRow}>
          <View style={styles.btnGroup}>
            <Animated.View style={{ transform: [{ scale: skipScale }] }}>
              <TouchableOpacity style={styles.circleBtn} onPress={handleSkip} activeOpacity={0.8}>
                <X size={28} color="#AAA" />
              </TouchableOpacity>
            </Animated.View>
            <Text style={styles.btnLabel}>不吃這個</Text>
          </View>

          <View style={styles.btnGroup}>
            <Animated.View style={{ transform: [{ scale: heartScale }] }}>
              <TouchableOpacity style={styles.heartBtn} onPress={handleLike} activeOpacity={0.8}>
                <Heart size={36} color="#fff" fill="#fff" />
              </TouchableOpacity>
            </Animated.View>
            <Text style={styles.btnLabel}>就這家！</Text>
          </View>

          <View style={styles.btnGroup}>
            <Animated.View style={{ transform: [{ scale: bookmarkScale }] }}>
              <TouchableOpacity style={styles.circleBtn} onPress={handleMaybe} activeOpacity={0.8}>
                <BookmarkPlus size={26} color="#FF6B6B" />
              </TouchableOpacity>
            </Animated.View>
            <Text style={styles.btnLabel}>也許吧</Text>
          </View>
        </View>

        {candidates.length > 0 && (
          <TouchableOpacity style={styles.decideBtn} onPress={decideForMe}>
            <Shuffle size={16} color="#fff" />
            <Text style={styles.decideBtnText}>幫我從 {candidates.length} 家候選中決定！</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── 篩選 Panel Modal ── */}
      <Modal visible={showFilterPanel} transparent animationType="slide">
        <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowFilterPanel(false)} />
        <View style={styles.filterPanel}>
          <View style={styles.filterHandle} />
          <Text style={styles.filterPanelTitle}>篩選條件</Text>

          <Text style={styles.filterSectionLabel}>今天不想吃⋯⋯</Text>
          <View style={styles.filterTagWrap}>
            {EXCLUDE_OPTIONS.map(opt => {
              const isEx = excluded.includes(opt.id);
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[styles.excludeTag, isEx && styles.excludeTagActive]}
                  onPress={() => setExcluded(prev => prev.includes(opt.id) ? prev.filter(e => e !== opt.id) : [...prev, opt.id])}
                >
                  <Text style={styles.excludeEmoji}>{opt.emoji}</Text>
                  <Text style={[styles.excludeLabel, isEx && styles.excludeLabelActive]}>{opt.label}</Text>
                  {isEx && <Text style={styles.excludeX}>✕</Text>}
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.filterSectionLabel}>今日心情</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 20 }}>
            {MOODS.map(m => (
              <TouchableOpacity
                key={m.id}
                style={[styles.moodChip, mood === m.id && styles.moodChipActive]}
                onPress={() => setMood(prev => prev === m.id ? null : m.id)}
              >
                <Text style={{ fontWeight: '700', color: mood === m.id ? '#FF6B6B' : '#666' }}>{m.emoji} {m.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.filterSectionLabel}>預算</Text>
          <View style={styles.budgetRowSmall}>
            {BUDGETS.map(b => (
              <TouchableOpacity
                key={b.id}
                style={[styles.budgetChip, budget === b.id && styles.budgetChipActive]}
                onPress={() => setBudget(prev => prev === b.id ? null : b.id)}
              >
                <Text style={[styles.budgetChipText, budget === b.id && styles.budgetChipTextActive]}>{b.emoji} {b.label}</Text>
                <Text style={[styles.budgetChipSub, budget === b.id && { color: '#FF6B6B' }]}>{b.sub}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.filterConfirmBtn} onPress={() => setShowFilterPanel(false)}>
            <Text style={styles.filterConfirmText}>套用篩選</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* ── Result Modal ── */}
      <Modal visible={showResult} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalEmoji}>🎉</Text>
            <Text style={styles.modalTitle}>今天就吃這家！</Text>
            {resultStore && (
              <>
                <Image source={{ uri: resultStore.img }} style={styles.modalImg} />
                <Text style={styles.modalName}>{resultStore.name}</Text>
                <Text style={styles.modalSub}>{resultStore.cat} · {resultStore.dist} · {resultStore.price}</Text>
                <TouchableOpacity style={styles.modalBtn} onPress={() => { setShowResult(false); router.push({ pathname: '/detail' as any, params: { id: resultStore.id } }); }}>
                  <Text style={styles.modalBtnText}>查看詳細</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowResult(false)}>
                  <Text style={styles.modalCancel}>再想想</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  // ── Onboarding ──
  onboardContainer: { flex: 1, backgroundColor: '#F8F9FB', paddingTop: 70, paddingHorizontal: 24 },
  onboardTitle: { fontSize: 28, fontWeight: '900', color: '#1A1A2E', marginBottom: 6 },
  onboardSub:   { fontSize: 14, color: '#999', marginBottom: 28 },
  backBtn:      { marginBottom: 16 },
  backBtnText:  { fontSize: 14, color: '#AAA', fontWeight: '600' },

  moodGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 28 },
  moodCard: {
    width: (width - 72) / 2, backgroundColor: '#fff',
    borderRadius: 22, padding: 18, alignItems: 'center',
    borderWidth: 2, borderColor: '#F0F0F0',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  moodCardActive:  { borderColor: '#FF6B6B', backgroundColor: '#FFF5F5' },
  moodEmoji:       { fontSize: 34, marginBottom: 8 },
  moodLabel:       { fontSize: 16, fontWeight: '900', color: '#333', marginBottom: 3 },
  moodLabelActive: { color: '#FF6B6B' },
  moodSub:         { fontSize: 11, color: '#BBB', fontWeight: '600' },
  moodSubActive:   { color: '#FF9999' },

  budgetRow: { flexDirection: 'row', gap: 10, marginBottom: 28 },
  budgetCard: {
    flex: 1, backgroundColor: '#fff', borderRadius: 22, padding: 18,
    alignItems: 'center', borderWidth: 2, borderColor: '#F0F0F0',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  budgetCardActive:  { borderColor: '#FF6B6B', backgroundColor: '#FFF5F5' },
  budgetEmoji:       { fontSize: 28, marginBottom: 8 },
  budgetLabel:       { fontSize: 14, fontWeight: '900', color: '#333', marginBottom: 3 },
  budgetLabelActive: { color: '#FF6B6B' },
  budgetSub:         { fontSize: 10, color: '#BBB', fontWeight: '600' },
  budgetSubActive:   { color: '#FF9999' },

  nextBtn:             { backgroundColor: '#FF6B6B', borderRadius: 28, paddingVertical: 15, alignItems: 'center', marginBottom: 14 },
  nextBtnDisabled:     { backgroundColor: '#EBEBEB' },
  nextBtnText:         { color: '#fff', fontWeight: '900', fontSize: 16 },
  nextBtnTextDisabled: { color: '#CCC' },
  skipStep:            { alignItems: 'center', paddingVertical: 6 },
  skipStepText:        { color: '#CCC', fontSize: 13, fontWeight: '600' },

  // ── Main ──
  container: { flex: 1, backgroundColor: '#F8F9FB', paddingTop: 56, paddingHorizontal: 20 },

  topBar:          { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  headerLabel:     { fontSize: 13, fontWeight: '900', letterSpacing: 2, color: '#333' },
  activeIndicator: { height: 3, width: 18, backgroundColor: '#FF6B6B', marginTop: 3, borderRadius: 2 },
  filterBtn:       { backgroundColor: '#fff', padding: 9, borderRadius: 12, elevation: 3, shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 6 },
  filterDot:       { position: 'absolute', top: 5, right: 5, width: 7, height: 7, borderRadius: 4, backgroundColor: '#FF6B6B' },

  activeFilterTag:  { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FF6B6B', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 14 },
  activeFilterText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  activeFilterX:    { color: 'rgba(255,255,255,0.8)', fontSize: 10, fontWeight: '900' },
  qfTag:            { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 14, backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#E8E8E8' },
  qfTagActive:      { backgroundColor: '#FFF0F0', borderColor: '#FF6B6B' },
  qfEmoji:          { fontSize: 12 },
  qfLabel:          { fontSize: 11, fontWeight: '600', color: '#888' },
  qfLabelActive:    { color: '#FF6B6B' },

  // Cards
  cardArea:    { flex: 1, position: 'relative', marginHorizontal: -5 },
  cardWrapper: {
    ...StyleSheet.absoluteFillObject, borderRadius: 36, overflow: 'hidden', backgroundColor: '#000',
    elevation: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.25, shadowRadius: 20,
  },
  cardImg: { ...StyleSheet.absoluteFillObject, opacity: 0.82 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'flex-end', padding: 24 },

  hintBadge: { position: 'absolute', top: 36, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 14, borderWidth: 2.5 },
  hintNope:  { left: 20, borderColor: '#FF4444', backgroundColor: 'rgba(255,50,50,0.15)' },
  hintLike:  { right: 20, borderColor: '#4CD964', backgroundColor: 'rgba(76,217,100,0.15)' },
  hintMaybe: { alignSelf: 'center', left: width * 0.25, borderColor: '#FFAD0E', backgroundColor: 'rgba(255,173,14,0.15)' },
  hintText:  { color: '#fff', fontWeight: '900', fontSize: 15, letterSpacing: 1 },

  socialProof:     { position: 'absolute', top: 18, right: 18, backgroundColor: 'rgba(0,0,0,0.45)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16 },
  socialProofText: { color: '#fff', fontSize: 11, fontWeight: '700' },

  tagRow:         { flexDirection: 'row', gap: 6, marginBottom: 10, flexWrap: 'wrap' },
  badge:          { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 14 },
  badgeText:      { color: '#fff', fontSize: 10, fontWeight: '900' },
  foodName:       { color: '#fff', fontSize: 30, fontWeight: '900', marginBottom: 6, lineHeight: 36 },
  rateRow:        { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  rateValue:      { color: '#fff', fontWeight: '900', fontSize: 15 },
  priceTag:       { color: 'rgba(255,255,255,0.8)', fontWeight: '700', fontSize: 13 },
  featureRow:     { flexDirection: 'row', gap: 6 },
  featureTag:     { backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  featureTagText: { color: '#fff', fontSize: 10, fontWeight: '700' },

  // Buttons
  buttonArea:    { paddingTop: 20, paddingBottom: TAB_BAR_OFFSET },
  buttonRow:     { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 28 },
  btnGroup:      { alignItems: 'center', gap: 7 },
  btnLabel:      { fontSize: 11, fontWeight: '700', color: '#BBB' },
  circleBtn:     { width: 62, height: 62, borderRadius: 31, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8 },
  heartBtn:      { width: 76, height: 76, borderRadius: 38, backgroundColor: '#FF6B6B', justifyContent: 'center', alignItems: 'center', elevation: 10, shadowColor: '#FF6B6B', shadowOpacity: 0.45, shadowRadius: 12 },
  decideBtn:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 14, backgroundColor: '#1A1A2E', paddingVertical: 13, borderRadius: 28, marginHorizontal: 10 },
  decideBtnText: { color: '#fff', fontWeight: '800', fontSize: 13 },

  // Filter panel
  filterPanel:        { backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 26, paddingBottom: 44 },
  filterHandle:       { width: 36, height: 4, borderRadius: 2, backgroundColor: '#E0E0E0', alignSelf: 'center', marginBottom: 18 },
  filterPanelTitle:   { fontSize: 18, fontWeight: '900', color: '#1A1A2E', marginBottom: 18 },
  filterSectionLabel: { fontSize: 11, fontWeight: '700', color: '#BBB', letterSpacing: 1, marginBottom: 10, textTransform: 'uppercase' },
  filterTagWrap:      { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  excludeTag:         { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 11, paddingVertical: 6, borderRadius: 16, backgroundColor: '#F8F9FB', borderWidth: 1.5, borderColor: '#E8E8E8' },
  excludeTagActive:   { backgroundColor: '#FFF0F0', borderColor: '#FF6B6B' },
  excludeEmoji:       { fontSize: 13 },
  excludeLabel:       { fontSize: 12, fontWeight: '600', color: '#888' },
  excludeLabelActive: { color: '#FF6B6B', textDecorationLine: 'line-through' },
  excludeX:           { fontSize: 10, color: '#FF6B6B', fontWeight: '900' },
  moodChip:           { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18, backgroundColor: '#F8F9FB', borderWidth: 1.5, borderColor: '#E8E8E8' },
  moodChipActive:     { backgroundColor: '#FFF0F0', borderColor: '#FF6B6B' },
  budgetRowSmall:     { flexDirection: 'row', gap: 10, marginBottom: 24 },
  budgetChip:         { flex: 1, backgroundColor: '#F8F9FB', borderRadius: 16, padding: 12, alignItems: 'center', borderWidth: 1.5, borderColor: '#E8E8E8' },
  budgetChipActive:   { backgroundColor: '#FFF0F0', borderColor: '#FF6B6B' },
  budgetChipText:     { fontSize: 13, fontWeight: '800', color: '#333', marginBottom: 2 },
  budgetChipTextActive: { color: '#FF6B6B' },
  budgetChipSub:      { fontSize: 10, color: '#AAA', fontWeight: '600' },
  filterConfirmBtn:   { backgroundColor: '#FF6B6B', borderRadius: 26, paddingVertical: 14, alignItems: 'center' },
  filterConfirmText:  { color: '#fff', fontWeight: '900', fontSize: 15 },

  // Result modal
  modalBg:     { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalCard:   { backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 28, alignItems: 'center' },
  modalEmoji:  { fontSize: 40, marginBottom: 8 },
  modalTitle:  { fontSize: 22, fontWeight: '900', color: '#1A1A2E', marginBottom: 16 },
  modalImg:    { width: '100%', height: 180, borderRadius: 20, marginBottom: 16 },
  modalName:   { fontSize: 20, fontWeight: '900', color: '#1A1A2E', marginBottom: 6 },
  modalSub:    { fontSize: 13, color: '#999', marginBottom: 20 },
  modalBtn:    { backgroundColor: '#FF6B6B', paddingHorizontal: 40, paddingVertical: 14, borderRadius: 25, marginBottom: 12, width: '100%', alignItems: 'center' },
  modalBtnText: { color: '#fff', fontWeight: '900', fontSize: 15 },
  modalCancel:  { fontSize: 13, color: '#CCC', fontWeight: '600', paddingBottom: 20 },
});