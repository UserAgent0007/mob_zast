import 'package:flutter/foundation.dart';

import '../models/history_entry.dart';

class HistoryController extends ChangeNotifier {
  final List<HistoryEntry> _items = [];

  List<HistoryEntry> get items => List.unmodifiable(_items);

  void add(HistoryEntry entry) {
    _items.insert(0, entry);
    if (_items.length > 40) {
      _items.removeRange(40, _items.length);
    }
    notifyListeners();
  }

  void remove(String id) {
    _items.removeWhere((item) => item.id == id);
    notifyListeners();
  }

  void clear() {
    _items.clear();
    notifyListeners();
  }
}
