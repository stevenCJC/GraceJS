define(['dataset/dataset'], function(Dataset) {
	window.dataset=window.dataset||new Dataset();
	return window.dataset;
});
