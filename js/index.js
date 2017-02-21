$(function(){
	        var $avatarEl = $('.avatar');
	        var $avatarHolderEl = $('.avatar-holder');
	        var avatars = [];
	        $avatarEl.each(function(){
	            var $avatar = $(this);
	            var avatarImage = $avatar.find('img').first().attr('src');
	            avatars.push(avatarImage);
	        });
	        $avatarHolderEl.backgroundBlur({
	            imageURL : avatars[0],
	            blurAmount : 50, 
	            imageClass : 'avatar-blur' 
	        });
});