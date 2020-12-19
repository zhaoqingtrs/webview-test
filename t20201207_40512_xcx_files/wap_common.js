// 18.1.3版本更新
//头条+banner轮播+专题自动播放
/*
 * 所有拓展组件，在同个页面引用时，其按钮等等选择器class 不能相同，否则将会冲突
 *
 * */
;
(function ($) {
    //所有 class均为jquery选择器
    /*
     * option参数说明：没有特殊说明类型则为string
     * text:切换文本的class，如果没有则不填写
     * prev 切换btn class，如果没有则不填写
     * next 切换btn class ，如果没有则不填写
     * num  通过num切换，如果没有则不填写，num的length必须与切换对象length相同
     * className 当前选中num的className(不是选择器)，默认:cur
     * callback 类型：function 每次切换完成调用，如果没有则不填写
     * index 类型：number 切换开始位置
     * time  类型 number  切换过渡时间，默认：300;
     * autoPlay 类型 boolean 是否轮播,默认:true；
     * playTime 类型 number 自动播放时间，默认:4000,
     * direction 自动播放的顺序  默认：next
     * type 切换方向top或left,默认：left
     * space 类型：number 切换item中的间距 默认：0
     * indy动态数字变化
     * lendy 总长度
     * */
    function simpleSwitch(option) {
        var $banner = option._this,
            $event = option.event || 'mouseover',
            $text = option.text ? $(option.text) : null,
            $next = option.prev ? $(option.prev) : null,
            $prev = option.next ? $(option.next) : null,
            $num = option.num ? $(option.num) : null,
            $indy = option.indy ? $(option.indy) : null,
            $lendy = option.lendy ? $(option.lendy) : null,
            callBack = option.callback
        var len = $banner.length,
            index = option.index || 0,
            time = option.time || 300,
            playTime = option.playTime || 4000,
            type = option.type || 'left',
            direction = option.direction || 'next',
            autoPlay =
            option.autoPlay === undefined || option.autoPlay === true ?
            true :
            false,
            className = option.className || 'cur'
        type = type === 'top' ? 'top' : 'left'
        var pw =
            type === 'top' ? $banner.parent().height() : $banner.parent().width(),
            cw = type === 'top' ? $banner.height() : $banner.width()
        option.space = option.space || 0
        cw += option.space
        var css = {}
        if (cw * len <= pw) return
        init()

        function init() {
            if ($lendy) {
                $lendy.text(len)
            }
            $banner.each(function() {
                var _i = $(this).index()
                $(this).show()
                css[type] = (_i - index) * cw
                $(this).css(css)
            })
            if ($num) {
                $num
                    .eq(index)
                    .addClass(className)
                    .siblings()
                    .removeClass(className)
            }
            if ($indy) {
                $indy.text(index + 1)
            }
            if ($text) {
                $text
                    .eq(index)
                    .show(0)
                    .siblings()
                    .hide()
            }
        }

        function nextMove() {
            if (!$banner.is(':visible')) return
            for (var i = 0; i < len; i++) {
                var $item = $banner.eq(i)
                var pos = Math.floor($item.position()[type])
                if (pos <= -cw) {
                    var perLeft = 0
                    if (i === 0) {
                        perLeft = $banner.eq(len - 1).position()[type]
                    } else {
                        perLeft = $banner.eq(i - 1).position()[type]
                    }
                    css[type] = perLeft + cw
                    $item.css(css)
                }
                var nowLeft = $item.position()[type]
                css[type] = nowLeft - cw
                $item.animate(css, time)
            }
        }

        function prevMove() {
            if (!$banner.is(':visible')) return
            for (var i = 0; i < len; i++) {
                var $item = $banner.eq(i)
                var pos = Math.floor($item.position()[type])
                if (pos >= pw) {
                    var perLeft = 0
                    if (i === len - 1) {
                        perLeft = $banner.eq(0).position()[type]
                    } else {
                        perLeft = $banner.eq(i + 1).position()[type]
                    }
                    css[type] = perLeft - cw
                    $item.css(css)
                }
                var nowLeft = $item.position()[type]
                css[type] = nowLeft + cw
                $item.animate(css, time)
            }
        }

        function bannerPlay() {
            if ($banner.is(':animated')) return
            index++
            index = index >= len ? 0 : index
            if (direction === 'next') {
                nextMove()
            } else {
                prevMove()
            }
            toNextShow()
        }
        if (autoPlay) {
            var play = setInterval(bannerPlay, playTime)
        }

        function toNextShow() {
            if ($num) {
                if (direction === 'next') {
                    $num
                        .eq(index)
                        .addClass(className)
                        .siblings()
                        .removeClass(className)
                } else {
                    $num
                        .eq(len - index)
                        .addClass(className)
                        .siblings()
                        .removeClass(className)
                }
            }
            if ($text) {
                if (direction === 'next') {
                    $text
                        .eq(index)
                        .show(0)
                        .siblings()
                        .hide()
                } else {
                    $text
                        .eq(len - index)
                        .show(0)
                        .siblings()
                        .hide()
                }
            }
            if ($indy) {
                if (direction === 'next') {
                    $indy.text(index + 1)
                } else {
                    $indy.text(len - index + 1)
                }
            }
            if (!autoPlay) return
            clearInterval(play)
            play = null
            play = setInterval(bannerPlay, playTime)
            if (callBack) callBack()
        }
        if ($next) {
            $next.click(function() {
                if ($banner.is(':animated')) return
                index--
                index = index < 0 ? len - 1 : index
                // 12.10修改
                prevMove()
                toNextShow()
            })
        }
        if ($prev) {
            $prev.click(function() {
                if ($banner.is(':animated')) return
                index++
                index = index >= len ? 0 : index
                // 12.10修改
                nextMove()
                toNextShow()
            })
        }
        if ($num) {
            $num.on($event, function() {
                if ($banner.is(':animated')) return
                var nextIndex = $num.index($(this))
                $banner.each(function() {
                    var _i = $(this).index()
                    $(this).show()
                    css[type] = (_i - index) * cw
                    $(this).css(css)
                })
                for (var i = 0; i < len; i++) {
                    var $item = $banner.eq(i)
                    var nowLeft = $item.position()[type]
                    css[type] = nowLeft + -cw * (nextIndex - index)
                    $item.animate(css, time)
                }
                index = nextIndex
                toNextShow()
            })
        }
    }// 12/14替换

    // 时间轴
    /*
     * option参数说明：没有特殊说明类型则为string
     next:向后按钮
     prev:向前按钮
     tabCount:切换内容主体
     tabHead: 切换选中对象
     cur: 选中样式 默认cur
     showNum: 展示数量 number类型
     * */
    function timeLineSwitch(option) {
        var next = option.next || null,
            prev = option.prev || null,
            tabCount = option.tabCount,
            tabHead = option.tabHead,
            cur = option.cur || 'cur',
            showNum = option.showNum || 8
        var initData = getData();
        $(tabHead).width(($(tabHead).children('.panel').length) * initData.space).css('left','0px')
        $('.process').width(($('.line_pro').children('a').length)*initData.space)
        $('.line_pro').width(($('.line_pro').children('a').length)*initData.space)
        $('.line_thumb').width(initData.firstWidth)
        $(tabCount).children().eq(0).css('display','block')
        $(tabHead).children('.panel').click(function () {
            selected(1, $(this))
        })
        $('.line_pro a').click(function () {
            selected(2, $(this))
        })
        $(next).click(function () {
            move(next)
        })
        $(prev).click(function () {
            move(prev)
        })

        function selected(val, optioin_this) {
            
            var showContent = val === 1 ? '.line_pro' : tabHead
            optioin_this.addClass(cur).siblings().removeClass(cur);
            var index = optioin_this.index();
            $(showContent).children().eq(index).addClass(cur).siblings().removeClass(cur);
            var data = getData()
            data.loc === 0 ? $('.process .line_thumb').width((data.firstWidth + index * data.space)) : $('.process .line_thumb').width((data.firstWidth + (index - (data.loc / data.space)) * data.space));
            $(tabCount).children().eq(index).css('display', 'block').siblings().css('display', 'none');
        }
        function move(direction) {
            var oldIndex = ($(tabHead).children('.cur').index());
            var len = $(tabHead).children('.panel').length;
            var newIndex = direction === next ? (oldIndex > len - 2 ? oldIndex : oldIndex + 1) : (oldIndex < 1 ? oldIndex : oldIndex - 1)
            $('.line_pro').children().eq(newIndex).addClass(cur).siblings().removeClass(cur);
            $(tabHead).children().eq(newIndex).addClass(cur).siblings().removeClass(cur);
            var data = getData()
            if (data.loc !== 0) {
                if (direction === next) {
                    if (newIndex - (data.loc / data.space) > showNum) {
                        $('.line_thumb').width((data.firstWidth + showNum * data.space));
                        $(tabHead).css('left', -(newIndex - showNum) * data.space)
                        $('.line_pro').css('left', -(newIndex - showNum) * data.space)
                    }
                    else {
                        $('.line_thumb').width((data.firstWidth + (newIndex - (data.loc / data.space)) * data.space));
                    }
                } else {
                    if (newIndex - (data.loc / data.space) >= 0) {
                        $('.line_thumb').width((data.firstWidth + (newIndex - (data.loc / data.space)) * data.space))
                    }
                    else {
                        $(tabHead).css('left', -(newIndex * data.space))
                        $('.line_pro').css('left', -(newIndex * data.space))
                    }
                }
            } else {
                if (direction === next) {
                    if (newIndex > showNum) {
                        $('.line_thumb').width((data.firstWidth + showNum * data.space));
                        $(tabHead).css('left', -(newIndex - showNum) * data.space)
                        $('.line_pro').css('left', -(newIndex - showNum) * data.space)
                    } else {
                        $('.line_thumb').width((data.firstWidth + newIndex * data.space));
                    }
                } else {
                    if (newIndex < 0) {
                        $('.line_thumb').width((data.firstWidth + 0 * data.space))
                    } else if (newIndex > 7) {
                        $(tabHead).css('left', -(newIndex - showNum) * data.space)
                        $('.line_pro').css('left', -(newIndex - showNum) * data.space)
                    }  
                    else {
                        $('.line_thumb').width((data.firstWidth + newIndex * data.space));
                    }
                }
            }
            $(tabCount).children().eq(newIndex).css('display', 'block').siblings().css('display', 'none')
        }
        function getData(){
            var loc = Math.abs(parseInt($(tabHead).css('left').split("px").join("")))
            var leftspace = Number($('.process').children('.line_pro').children('a').eq(1).css('margin-left').split("px").join(""))
            var width = Number($('.process').children('.line_pro').children('a').css('width').split("px").join(""))
            var space = leftspace + width
            var firstWidth = Number($(prev).width() ? leftspace - $(prev).css('width').split("px").join(""):$(prev).css('width').split("px").join(""))
            return {loc:loc,leftspace:leftspace,width:width,space:space,firstWidth:firstWidth}
        }
    
        
            

     
    }// 12/14新增
    // 淡入淡出切换
    /*
     * 参数配置如上
     * */
    function SwitchFade(option) {
        var $banner = option._this,
            $text = option.text ? $(option.text) : null,
            $num = option.num ? $(option.num) : null,
            $indy = option.indy ? $(option.indy) : null,
            $lendy = option.lendy ? $(option.lendy) : null,
            index = option.index || 0,
            len = $banner.length,
            time = option.time || 300,
            playTime = option.playTime || 4000,
            className = option.className || 'cur'
        $banner.hide()
        $banner.eq(index).show()
        SwitchTransform()

        function SwitchTransform() {
            $banner
                .stop()
                .eq(index)
                .fadeIn(time)
                .siblings()
                .fadeOut(time)
            $num
                .eq(index)
                .addClass(className)
                .siblings()
                .removeClass(className)
            $text
                .eq(index)
                .show()
                .siblings()
                .hide()
            if ($indy) {
                $lendy.text(len)
                $indy.text(index + 1)
            }
        }

        function SwitchPlay() {
            if ($banner.is(':animated')) return
            index++
            index = index >= len ? 0 : index
            SwitchTransform()
        }
        var play = setInterval(SwitchPlay, playTime)
        $num.hover(
            function () {
                clearInterval(play)
                play = null
                index = $num.index($(this))
                SwitchTransform()
            },
            function () {
                play = setInterval(SwitchPlay, playTime)
            }
        )
        if (option.prev) {
            var $left = $(option.prev)
            $left.click(function () {
                index--
                index = index < 0 ? len - 1 : index
                SwitchTransform()
                clearInterval(play)
                play = null
                play = setInterval(SwitchPlay, playTime)
            })
        }
        if (option.next) {
            var $next = $(option.next)
            $next.click(function () {
                index++
                index = index >= len ? 0 : index
                SwitchTransform()
                clearInterval(play)
                play = null
                play = setInterval(SwitchPlay, playTime)
            })
        }
    }


    /*滚动
     * option={
     * type: 方向 top或 left 默认 left
     * space：间距 默认 15（可以是负数，最好设置一下）
     * next、prev左右切换按钮
     * direction   prev或者next 默认 next，就是设置开始的时候是向左或者向右
     * time 滚动时间 默认25,时间越大滚动越慢
     *
     * }
     * */
    function simpleRoll(option) {
        function RollNext() {
          // console.log(Width)
          for (var i = 0; i < len; i++) {
            var $item = $photo.eq(i);
            if ($item.position()[type] <= -Width) {
              var perLeft = 0;
              if (i === 0) {
                perLeft = $photo.eq(len - 1).position()[type];
              } else {
                perLeft = $photo.eq(i - 1).position()[type];
              }
              var _css = {};
              if (type === 'left') {
                _css[type] = perLeft + cw;
              } else {
                _css[type] = perLeft + Width;
              }
              $item.css(_css);
            }
            var nowLeft = $item.position()[type];
            (function($item, nowLeft) {
              setTimeout(function() {
                var _css = {};
                _css[type] = nowLeft - 1;
                $item.css(_css);
              }, 5);
            })($item, nowLeft);
          }
        }
    
        function RollPrev() {
          for (var i = 0; i < len; i++) {
            var $item = $photo.eq(i);
            // console.log(Width)
            if ($item.position()[type] >= Width) {
              var perLeft = 0;
              if (i === len - 1) {
                perLeft = $photo.eq(0).position()[type];
              } else {
                perLeft = $photo.eq(i + 1).position()[type];
              }
              var _css = {};
              if (type === 'left') {
                _css[type] = perLeft - cw;
              } else {
                _css[type] = perLeft - Width;
              }
              $item.css(_css);
            }
            // 12.13修改
            var nowLeft = $item.position()[type]
            ;(function($item, nowLeft) {
              setTimeout(function() {
                var _css = {};
                _css[type] = nowLeft + 1;
                $item.css(_css);
              }, 5);
            })($item, nowLeft);
          }
        }
    
        function playtmFun() {
          play = setInterval(playFun, time);
        }
        var $photo = option._this,
            $parent = $photo.parent(),
            type = option.type === 'top' ? 'top' : 'left';
        var Width = type === 'top' ? $photo.height() : $parent.width();
        if ( $photo.width() <= Width) return $photo;
        $photo.clone().appendTo($parent);
        var $photo = $parent.children(),
          direction = option.direction || 'next',
          $next = option.next ? $(option.next) : null,
          $prev = option.prev ? $(option.prev) : null,
          len = $photo.length,
          space = option.space || 15,
          cw = $photo.width() + space,
          play = null,
          playFun = null,
          time = option.time || 25;
        $photo.each(function() {
          var index = $(this).index();
          var _css = {};
          if (type === 'left') {
            _css[type] = index * cw;
          } else {
            _css[type] = index * Width;
          }
          $(this).css(_css);
        });
        if (direction === 'next') {
          playFun = RollNext;
        } else {
          playFun = RollPrev;
        }
        // 12.13修改
        playtmFun();
        if ($prev) {
          $prev.click(function() {
            clearInterval(play);
            playFun = RollNext;
            playtmFun();
          });
        }
        if ($next) {
          $next.click(function() {
            clearInterval(play);
            playFun = RollPrev;
            playtmFun();
          });
        }
        $photo.hover(
          function() {
            clearInterval(play);
            play = null;
          },
          function() {
            play = setInterval(playFun, time);
          }
        );
      } //12/14替换
    /*滚动2
     * option={
     * type: 方向 top或 left 默认 left
     * space：间距 默认 15（最好设置一下）
     * next、prev左右切换按钮
     * direction   prev或者next 默认 next，就是设置开始的时候是向左或者向右
     * time 滚动时间 默认25,时间越大滚动越慢
     *
     * }
     * */
    function rollImages(option) {
        var $photo = option._this,
            direction = option.direction || 'next',
            $next = option.next ? $(option.next) : null,
            $prev = option.prev ? $(option.prev) : null,
            $parent = $photo.parent(),
            len = $photo.children().length,
            space = option.space || 15,
            cw =
                $photo
                    .children()
                    .eq(0)
                    .width() + space,
            play = null,
            playFun = null,
            time = option.time || 25,
            type = option.type === 'top' ? 'top' : 'left',
            $child = $photo.children()
        var Width = type === 'top' ? $child.height() : $photo.children().width()
        $child.each(function () {
            var index = $(this).index()
            $photo
                .css({
                    position: 'relative'
                })
                .children()
                .css({
                    position: 'absolute'
                })
            var _css = {}
            if (type === 'left') {
                _css[type] = index * cw
            } else {
                _css[type] = index * Width
            }
            $(this).css(_css)
        })
        if ($prev) {
            $prev.click(function () {
                clearInterval(play)
                playFun = prevRoll
                playtmFun()
            })
        }
        if ($next) {
            $next.click(function () {
                clearInterval(play)
                playFun = nextRoll
                playtmFun()
            })
        }
        $child.hover(
            function () {
                clearInterval(play)
                play = null
            },
            function () {
                play = setInterval(playFun, time)
            }
        )

        function playtmFun() {
            play = setInterval(playFun, time)
        }
        if (direction === 'next') {
            playFun = prevRoll
        } else {
            playFun = nextRoll
        }
        playtmFun()

        function prevRoll() {
            for (var i = 0; i < len; i++) {
                var $item = $child.eq(i)
                if ($item.position()[type] <= -Width) {
                    var perLeft = 0
                    if (i === 0) {
                        perLeft = $child.eq(len - 1).position()[type]
                    } else {
                        perLeft = $child.eq(i - 1).position()[type]
                    }
                    var _css = {}
                    if (type === 'left') {
                        _css[type] = perLeft + cw
                    } else {
                        _css[type] = perLeft + Width
                    }
                    $item.css(_css)
                }
                var nowLeft = $item.position()[type];
                (function ($item, nowLeft) {
                    setTimeout(function () {
                        var _css = {}
                        _css[type] = nowLeft - 1
                        $item.css(_css)
                    }, 5)
                })($item, nowLeft)
            }
        }

        function nextRoll() {
            for (var i = 0; i < len; i++) {
                var $item = $child.eq(i)
                if ($item.position()[type] >= cw * (len - 1)) {
                    var perLeft = 0
                    if (i === len - 1) {
                        perLeft = $child.eq(0).position()[type]
                    } else {
                        perLeft = $child.eq(i + 1).position()[type]
                    }
                    var _css = {}
                    if (type === 'left') {
                        _css[type] = perLeft - cw
                    } else {
                        _css[type] = perLeft - Width
                    }
                    $item.css(_css)
                }
                // 12.13修改
                var nowLeft = $item.position()[type];
                (function ($item, nowLeft) {
                    setTimeout(function () {
                        var _css = {}
                        _css[type] = nowLeft + 1
                        $item.css(_css)
                    }, 5)
                })($item, nowLeft)
            }
        }
    }
    /*多张图片左右滚动（每次只滚动一张）
     * option={
     * len 显示几个的数量
     * type: 方向 right 或 left 默认 left
     * space：间距 默认 15
     * prev next 左右按钮
      aniTime:默认500,//过渡时间
      moveTime:默认3000//间隔滑动时间
     * }
     * */
    function bannerRollLR(option) {
        var banBox = option._this, //移动的容器
            len = option.len || banBox.children().length, //显示几个的数量
            aniTime = option.aniTime || 500, //过渡时间
            moveTime = option.moveTime || 3000, //间隔滑动时间

            type = option.type || 'left',
            banBtnR = option.prev ? $(option.prev) : null, //左按钮
            banBtnL = option.next ? $(option.next) : null //右按钮

        var sizeChild = banBox.children().length
        var moveM = banBox.children().outerWidth(true) //获取内外边距
        if (sizeChild <= len) {
            banBox.css({ width: sizeChild * moveM * 1.2 })
            return
        }
        var i = 0,
            cloneArr = []
        banBox.each(function () {
            for (var i = 0; i < len; i++) {
                cloneArr.push(
                    banBox
                        .children()
                        .eq(i)
                        .clone()
                )
            }
        })
        for (var j = 0; j < cloneArr.length; j++) {
            banBox.append(cloneArr[j])
        }

        var sizeChildo = banBox.children().length
        banBox.css({ width: sizeChildo * moveM * 1.2 })

        function movel() {
            if (banBox.is(':animated')) return
            i++
            if (i === sizeChildo - (len - 1)) {
                banBox.css({ left: 0 })
                i = 1
            }
            banBox.stop().animate({ left: -i * moveM }, aniTime)
        }

        function mover() {
            if (banBox.is(':animated')) return
            i--
            if (i === -1) {
                banBox.css({ left: -(sizeChildo - len) * moveM })
                i = sizeChildo - (len + 1)
            }
            banBox.stop().animate({ left: -i * moveM }, aniTime)
        }
        // 左按钮
        // 添加三个变量12.10
        var tmr
        var tml
        var t
        var bj
        if (type === 'left') {
            bj = false
        } else {
            bj = true
        }
        if (banBtnL) {
            banBtnL.click(function () {
                clearInterval(t)
                clearInterval(tmr)
                clearInterval(tml)
                movel()
                tml = setInterval(movel, moveTime)
                bj = false
            })
        }
        // 右按钮
        if (banBtnR) {
            banBtnR.click(function () {
                clearInterval(t)
                clearInterval(tml)
                clearInterval(tmr)
                mover()
                tmr = setInterval(mover, moveTime)
                bj = true
            })
        }
        // 定时器
        if (type === 'left') {
            t = setInterval(movel, moveTime)
        } else {
            t = setInterval(mover, moveTime)
        }
        // 对banner定时器的操作
        banBox.parent().hover(
            function () {
                clearInterval(t)
                clearInterval(tml)
                clearInterval(tmr)
            },
            function () {
                if (bj === false) {
                    t = setInterval(movel, moveTime)
                } else {
                    t = setInterval(mover, moveTime)
                }
            }
        )
    }

    /*
      * tab切换
      *jQuery(".news-tab-header li").tabPanelFun({
        cur:'cur',   鼠标经过选项添加的类
        tabContent:'.news-tab-lists', tab切换内容的最外层容器，是news-tab-header的兄弟元素
        tabItem:'.news-tab-item'   tab切换内容里的子元素（即要切换内容）
        pra：默认false，如果tab的选项按钮是多层次的就选ture
        pradom 深层次的最父级元素
        evnets 点击事件或者其他事件evnets:'click'，默认mouseenter
      })
      *
      *
     */
    function tabPanelFun(option) {
        var $panel = option._this,
            cur = option.cur ? option.cur : null,
            pra = option.pra ? option.pra : false,
            pradom = option.pradom ? option.pradom : null,
            tabContent = option.tabContent ? option.tabContent : null,
            tabItem = option.tabItem ? option.tabItem : null,
            ev = option.evnets ? option.evnets : 'mouseenter'
        var tabItemdu = $(tabContent).find(tabItem)
        $panel.eq(0).addClass(cur)
        $(tabItemdu).hide()
        $(tabItemdu)
            .eq(0)
            .show()
        $panel.on(ev, function () {
            var index = $(this)
                .parent()
                .children($panel.selector)
                .index(this)
            if (pra === true) {
                jQuery(this)
                    .parents(pradom)
                    .siblings(tabContent)
                    .children(tabItemdu)
                    .eq(index)
                    .show()
                    .siblings()
                    .hide()
            } else {
                jQuery(this)
                    .parent()
                    .siblings(tabContent)
                    .children(tabItemdu)
                    .eq(index)
                    .show()
                    .siblings()
                    .hide()
            }
            jQuery(this)
                .addClass(cur)
                .siblings($panel.selector)
                .removeClass(cur)
        })
    }
    /**
     * @description: tab切换
     * @param {type} event 触发的方式 默认mouseover
     * @param {type} cur 选中样式 默认cur
     * @param {type} index 默认显示第几项 从0开始
     * @param {type} tabHead 事件选中的对象
     * @param {type} tabCont 显示的相应内容
     * @return: 
     */

    function tabSwitch(option) {
        var items = $(option._this),
            event = option.event || 'mouseover',
            cur = option.cur || 'cur',
            $index = option.index || 0,
            tabHead = option.tabHead,
            tabCont = option.tabCont
        items.each(function (index, item) {
            var btns = $(item).find(tabHead)
            var cons = $(item).find(tabCont)
            $(btns)
                .eq($index)
                .addClass(cur)
            $(cons).hide()
            $(cons)
                .eq($index)
                .show()
            $(btns).on(event, function () {
                $(this)
                    .addClass(cur)
                    .siblings()
                    .removeClass(cur)
                $(cons)
                    .eq($(btns).index(this))
                    .show()
                    .siblings()
                    .hide()
            })
        })
    }
    /**
     * [dropDownFun description]
     * tagSiblings:.drop-down .tag的兄弟元素
     * optionItem：下拉子选项
     * optionBool:是否是获取当前元素的值给.tag元素，默认是fasle（默认）当前元素，true是子元素
     * cur:当前添加的样式,不传递默认为空
     * @return {[type]}        [description]
     */
    function dropDownFun(option) {
        var $label = option._this,
            cur = option.cur ? option.cur : '',
            $tagSiblings = option.tagSiblings,
            $optionBool = option.optionBool ? option.optionBool : false,
            $optionItem = option.optionItem
        $label.each(function () {
            $(this).on('click', function (e) {
                var ev = e || window.event
                if (ev.stopPropagation) {
                    ev.stopPropagation()
                } else {
                    ev.cancelBubble = true
                }
                var index = $label.index($(this))
                $(this)
                    .stop()
                    .toggleClass(cur)
                    .siblings($tagSiblings)
                    .slideToggle()
                for (var i = 0, max = $label.length; i < max; i++) {
                    if (index !== i)
                        $label
                            .eq(i)
                            .stop()
                            .removeClass(cur)
                            .siblings($tagSiblings)
                            .slideUp()
                }
            })
        })
        $(document).on('click', $optionItem, function () {
            // 注意是获取当前元素还是子元素
            var text =
                $optionBool === false ?
                    $(this)
                        .children()
                        .text() :
                    $(this).text()
            $(this)
                .parents($tagSiblings)
                .siblings($label)
                .text(text)
        })
        $(document).on('click', function () {
            $label
                .stop()
                .removeClass(cur)
                .siblings($tagSiblings)
                .slideUp()
        })
    }
    /**
     * [dropDownImgText description]
     * tab:被点击将触发下拉的选项
     * text:被点击的文字
     * arrow:旋转图标
     * drop:下拉的对象
     * label：下拉的子选项
     * cur:当前添加的样式,不传递默认为空
     * @return {[type]}        [description]
     */
    function dropDownImgText(option) {
        var tag = option.tag,
            cont = option._this,
            text = option.text,
            arrow = option.arrow,
            drop = option.drop,
            label = option.label,
            event = option.event || 'click',
            cur = option.cur || 'cur'
        $(cont).each(function (index, item) {
            $(item)
                .children(tag)
                .on(event, function (e) {
                    e = e || event
                    e.stopPropagation()
                    var _thi = $(this)
                    $(this)
                        .parent()
                        .siblings(cont).removeClass('cur')
                    $(this)
                        .parent()
                        .siblings(cont)
                        .children(drop)
                        .slideUp()
                    $(this)
                        .parent()
                        .siblings(cont)
                        .children(tag)
                        .children(arrow)
                        .removeClass(cur)
                    $(this)
                        .parent()
                        .removeClass(cur)
                    $(document).on(event, function () {
                        _thi.siblings().slideUp()
                        _thi
                            .children(arrow)
                            .removeClass(cur)
                        _thi.parent().removeClass(cur)
                    })
                    if (
                        $(this)
                            .siblings()
                            .css('display') === 'block'
                    ) {
                        $(this)
                            .children(arrow)
                            .removeClass(cur)
                        $(this)
                            .parent()
                            .removeClass(cur)
                        $(this)
                            .siblings()
                            .slideUp()
                        return
                    } else {
                        $(this)
                            .children(arrow)
                            .addClass(cur)
                        $(this)
                            .parent()
                            .addClass(cur)
                        $(this)
                            .siblings()
                            .slideDown()
                        $(this)
                            .siblings()
                            .find(label)
                            .on(event, function (e) {
                                e = e || event
                                _thi
                                    .children(arrow)
                                    .removeClass(cur)
                                _thi.parent().removeClass(cur)
                                _thi.children(text).text($(this).text())
                                _thi.siblings().slideUp()
                                e.stopPropagation()
                            })
                        return
                    }
                })
        })
    }
    /*  
     树状下拉模块
     tit为最外层的导航
     */
    function treeDropdown(option) {
        var dropdown = option._this,
            tit = $(option.tit);
        $('.dropdown .icon').each(function () {
            $(this).click(function () {
                $(this)
                    .parent('li')
                    .toggleClass('cur');
                $(this)
                    .siblings('.ct')
                    .children('.inner-list')
                    .slideToggle();
            });
        });
        dropdown.hide();
        dropdown
            .eq(0)
            .show();
        tit
            .eq(0)
            .addClass('cur');
        tit.each(function () {
            $(this).click(function () {
                $(this)
                    .parent()
                    .siblings('.dropdown-item')
                    .find('.tit')
                    .removeClass('cur');
                $(this).addClass('cur');
                $(this)
                    .parent()
                    .siblings('.dropdown-item')
                    .find('.dropdown')
                    .slideUp();
                $(this)
                    .next('.dropdown')
                    .slideDown();
            });
        });
    }
    /**
     * @description: 多行文字超出隐藏
     * @param {type} maxCount 文字的长度
     * @return: 
     */
    function overEllipsis(option) {
        var $list = option._this,
            maxCount = option.maxCount
        $list.each(function (index, item) {
            var itemString = $(item).text()
            if (itemString.length > maxCount) {
                $(item).html(itemString.substring(0, maxCount) + '...')
            }
        })
    }
    /**
     * @description: 初始化echart图表
     * @param {type} echartoption option对象
     * @return: 
     */
    function initEchart(option) {
        var $id = option._this,
            toption = option.echartoption
        var myChart = echarts.init($id[0])
        myChart.setOption(toption)
    }
    /*
     *联动图片播放
     *大图图片数量和图片列表的图片数量要一致
     *option参数说明：没有特殊说明类型则为string
     *prev: 大图的向前播放按钮,
     *next: 大图的向后播放按钮,
     *ptNext: 图片列表向后播放按钮,
     *ptPrev: 图片列表向前播放按钮,
     *banner: 大图播放项,
     *text: 大图文字项,
     *link: 小图列表项,
     *linkSpace: 类型 number 小图之间的间距, 默认0
     *linkType: 小图移动的方向，默认: top
     *type: 大图切换方向top或left,默认：left
     *autoPlay 类型 boolean 是否轮播,默认:true;
     *playTime 类型 number 自动播放时间，默认:4000;
     *direction 大图自动播放的顺序  默认：next;
     *time  类型 number  切换过渡时间，默认：300;
     *cur 小图的效果类名， 默认: 'cur'
     */
    function linkSwitch(option) {
        var $banner = option._this ? $(option._this) : null,
            $link = option.link ? $(option.link) : null,
            $text = option.text ? $(option.text) : null
        var playTime = option.playTime || 4000,
            linkSpace = option.linkSpace || 0,
            direction = option.direction || 'next',
            linkType = option.linkType || 'top',
            type = option.type ? option.type : 'left',
            autoPlay =
                option.autoPlay === undefined || option.autoPlay === true ?
                    true :
                    false,
            event = option.event ? option.event : 'mouseover',
            time = option.time || 300,
            cur = option.cur || 'cur'
        var unit =
            type === 'top' ? $banner.parent().height() : $banner.parent().width(),
            match =
                linkType === 'top' ?
                    $link.height() + linkSpace :
                    $link.width() + linkSpace,
            len = $banner ? $banner.length : 0,
            index = 0,
            css = {},
            cssLink = {}
        init()
        if (autoPlay) {
            var play = setInterval(bannerPlay, playTime)
            $banner.hover(
                function () {
                    clearInterval(play)
                    play = null
                },
                function () {
                    play = setInterval(bannerPlay, playTime)
                }
            )
        }

        if ($link) {
            $link.on(event, function () {
                if ($banner.is(':animated')) return
                if ($link.is(':animated')) return
                index = $(this).index()
                configShow()
                index = index < 0 ? len - 1 : index
                $(this)
                    .addClass(cur)
                    .siblings()
                    .removeClass(cur)
                move()
            })
        }

        function init() {
            $banner
                .eq(index)
                .show()
                .siblings()
                .hide()
            $link.each(function () {
                var _i = $(this).index()
                $(this).show()
                cssLink[linkType] = (_i - index) * match
                $(this).css(cssLink)
            })
            configShow()
        }

        function bannerPlay() {
            if ($banner.is(':animated')) return
            index++
            index = index >= len ? 0 : index
            move()
            configShow()
            linkPlay()
        }

        function move() {
            $banner
                .eq(index)
                .fadeIn(time)
                .siblings()
                .fadeOut(time)
        }

        function linkPlay() {
            for (var i = 0; i < len; i++) {
                var $item = $link.eq(i)
                var type = linkType
                if ($item.position()[type] <= -match) {
                    var perLeft = 0
                    if (i === 0) {
                        perLeft = $link.eq(len - 1).position()[type]
                    } else {
                        perLeft = $link.eq(i - 1).position()[type]
                    }
                    cssLink[type] = perLeft + match
                    $item.css(cssLink)
                }
                var nowLeft = $item.position()[type]
                cssLink[type] = nowLeft - match
                $item.animate(cssLink, time)
            }
        }

        function configShow() {
            if ($text) {
                $text
                    .eq(index)
                    .show()
                    .siblings()
                    .hide()
            }
            $link
                .eq(index)
                .addClass(cur)
                .siblings()
                .removeClass(cur)
        }
    }
    /**
     * @description: 点击回到顶部
     * @param {type} isShow 回到顶部的时候是否隐藏
     * @return: 
     */
    function goBack(option) {
        var $banner = option._this ? $(option._this) : null
        $banner.click(function () {
            $('html,body').animate({
                scrollTop: 0
            },
                500
            )
        })
        $(window).scroll(function () {
            var gun = $(document).scrollTop()
            if (gun <= 400) {
                if (option.isShow) {
                    $banner.hide()
                }
            } else {
                $banner.show()
            }
        })
    }
    /**
     * @description: 广告弹窗
     * @param {type} direction 是左边的弹窗还是右边的弹窗
     * @return: 
     */
    function floatLR(option) {
        var $banner = option._this ? $(option._this) : null,
            direction = option.direction
        var margin_dis =
            (parseInt($(document.body).width()) - 1200) / 2 + 1200 + 30 + 'px'
        $banner.css(direction, margin_dis)
        $(window).resize(function () {
            if (parseInt($(window).width()) < 1480) {
                margin_dis = parseInt($(window).width()) - 100 + 'px'
            } else {
                margin_dis =
                    (parseInt($(document.body).width()) - 1200) / 2 + 1200 + 30 + 'px'
            }
            $banner.css(direction, margin_dis)
        })
    }

    $.fn.extend({
        timeLineSwitch: function (option) {
            var opt = option || {}
            opt._this = $(this)
            timeLineSwitch(opt)
        },
        SwitchFade: function (option) {
            var opt = option || {}
            opt._this = $(this)
            SwitchFade(opt)
        },
        simpleSwitch: function (option) {
            var opt = option || {}
            opt._this = $(this)
            simpleSwitch(opt)
        },
        simpleRoll: function (optioin) {
            var option = optioin || {}
            option._this = $(this)
            simpleRoll(option)
        },
        rollImages: function (optioin) {
            var option = optioin || {}
            option._this = $(this)
            rollImages(option)
        },
        bannerRollLR: function (optioin) {
            var option = optioin || {}
            option._this = $(this)
            bannerRollLR(option)
        },
        tabPanelFun: function (optioin) {
            var option = optioin || {}
            option._this = $(this)
            tabPanelFun(option)
        },
        dropDownFun: function (optioin) {
            var option = optioin || {}
            option._this = $(this)
            dropDownFun(option)
        },
        overEllipsis: function (optioin) {
            var option = optioin || {}
            option._this = $(this)
            overEllipsis(option)
        },
        initEchart: function (optioin) {
            var option = optioin || {}
            option._this = $(this)
            initEchart(option)
        },
        dropDownImgText: function (optioin) {
            var option = optioin || {}
            option._this = $(this)
            dropDownImgText(option)
        },
        tabSwitch: function (optioin) {
            var option = optioin || {}
            option._this = $(this)
            tabSwitch(option)
        },
        linkSwitch: function (optioin) {
            var option = optioin || {}
            option._this = $(this)
            linkSwitch(option)
        },
        goBack: function (optioin) {
            var option = optioin || {}
            option._this = $(this)
            goBack(option)
        },
        floatLR: function (optioin) {
            var option = optioin || {}
            option._this = $(this)
            floatLR(option)
        },
        treeDropdown: function (optioin) {
            var option = optioin || {};
            option._this = $(this);
            treeDropdown(option);
        }
    })
})(jQuery)

if (typeof exports === 'object') {
    module.exports = jQuery
}
