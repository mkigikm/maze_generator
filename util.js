function shuffle(array) {
  for (var i = array.length -1; i > 0; i--) {
    var j = ~~(Math.random() * (i + 1));

    var temp = array[j];
    array[j] = array[i];
    array[i] = array[j];
  }

  return array;
}

function SamplingSet () {
  this.set = new Set();
}

SamplingSet.prototype.add = function (value) {
  this.set.add(value);
};

SamplingSet.prototype.delete = function (value) {
  this.set.delete(value);
};

SamplingSet.prototype.sample = function () {
  if (this.size() === 0)
    return null;

  var i = ~~(Math.random() * this.size());

  for (var item of this.set) {
    if (i == 0) {
      this.delete(item);
      return item;
    }

    i--;
  }
};

SamplingSet.prototype.size = function () {
  return this.set.size;
};
