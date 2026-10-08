import React, { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { vibrate } from './utils';

const DEFAULT_WORK_MINUTES = 25;
const DEFAULT_BREAK_MINUTES = 5;
const MIN_MINUTES = 1;
const MAX_MINUTES = 180;
const HOLD_AT_ZERO_MS = 800;

const COLORS = {
  background: '#10141C',
  card: '#171C28',
  text: '#F4F6FB',
  muted: '#9AA3B5',
  dim: '#6E788C',
  track: '#2A3142',
  work: '#FF6B4A',
  break: '#3DDC97',
};

function formatTime(totalSeconds) {
  const safe = Math.max(0, totalSeconds);
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  const pad = (value) => String(value).padStart(2, '0');
  return `${pad(minutes)}:${pad(seconds)}`;
}

function parseMinutes(value) {
  const parsed = Number.parseInt(String(value).trim(), 10);
  if (!Number.isInteger(parsed) || parsed < MIN_MINUTES || parsed > MAX_MINUTES) {
    return null;
  }
  return parsed;
}

function ActionButton({
  label,
  onPress,
  color,
  disabled = false,
  backgroundColor = 'transparent',
  bordered = false,
}) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        { backgroundColor },
        bordered && styles.bordered,
        disabled && styles.disabled,
      ]}
    >
      <Text style={[styles.buttonText, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
}

ActionButton.propTypes = {
  label: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  backgroundColor: PropTypes.string,
  bordered: PropTypes.bool,
};

function TimerFace({ label, time, status, accent }) {
  return (
    <View style={[styles.ring, { borderColor: accent }]}>
      <Text style={[styles.mode, { color: accent }]}>{label}</Text>
      <Text style={styles.time} adjustsFontSizeToFit numberOfLines={1}>
        {time}
      </Text>
      <Text style={styles.status}>{status}</Text>
    </View>
  );
}

TimerFace.propTypes = {
  label: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  accent: PropTypes.string.isRequired,
};

export default function App() {
  const [mode, setMode] = useState('work');
  const [workMinutes, setWorkMinutes] = useState(DEFAULT_WORK_MINUTES);
  const [breakMinutes, setBreakMinutes] = useState(DEFAULT_BREAK_MINUTES);
  const [workInput, setWorkInput] = useState(String(DEFAULT_WORK_MINUTES));
  const [breakInput, setBreakInput] = useState(String(DEFAULT_BREAK_MINUTES));
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_WORK_MINUTES * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [error, setError] = useState('');

  const endAtRef = useRef(null);
  const switchTimeoutRef = useRef(null);
  const modeRef = useRef(mode);
  const workRef = useRef(workMinutes);
  const breakRef = useRef(breakMinutes);

  modeRef.current = mode;
  workRef.current = workMinutes;
  breakRef.current = breakMinutes;

  const accent = mode === 'work' ? COLORS.work : COLORS.break;
  const modeLabel = mode === 'work' ? 'Робота' : 'Перерва';
  const totalSeconds = (mode === 'work' ? workMinutes : breakMinutes) * 60;
  const progress = totalSeconds > 0 ? Math.min(1, Math.max(0, secondsLeft / totalSeconds)) : 0;
  const nextModeLabel = mode === 'work' ? 'перерва' : 'робота';
  const nextSeconds = (mode === 'work' ? breakMinutes : workMinutes) * 60;

  useEffect(() => {
    return () => {
      if (switchTimeoutRef.current) {
        clearTimeout(switchTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isRunning) {
      return undefined;
    }

    const id = setInterval(() => {
      if (switchTimeoutRef.current) {
        return;
      }

      const remaining = Math.max(0, Math.ceil((endAtRef.current - Date.now()) / 1000));
      if (remaining > 0) {
        setSecondsLeft((current) => (current === remaining ? current : remaining));
        return;
      }

      setSecondsLeft(0);
      vibrate();
      if (modeRef.current === 'work') {
        setCompleted((count) => count + 1);
      }

      switchTimeoutRef.current = setTimeout(() => {
        switchTimeoutRef.current = null;
        const nextMode = modeRef.current === 'work' ? 'break' : 'work';
        const nextMinutes = nextMode === 'work' ? workRef.current : breakRef.current;
        const duration = nextMinutes * 60;
        modeRef.current = nextMode;
        endAtRef.current = Date.now() + duration * 1000;
        setMode(nextMode);
        setSecondsLeft(duration);
      }, HOLD_AT_ZERO_MS);
    }, 250);

    return () => clearInterval(id);
  }, [isRunning]);

  const clearPendingSwitch = () => {
    if (switchTimeoutRef.current) {
      clearTimeout(switchTimeoutRef.current);
      switchTimeoutRef.current = null;
    }
  };

  const handleStart = () => {
    if (isRunning) {
      return;
    }

    clearPendingSwitch();

    if (secondsLeft <= 0) {
      const nextMode = mode === 'work' ? 'break' : 'work';
      const nextMinutes = nextMode === 'work' ? workMinutes : breakMinutes;
      const duration = nextMinutes * 60;
      modeRef.current = nextMode;
      setMode(nextMode);
      setSecondsLeft(duration);
      endAtRef.current = Date.now() + duration * 1000;
      setIsRunning(true);
      return;
    }

    endAtRef.current = Date.now() + secondsLeft * 1000;
    setIsRunning(true);
  };

  const handleStop = () => {
    clearPendingSwitch();
    setIsRunning(false);
  };

  const handleReset = () => {
    clearPendingSwitch();
    setIsRunning(false);
    const duration = (modeRef.current === 'work' ? workRef.current : breakRef.current) * 60;
    setSecondsLeft(duration);
  };

  const handleApply = () => {
    const nextWork = parseMinutes(workInput);
    const nextBreak = parseMinutes(breakInput);
    if (nextWork === null || nextBreak === null) {
      setError(`Введіть цілі хвилини від ${MIN_MINUTES} до ${MAX_MINUTES}.`);
      return;
    }

    setError('');
    setWorkMinutes(nextWork);
    setBreakMinutes(nextBreak);
    workRef.current = nextWork;
    breakRef.current = nextBreak;

    if (!isRunning) {
      const duration = (mode === 'work' ? nextWork : nextBreak) * 60;
      setSecondsLeft(duration);
    }
  };

  const statusText = secondsLeft === 0 ? 'Час вийшов' : isRunning ? 'Йде відлік' : 'Пауза';

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.container,
            Platform.OS === 'android' && { paddingTop: (StatusBar.currentHeight || 0) + 16 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Помодоро</Text>
            <Text style={styles.subtitle}>Завершено сесій: {completed}</Text>
          </View>

          <View style={styles.ringWrap}>
            <TimerFace
              label={modeLabel}
              time={formatTime(secondsLeft)}
              status={statusText}
              accent={accent}
            />
          </View>

          <View style={styles.track}>
            <View style={[styles.fill, { width: `${progress * 100}%`, backgroundColor: accent }]} />
          </View>
          <Text style={styles.next}>
            Далі {nextModeLabel} · {formatTime(nextSeconds)}
          </Text>

          <View style={styles.row}>
            <ActionButton
              label="Старт"
              onPress={handleStart}
              disabled={isRunning}
              backgroundColor={accent}
              color={COLORS.background}
            />
            <ActionButton
              label="Стоп"
              onPress={handleStop}
              disabled={!isRunning}
              backgroundColor={COLORS.track}
              color={COLORS.text}
            />
            <ActionButton
              label="Скинути"
              onPress={handleReset}
              bordered
              color={COLORS.text}
            />
          </View>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Перевірити вібрацію"
            onPress={vibrate}
            style={styles.signal}
          >
            <Text style={styles.signalText}>Перевірити вібрацію</Text>
          </TouchableOpacity>

          <View style={styles.settings}>
            <Text style={styles.settingsTitle}>Тривалість</Text>
            <View style={styles.fieldRow}>
              <View style={styles.field}>
                <Text style={styles.label}>Робота, хв</Text>
                <TextInput
                  value={workInput}
                  onChangeText={setWorkInput}
                  keyboardType="number-pad"
                  maxLength={3}
                  style={styles.input}
                  placeholder="25"
                  placeholderTextColor={COLORS.dim}
                  accessibilityLabel="Хвилини роботи"
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Перерва, хв</Text>
                <TextInput
                  value={breakInput}
                  onChangeText={setBreakInput}
                  keyboardType="number-pad"
                  maxLength={3}
                  style={styles.input}
                  placeholder="5"
                  placeholderTextColor={COLORS.dim}
                  accessibilityLabel="Хвилини перерви"
                />
              </View>
            </View>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Застосувати тривалість"
              onPress={handleApply}
              style={styles.apply}
            >
              <Text style={styles.applyText}>Застосувати</Text>
            </TouchableOpacity>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Text style={styles.note}>
              За замовчуванням 25 хвилин роботи та 5 хвилин перерви. Новий час змінює поточний таймер на паузі, а під час відліку починає діяти з наступного циклу.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flex: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 28,
  },
  title: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: '700',
  },
  subtitle: {
    color: COLORS.muted,
    marginTop: 6,
    fontSize: 15,
  },
  ringWrap: {
    alignItems: 'center',
  },
  ring: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: 16,
  },
  mode: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  time: {
    color: COLORS.text,
    fontSize: 68,
    fontWeight: '300',
    fontVariant: ['tabular-nums'],
    marginVertical: 6,
    width: '100%',
    textAlign: 'center',
  },
  status: {
    color: COLORS.muted,
    fontSize: 14,
  },
  track: {
    marginTop: 28,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.track,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
  next: {
    color: COLORS.muted,
    textAlign: 'center',
    marginTop: 12,
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 22,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bordered: {
    borderWidth: 1,
    borderColor: '#3A4256',
  },
  disabled: {
    opacity: 0.4,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
  },
  settings: {
    marginTop: 28,
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 16,
  },
  settingsTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  fieldRow: {
    flexDirection: 'row',
    gap: 12,
  },
  field: {
    flex: 1,
  },
  label: {
    color: COLORS.muted,
    fontSize: 13,
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.background,
    color: COLORS.text,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
    fontSize: 18,
  },
  apply: {
    marginTop: 14,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.track,
  },
  applyText: {
    color: COLORS.text,
    fontWeight: '700',
    fontSize: 15,
  },
  error: {
    color: COLORS.work,
    marginTop: 10,
    fontSize: 13,
  },
  note: {
    color: COLORS.dim,
    marginTop: 10,
    fontSize: 12,
    lineHeight: 17,
  },
  signal: {
    marginTop: 14,
    alignItems: 'center',
    paddingVertical: 8,
  },
  signalText: {
    color: COLORS.muted,
    fontSize: 14,
    fontWeight: '600',
  },
});
