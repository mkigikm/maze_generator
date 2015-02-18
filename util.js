function shuffle(array) {
  for (var i = array.length -1; i > 0; i--) {
    var j = ~~(Math.random() * (i + 1));

    var temp = array[j];
    array[j] = array[i];
    array[i] = temp;
  }

  return array;
}
