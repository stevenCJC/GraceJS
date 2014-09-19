define([], function () {
	function unique(arr) {
		for (var i = 0,len=arr.length; i < len; i++) {
			if (arr.indexOf(arr[i]) != i) {
				arr.splice(i, 1);
				i--;
			}
		}
		return arr;
	}
	return unique;
});