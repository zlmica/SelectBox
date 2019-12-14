
// 自定义可配置变量
// 用户可画最小宽度
var userDrawMinW = 36;
// 用户可画最小高度
var userDrawMinH = 30;
// 删除事件接口
function selectDivDeleteHandle(index) {
    console.log('删除了第' + index + '个选择框')
}
function createSelectBox(index) {
    console.log('添加第' + index + '个选择框成功')
}
window.onload = function () {
    var count = 1
    var delCount = null
    var selfDiv = document.querySelector('#selectDiv')
    var topScrollDistance = document.body.scrollTop + document.documentElement.scrollTop
    var leftScrollDistance = document.body.scrollLeft + document.documentElement.scrollLeft
    addRightMenu()
    if (selfDiv.parentNode) {
        selfDiv.parentNode.addEventListener('scroll', function () {
            document.querySelector('.menuUl').style.display = 'none'
            topScrollDistance = selfDiv.parentNode.scrollTop + document.body.scrollTop + document.documentElement.scrollTop
            leftScrollDistance = selfDiv.parentNode.scrollLeft + document.body.scrollLeft + document.documentElement.scrollLeft
        })
    }
    document.addEventListener('scroll', function () {
        document.querySelector('.menuUl').style.display = 'none'
        topScrollDistance = document.body.scrollTop + document.documentElement.scrollTop
        leftScrollDistance = document.body.scrollLeft + document.documentElement.scrollLeft
    })
    selfDiv.onmousedown = function (e) {
        if (document.querySelector('.menuUl').style.display == 'block') {
            document.querySelector('.menuUl').style.display = 'none'
            return
        }
        var posx = e.offsetX;
        var posy = e.offsetY;
        var div = document.createElement("div");
        var node = document.createElement("div");
        node.className = 'tagDiv'
        var textnode = document.createTextNode(count + '');
        node.onmouseover = function (eno) {
            eno.stopPropagation()
            document.querySelector('.menuUl').style.display = 'none'
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
            document.querySelector('.menuUl').style.display = 'none'
        }
        div.oncontextmenu = function (edt) {
            edt.preventDefault()
            edt.stopPropagation()
            return

            // document.querySelector('.menuUl').style.display = 'none'
            // var xx = edt.x || edt.layerX || 0
            // var yy = edt.y || edt.layerY || 0
            // document.querySelector('.menuUl').style.left = xx + 'px'
            // document.querySelector('.menuUl').style.top = yy + 'px'
            // document.querySelector('.menuUl').style.display = 'block'
            // document.querySelector('.menuLi1').onmousedown = function (e1) {
            //     e1.stopPropagation()
            //     document.querySelector('.menuUl').style.display = 'none'
            //     domtoimage.toBlob(edt.target)
            //     .then(function (blob) {
            //         window.saveAs(blob, 'my-node.png');
            //     });
            // }
            // document.querySelector('.menuLi2').onmousedown = function (e2) {
            //     e2.stopPropagation()
            //     document.querySelector('.menuUl').style.display = 'none'
            //     domtoimage.toJpeg(edt.target, { quality: 0.95 })
            //     .then(function (dataUrl) {
            //         var link = document.createElement('a');
            //         link.download = 'my-image-name.jpeg';
            //         link.href = dataUrl;
            //         link.click();
            //     })
            // }
            // document.querySelector('.menuLi3').onmousedown = function (e3) {
            //     e3.stopPropagation()
            //     document.querySelector('.menuUl').style.display = 'none'
            //     domtoimage.toPng(edt.target)
            //         .then(function (dataUrl) {
            //             var img = new Image()
            //             img.src = dataUrl
            //             document.body.appendChild(img)
            //         })
            //         .catch(function (error) {
            //             console.error('oops, something went wrong!', error)
            //         })
            // }
        }
        div.style.left = e.offsetX + "px";
        div.style.top = e.offsetY + "px";
        selfDiv.appendChild(div);
        // selfDiv.onmouseup = function () {
        //     if (parseInt(div.style.width) > userDrawMinW && parseInt(div.style.height) > userDrawMinH) {

        //     } else {
        //         selfDiv.removeChild(div);
        //     }
        //     selfDiv.onmousemove = null;
        // }
        selfDiv.onmousemove = function (ev) {
            if (ev.clientX > (posx + selfDiv.offsetLeft - leftScrollDistance)) {
                div.style.left = posx + "px";
                div.style.top = posy + "px";
            } else {
                div.removeAttribute("style")
                div.style.right = (parseInt(selfDiv.style.width) - posx) + "px";
                div.style.bottom = (parseInt(selfDiv.style.height) - posy) + "px";
            }
            div.style.width = Math.abs(ev.clientX - selfDiv.offsetLeft - (posx - leftScrollDistance)) + "px";
            div.style.height = Math.abs(topScrollDistance - Math.abs(ev.clientY - selfDiv.offsetTop - posy)) + "px";
            node.style.left = (Math.abs(ev.clientX - selfDiv.offsetLeft - (posx - leftScrollDistance)) / 2 - 9) + "px"
            selfDiv.onmouseup = function () {
                if (parseInt(div.style.width) > userDrawMinW && parseInt(div.style.height) > userDrawMinH) {
                    node.appendChild(textnode);
                    div.appendChild(node);
                    createSelectBox(count)
                    count++
                } else {
                    selfDiv.removeChild(div);
                }
                selfDiv.onmousemove = null;
                selfDiv.onmouseup = null;
            }
        }
    }

    // 创建右键内容
    function addRightMenu() {
        var menuUl = document.createElement('ul')
        var menuLi1 = document.createElement('li')
        var menuLi2 = document.createElement('li')
        var menuLi3 = document.createElement('li')
        menuLi1.innerHTML = '保存png格式图片'
        menuLi2.innerHTML = '保存jpeg格式图片'
        menuLi3.innerHTML = '添加到页面'
        menuLi1.className = 'menuLi1'
        menuLi2.className = 'menuLi2'
        menuLi3.className = 'menuLi3'
        menuUl.appendChild(menuLi1)
        menuUl.appendChild(menuLi2)
        menuUl.appendChild(menuLi3)
        menuUl.className = 'menuUl'
        document.body.appendChild(menuUl)
    }
}