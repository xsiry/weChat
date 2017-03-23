define(function(require) {
	var module = require('./module');
	module.init();

	// 清理 缓存
  var url = require.resolve('./main')
  delete seajs.cache[url]
  delete seajs.data.fetchedList[url]

  var url = require.resolve('./module')
  delete seajs.cache[url]
  delete seajs.data.fetchedList[url]
})