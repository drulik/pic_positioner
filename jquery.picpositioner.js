(function($, window, document, undefined){
    var methods = {
        checkRow: function(rowOfImages, $container) {
            var sideWidths = [];
            var sideHeights = [];
            var sideRatios = [];
            var totalWidth = 0;
            var containerWidth = $container.width();
            var minHeight = 10000;
            var sizeRatio;
            
            rowOfImages.each(function(i){
                var current = $(this);
                current.css({float: 'left'});
                var currentWidth = current.width();
                var currentHeight = current.height();
                var currentRatio = currentWidth / currentHeight;
                sideWidths[i] = currentWidth;
                sideHeights[i] = currentHeight;
                sideRatios[i] = currentRatio;
                minHeight = Math.min(minHeight, currentHeight);
            });
            
            for (var j = 0; j < rowOfImages.length; j++) {
                sideHeights[j] = minHeight;
                sideWidths[j] = minHeight * sideRatios[j];
                totalWidth += sideWidths[j];                
            }
            
            sizeRatio = containerWidth / totalWidth;
            
            for (var k = 0; k < rowOfImages.length; k++) {
                sideHeights[k] = minHeight * sizeRatio;
                sideWidths[k] = sideWidths[k] * sizeRatio;
                rowOfImages.eq(k).width(sideWidths[k]).height(sideHeights[k]);
            };
        },
    };
    
    jQuery.fn.picpositioner = function(options){
        options = $.extend({
            bigFirst: true,
            singleFirst: false,
            firstRow: 3,
            margin: 1,
            upscale: true
        }, options);
        
        this.each(function(){
            var currentBlock = $(this);
            var imgQty = currentBlock.find('img').length;
            
            if (imgQty == 1 && options.upscale == true) {
                currentBlock.find('img').css({
                    maxWidth: '100%',
                    width: '100%'
                });
            } else {
                methods.checkRow(currentBlock.find('img'), currentBlock);
            }
            
            if (options.firstRow == imgQty) {
                
            }
            console.log(currentBlock);
        });


        console.log(options.margin);
        return this;
    };
})(jQuery);




///

var checkImagesInRow = function(set){
	$(set).find('img').each(function(){
		$(this).removeAttr('style');
	});
	var imagesW = [];
	var imagesH = [];
	var imagesR = [];
	var minHeight = 2000;
	var qty;
	var totalW = 0;
	var conainerW = set.width();
	set.css('width', conainerW);
	set.width(conainerW);
	var totalWidthIndex;

	set.find('img').each(function(i){
		var $currentImage = $(this);
		imagesW[i] = $currentImage.width();
		imagesH[i] = $currentImage.height();
		imagesR[i] = imagesW[i] / imagesH[i];

		if(imagesH[i] < minHeight) {
			minHeight = imagesH[i];
		}
	});

	qty = imagesR.length;

	for (var i=0; i < qty; i++) {
		imagesH[i] = minHeight;
		imagesW[i] = imagesH[i] * imagesR[i];
		totalW += imagesW[i];
	}

	totalWidthIndex =  conainerW / totalW;

	for (var i=0; i < qty; i++) {
		imagesW[i] *= totalWidthIndex;
		imagesH[i] *= totalWidthIndex;
		set.find('img').eq(i).width(imagesW[i]).height(imagesH[i]);
	}
}

var checkImagesInCol = function(set, main){
	$(set).find('img').each(function(){
		$(this).removeAttr('style');
	});
	$(main).removeAttr('style');

	var mainIndex = main.width() / main.height();

	var imagesW = [];
	var imagesH = [];
	var imagesR = [];
	var minWidth = 2000;
	var qty;
	var totalH = 0;
	var conainerH = main.height();
	var totalHeightIndex;
	var blockWidth;
	var containerWidth = main.parents('.imageset').width();
	var mainHeight = 0;

	$(set).each(function(i){
		var $currentImage = $(this);
		imagesW[i] = $currentImage.width();
		imagesH[i] = $currentImage.height();
		imagesR[i] = imagesW[i] / imagesH[i];

		if(imagesW[i] < minWidth) {
			minWidth = imagesW[i];
		}
	});

	qty = imagesR.length;

	for (var i=0; i < qty; i++) {
		imagesW[i] = minWidth;
		imagesH[i] = minWidth / imagesR[i];
		totalH += imagesH[i];
	}

	totalHeightIndex =  conainerH / totalH;

	for (var i=0; i < qty; i++) {
		imagesW[i] *= totalHeightIndex;
		imagesH[i] *= totalHeightIndex;
		set.eq(i).width(imagesW[i]).height(imagesH[i]);
	}

	minWidth *= totalHeightIndex;
	blockWidth = main.width() + minWidth;
	globalIndex = containerWidth / blockWidth;

	for (var i=0; i < qty; i++) {
		imagesW[i] *= globalIndex;
		imagesH[i] *= globalIndex;
		set.eq(i).width(imagesW[i]).height(imagesH[i]);
		mainHeight += imagesH[i];
	}

	main.width(main.width() * globalIndex - 1);
	main.height(mainHeight);

}

var getBestPosition = function(set){
	var $firstImage = set.find('a:first-child img');
	var $otherImages = set.find('a:not(:first-child) img');

	checkImagesInCol($otherImages, $firstImage);
}

var calculateInRow = function(block){
	$(block).find('.imageset').each(function(){
		var $set = $(this);
		var imgQty = $set.find('img').length;
		switch (imgQty) {
			case 0:
				break;
			case 1:
				$set.find('img').width("100%");
				break;
			case 2:
				checkImagesInRow($set);
				break;
			case 3:
				getBestPosition($set);
				break;
			case 4:
				getBestPosition($set);
				break;
			default:
				for (var i = 0; i < imgQty / 4; i+= 1) {
					$set.append('<div class="subset"></div><div class="clearfix"></div>');
				}
                
				$set.children('a').each(function(i){
					var contNumber = parseInt(i/4);
					var subCont = $set.children('.subset').eq(contNumber);
					$(this).detach().appendTo(subCont);
				});

				var qtyRows = $set.children('.subset').length;
				var $lastRow = $set.children('.subset').eq(qtyRows - 1);
				var qtyLastRow = $lastRow.find('a').length;


				if (qtyRows > 1 && qtyLastRow == 1) {
					var $prevRow = $set.children('.subset').eq(qtyRows - 2);
					$lastRow.find('a').detach().appendTo($prevRow);
				}


				$set.children('.subset').each(function(i){
					if (i == 0) {
						getBestPosition($(this));
					} else {
						checkImagesInRow($(this));
					}
				});
				break;
		}

		$set.find('a').fancybox({
	        'titlePosition' : 'float',
	        'overlayColor' : '#333333',
	        'overlayOpacity' : 0.5,
	        'titleShow' : false,
	        'cyclic' : false,
	        'padding' : 0,
	        'showCloseButton' : true,
	        'showNavArrows': true,
	        'enableEscapeButton' : true
    	});
	});
};
