import 'package:flutter/foundation.dart';

import '../data/currencies.dart';

class SettingsController extends ChangeNotifier {
  int decimals = 2;
  String displayBase = 'UAH';
  List<String> favorites = List<String>.of(defaultFavorites);

  void setDecimals(int value) {
    decimals = value;
    notifyListeners();
  }

  void setDisplayBase(String code) {
    displayBase = code;
    notifyListeners();
  }

  void toggleFavorite(String code) {
    if (favorites.contains(code)) {
      if (favorites.length > 1) {
        favorites = favorites.where((item) => item != code).toList();
        notifyListeners();
      }
      return;
    }
    favorites = [...favorites, code];
    notifyListeners();
  }
}
