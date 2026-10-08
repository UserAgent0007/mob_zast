class HistoryEntry {
  const HistoryEntry({
    required this.id,
    required this.from,
    required this.to,
    required this.amount,
    required this.result,
    required this.rate,
    required this.amountLabel,
    required this.resultLabel,
    required this.rateLabel,
    required this.createdAt,
    required this.createdAtLabel,
  });

  final String id;
  final String from;
  final String to;
  final double amount;
  final double result;
  final double rate;
  final String amountLabel;
  final String resultLabel;
  final String rateLabel;
  final String createdAt;
  final String createdAtLabel;
}
