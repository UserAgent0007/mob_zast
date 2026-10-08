import 'package:flutter/foundation.dart';

import '../utils/format.dart';

class ConverterController extends ChangeNotifier {
  String from = 'UAH';
  String to = 'USD';
  String amount = '1000';

  void setAmount(String value) {
    amount = value;
    notifyListeners();
  }

  void setFrom(String next) {
    if (next == to) {
      to = from;
    }
    from = next;
    notifyListeners();
  }

  void setTo(String next) {
    if (next == from) {
      from = to;
    }
    to = next;
    notifyListeners();
  }

  void setPair({required String from, required String to, Object? amount}) {
    this.from = from;
    this.to = to;
    if (amount != null) {
      this.amount = amountToInput(amount);
    }
    notifyListeners();
  }

  void swap() {
    final previousFrom = from;
    from = to;
    to = previousFrom;
    notifyListeners();
  }
}
