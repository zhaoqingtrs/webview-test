
"use strict";

/*根元素字体设置
 * 以1920设计稿为基准，计算时，将设计稿上的尺寸除以100即可
 */

(function(doc, win) {
    var htmlFont = function() {
        var docEl = doc.documentElement,
            view = docEl.clientWidth,
            height = docEl.clientHeight,
            font;
        docEl.style.minHeight = height + "px";
        font = view / 7.5;
        view > 750 ? docEl.style.fontSize = 100 + "px" : docEl.style.fontSize = font + "px";
    };
    htmlFont();
    win.addEventListener("resize", htmlFont, false)
})(document, window);