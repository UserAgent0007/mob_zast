import 'package:flutter/foundation.dart';

class ShellController extends ChangeNotifier {
  static const converter = 0;
  static const rates = 1;
  static const history = 2;
  static const settings = 3;

  int index = converter;

  void goTo(int next) {
    if (next == index) {
      return;
    }
    index = next;
    notifyListeners();
  }
}
