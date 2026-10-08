import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import EmptyState from '../components/EmptyState';
import Screen from '../components/Screen';
import HistoryCard from '../components/HistoryCard';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import { setPair } from '../store/converterSlice';
import { clearHistory, removeHistoryItem } from '../store/historySlice';
import { colors, spacing } from '../theme';

export default function HistoryScreen({ navigation }) {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.history.items);

  const restore = (item) => {
    dispatch(
      setPair({
        from: item.from,
        to: item.to,
        amount: item.amount,
      })
    );
    navigation.navigate('Converter');
  };

  return (
    <Screen>
      <View style={styles.toolbar}>
        <ScreenHeader
          kicker="Архів"
          title="Історія"
          subtitle={items.length ? `${items.length} збережених конвертацій` : 'Поки що порожньо'}
        />
        {items.length > 0 ? (
          <PrimaryButton
            label="Очистити історію"
            variant="danger"
            onPress={() => dispatch(clearHistory())}
          />
        ) : null}
      </View>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.gap} />}
        renderItem={({ item }) => (
          <HistoryCard
            item={item}
            onPress={() => restore(item)}
            onRemove={() => dispatch(removeHistoryItem(item.id))}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="time-outline"
            title="Історія ще порожня"
            body="Зробіть конвертацію й натисніть «Зберегти в історію»."
          />
        }
      />
    </Screen>
  );
}

HistoryScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  toolbar: {
    paddingHorizontal: spacing.screen,
    paddingTop: 8,
    gap: 8,
  },
  list: {
    flexGrow: 1,
    padding: spacing.screen,
    paddingTop: 12,
  },
  gap: {
    height: 10,
  },
});
