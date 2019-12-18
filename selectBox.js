
// 自定义可配置变量
// 用户可画最小宽度
var userDrawMinW = 36;
// 用户可画最小高度
var userDrawMinH = 30;
// 用户可画最多个数
var userDrawMaxCout = 999;
// 删除事件方法
function selectDivDeleteHandle(index) {
    console.log('删除了第' + index + '个选择框')
}
// 创建选择框方法
function createSelectBox(index, topLeftPointX, topLeftPointY, bottomRightPointX, bottomRightPointY) {
    console.log('添加第' + index + '个选择框成功')
    console.log('选择框的定位:' + topLeftPointX + ',' + topLeftPointY + ',' + bottomRightPointX + ',' + bottomRightPointY)
}

var count = 1
var delCount = null
// 供外部调用主动删除接口，传下标
function deleteSelectDivByOtherBtn(boxIndex) {
    var doms = document.querySelectorAll('.tagDiv')
    for (var i = 0; i < doms.length; i++) {
        var dom = doms[i]
        if (dom.innerHTML == count) {
            document.querySelector('#selectDiv').removeChild(dom.parentNode)
        }
    }
    for (var j = 0; j < doms.length; j++) {
        var element = doms[j];
        if (parseInt(element.innerHTML) > parseInt(boxIndex)) {
            element.innerHTML = parseInt(element.innerHTML) - 1
        }
    }
    selectDivDeleteHandle(boxIndex)
    count--
}
window.onload = function () {
    var selfDiv = document.querySelector('#selectDiv')
    var topScrollDistance = document.body.scrollTop + document.documentElement.scrollTop
    var leftScrollDistance = document.body.scrollLeft + document.documentElement.scrollLeft
    if (selfDiv.parentNode != null) {
        selfDiv.parentNode.addEventListener('scroll', function () {
            topScrollDistance = selfDiv.parentNode.scrollTop + document.body.scrollTop + document.documentElement.scrollTop
            leftScrollDistance = selfDiv.parentNode.scrollLeft + document.body.scrollLeft + document.documentElement.scrollLeft
        })
    }
    document.addEventListener('scroll', function () {
        topScrollDistance = document.body.scrollTop + document.documentElement.scrollTop
        leftScrollDistance = document.body.scrollLeft + document.documentElement.scrollLeft
    })
    // 坐标
    var topLeftPointX = 0
    var topLeftPointY = 0
    var bottomRightPointX = 0
    var bottomRightPointY = 0
    selfDiv.onmousedown = function (e) {
        topScrollDistance = document.body.scrollTop + document.documentElement.scrollTop
        leftScrollDistance = document.body.scrollLeft + document.documentElement.scrollLeft
        if (selfDiv.parentNode != null) {
            topScrollDistance = selfDiv.parentNode.scrollTop + document.body.scrollTop + document.documentElement.scrollTop
            leftScrollDistance = selfDiv.parentNode.scrollLeft + document.body.scrollLeft + document.documentElement.scrollLeft
        }
        var posx = e.offsetX;
        var posy = e.offsetY;
        var div = document.createElement("div");
        var node = document.createElement("div");
        node.className = 'tagDiv'
        var textnode = document.createTextNode(count + '');
        node.onmouseover = function (eno) {
            eno.stopPropagation()
            delCount = parseInt(eno.target.innerHTML)
            eno.target.innerHTML = 'X'
            eno.target.classList.add('rotate')
            eno.target.classList.remove('rotateF')
            node.onmouseout = function (enod) {
                enod.stopPropagation()
                enod.target.innerHTML = delCount
                enod.target.classList.add('rotateF')
                enod.target.classList.remove('rotate')
            }
        }
        node.onmousedown = function (en) {
            en.stopPropagation()
            selfDiv.removeChild(div);
            var allTag = document.querySelectorAll('.tagDiv')
            for (var i = 0; i < allTag.length; i++) {
                var element = allTag[i];
                if (parseInt(element.innerHTML) > delCount) {
                    element.innerHTML = parseInt(element.innerHTML) - 1
                }
            }
            count--
            selectDivDeleteHandle(delCount)
        }
        div.className = "selectDiv";
        div.onmousedown = function (ed) {
            ed.stopPropagation()
        }
        div.style.left = e.offsetX + "px";
        div.style.top = e.offsetY + "px";
        selfDiv.appendChild(div);
        selfDiv.onmousemove = function (ev) {
            if (ev.clientX > (posx + selfDiv.offsetLeft - leftScrollDistance)) {
                if (ev.clientY > (posy + selfDiv.offsetTop - topScrollDistance)) {
                    div.removeAttribute("style")
                    div.style.left = posx + "px";
                    div.style.top = posy + "px";
                    // 坐标
                    topLeftPointX = posx
                    topLeftPointY = posy
                    bottomRightPointX = Math.abs(ev.clientX - selfDiv.offsetLeft - (posx - leftScrollDistance)) + posx
                    bottomRightPointY = Math.abs(topScrollDistance - Math.abs(ev.clientY - selfDiv.offsetTop - posy)) + posy
                } else {
                    div.removeAttribute("style")
                    div.style.left = posx + "px";
                    div.style.bottom = (parseInt(selfDiv.style.height) - posy) + "px";
                    // 坐标
                    topLeftPointX = posx
                    topLeftPointY = posy - Math.abs(topScrollDistance - Math.abs(ev.clientY - selfDiv.offsetTop - posy))
                    bottomRightPointX = Math.abs(ev.clientX - selfDiv.offsetLeft - (posx - leftScrollDistance)) + posx
                    bottomRightPointY = posy
                }
            } else {
                if (ev.clientY > (posy + selfDiv.offsetTop - topScrollDistance)) {
                    div.removeAttribute("style")
                    div.style.right = (parseInt(selfDiv.style.width) - posx) + "px";
                    div.style.top = posy + "px";
                    topLeftPointX = posx - Math.abs(ev.clientX - selfDiv.offsetLeft - (posx - leftScrollDistance))
                    topLeftPointY = posy
                    bottomRightPointX = posx
                    bottomRightPointY = posy + Math.abs(topScrollDistance - Math.abs(ev.clientY - selfDiv.offsetTop - posy))
                } else {
                    div.removeAttribute("style")
                    div.style.right = (parseInt(selfDiv.style.width) - posx) + "px";
                    div.style.bottom = (parseInt(selfDiv.style.height) - posy) + "px";
                    topLeftPointX = posx - Math.abs(ev.clientX - selfDiv.offsetLeft - (posx - leftScrollDistance))
                    topLeftPointY = posy - Math.abs(topScrollDistance - Math.abs(ev.clientY - selfDiv.offsetTop - posy))
                    bottomRightPointX = posx
                    bottomRightPointY = posy
                }
            }
            div.style.width = Math.abs(ev.clientX - selfDiv.offsetLeft - (posx - leftScrollDistance)) + "px";
            div.style.height = Math.abs(topScrollDistance - Math.abs(ev.clientY - selfDiv.offsetTop - posy)) + "px";
            node.style.left = (Math.abs(ev.clientX - selfDiv.offsetLeft - (posx - leftScrollDistance)) / 2 - 9) + "px"
            if (count > 99) {
                node.style.height = '22px'
                node.style.width = '22px'
                node.style.lineHeight = '22px'
                node.style.top = '-25px'
                node.style.borderRadius = '11px'
                node.style.left = (Math.abs(ev.clientX - selfDiv.offsetLeft - (posx - leftScrollDistance)) / 2 - 11) + "px"
            }
            if (count == userDrawMaxCout) {
                console.log('选择框个数已到最大上限')
                selfDiv.onmouseup = null;
                selfDiv.removeChild(div);
            }
            selfDiv.onmouseleave = function (el) {
                el.stopPropagation()
                selfDiv.onmouseup = null;
                selfDiv.removeChild(div);
            }
            selfDiv.onmouseup = function () {
                if (parseInt(div.style.width) > userDrawMinW && parseInt(div.style.height) > userDrawMinH) {
                    node.appendChild(textnode);
                    div.appendChild(node);
                    createSelectBox(count, topLeftPointX, topLeftPointY, bottomRightPointX, bottomRightPointY)  
                    count++
                } else {
                    selfDiv.removeChild(div);
                }
                selfDiv.onmousemove = null;
                selfDiv.onmouseup = null;
                selfDiv.onmouseleave = null;
            }
        }
    }

}