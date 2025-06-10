function datesChevauchent(date1Debut, date1Fin, date2Debut, date2Fin) {
  return date1Debut <= date2Fin && date1Fin >= date2Debut;
}
