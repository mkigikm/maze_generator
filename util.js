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
  this.hash_index = [];
  this.index_hash = [];
}

SamplingSet.prototype.push = function (value) {
  this.index_hash.push(value);
  this.hash_index[value] = this.index_hash.length - 1;
};

SamplingSet.prototype.remove = function (value) {
  var i = this.hash_index[value];
  this.my_remove(i, value);
};

SamplingSet.prototype.my_remove = function(i, value) {
  this.hash_index[value] = null;
  this.index_hash.splice(i, 1);
}

SamplingSet.prototype.sample = function () {
  if (this.length() === 0)
    return null;

  var i = ~~(Math.random() * this.length());

  var value = this.index_hash[i];
  this.my_remove(i, value);

  return value;
};

SamplingSet.prototype.length = function () {
  return this.index_hash.length;
};
