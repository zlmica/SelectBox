<script setup lang="ts">
import { onMounted } from 'vue'
let count = 1
let delCount: any = null
interface Props {
    // 用户可画最小宽度
    userDrawMinW?: number;
    // 用户可画最小高度
    userDrawMinH?: number;
    // 用户可画最多个数
    userDrawMaxCount?: number;
    // 边框颜色
    color?: string;
    // 动画开关
    animation?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
    userDrawMinW: 36,
    userDrawMinH: 30,
    userDrawMaxCount: 999,
    color: 'red',
    animation: true
})

const emits = defineEmits(['delete', 'create'])

const selectDivDeleteHandle = (index: number) => {
    // console.log('删除了第' + index + '个选择框')
    emits('delete', index)
}
// 创建选择框方法
const createSelectBox = (index: number, topLeftPointX: number, topLeftPointY: number, bottomRightPointX: number, bottomRightPointY: number) => {
    // console.log('添加第' + index + '个选择框成功')
    // console.log('选择框的定位:' + topLeftPointX + ',' + topLeftPointY + ',' + bottomRightPointX + ',' + bottomRightPointY)
    emits('create', {
        counter: index,
        pointer: {
            topLeftPointX,
            topLeftPointY,
            bottomRightPointX,
            bottomRightPointY
        }
    })
}

// 供外部调用主动删除接口，传下标
const deleteSelectDivByOtherBtn = (boxIndex: number) => {
    debugger
    const doms = document.querySelectorAll('.tagDiv')
    for (let i = 0; i < doms.length; i++) {
        const dom = doms[i]
        if (dom.innerHTML === String(boxIndex)) {
            document.querySelector('#selectDiv')!.removeChild(dom.parentNode!)
        }
    }
    for (let j = 0; j < doms.length; j++) {
        const element = doms[j];
        if (parseInt(element.innerHTML) > boxIndex) {
            element.innerHTML = String(parseInt(element.innerHTML) - 1)
        }
    }
    selectDivDeleteHandle(boxIndex)
    count--
}

onMounted(() => {
    let selfDiv = document.querySelector('#selectDiv') as HTMLElement
    let topScrollDistance = document.body.scrollTop + document.documentElement.scrollTop
    let leftScrollDistance = document.body.scrollLeft + document.documentElement.scrollLeft
    if (selfDiv.parentNode != null) {
        selfDiv.parentNode.addEventListener('scroll', function () {
            topScrollDistance = selfDiv.parentNode!.scrollTop + document.body.scrollTop + document.documentElement.scrollTop
            leftScrollDistance = selfDiv.parentNode!.scrollLeft + document.body.scrollLeft + document.documentElement.scrollLeft
        })
    }
    document.addEventListener('scroll', function () {
        topScrollDistance = document.body.scrollTop + document.documentElement.scrollTop
        leftScrollDistance = document.body.scrollLeft + document.documentElement.scrollLeft
    })
    // 坐标
    let topLeftPointX = 0
    let topLeftPointY = 0
    let bottomRightPointX = 0
    let bottomRightPointY = 0
    selfDiv.onmousedown = function (e) {
        topScrollDistance = document.body.scrollTop + document.documentElement.scrollTop
        leftScrollDistance = document.body.scrollLeft + document.documentElement.scrollLeft
        if (selfDiv.parentNode != null) {
            topScrollDistance = selfDiv.parentNode.scrollTop + document.body.scrollTop + document.documentElement.scrollTop
            leftScrollDistance = selfDiv.parentNode.scrollLeft + document.body.scrollLeft + document.documentElement.scrollLeft
        }
        let posx = e.offsetX;
        let posy = e.offsetY;
        let div = document.createElement("div");
        let node = document.createElement("div");
        node.className = 'tagDiv'
        let textnode = document.createTextNode(count + '');
        node.onmouseover = function (eno) {
            eno.stopPropagation()
            delCount = parseInt(eno.target!.innerHTML)
            eno.target!.innerHTML = 'X'
            if (props.animation) { }
            eno.target!.classList.add('rotate')
            eno.target!.classList.remove('rotateF')
            node.onmouseout = function (enod) {
                enod.stopPropagation()
                enod.target!.innerHTML = delCount
                enod.target!.classList.add('rotateF')
                enod.target!.classList.remove('rotate')
            }
        }
        node.onmousedown = function (en) {
            en.stopPropagation()
            selfDiv.removeChild(div);
            let allTag = document.querySelectorAll('.tagDiv')
            for (let i = 0; i < allTag.length; i++) {
                let element = allTag[i];
                if (parseInt(element.innerHTML) > delCount) {
                    element.innerHTML = String(parseInt(element.innerHTML) - 1)
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
            if (count == props.userDrawMaxCount) {
                console.log('选择框个数已到最大上限')
                selfDiv.onmouseup = null;
                selfDiv.removeChild(div);
            }
            if (count > 99) {
                node.style.height = '22px'
                node.style.width = '22px'
                node.style.lineHeight = '22px'
                node.style.top = '-25px'
                node.style.borderRadius = '11px'
                node.style.left = (Math.abs(ev.clientX - selfDiv.offsetLeft - (posx - leftScrollDistance)) / 2 - 11) + "px"
            }
            if (topLeftPointY < 22) {
                node.style.top = '-' + topLeftPointY + 'px'
            }
            selfDiv.onmouseleave = function (el) {
                el.stopPropagation()
                if (parseInt(div.style.width) > props.userDrawMinW && parseInt(div.style.height) > props.userDrawMinH) {
                    node.appendChild(textnode);
                    div.appendChild(node);
                    createSelectBox(count, topLeftPointX, topLeftPointY, bottomRightPointX, bottomRightPointY)
                    count++
                } else {
                    selfDiv.removeChild(div);
                }
                selfDiv.onmouseup = null;
                selfDiv.onmousemove = null;
                selfDiv.onmouseleave = null;
            }
            selfDiv.onmouseup = function () {
                if (parseInt(div.style.width) > props.userDrawMinW && parseInt(div.style.height) > props.userDrawMinH) {
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
})

defineExpose({
    deleteSelectDivByOtherBtn
})
</script>

<template>
    <div id="selectDiv">
    </div>
</template>

<style>
/* 选择框样式 */

.selectDiv {
    border: 2px solid v-bind('$props.color');
    position: absolute;
    width: 0;
    height: 0;
}

/* 计数器样式 */
.tagDiv {
    position: absolute;
    font-size: 12px;
    color: #fff;
    text-align: center;
    line-height: 18px;
    width: 18px;
    height: 18px;
    background-color: v-bind('$props.color');
    border-radius: 9px;
    cursor: pointer;
    top: -22px;
}

.rotate {
    transform: v-bind('$props.animation ? "rotate(360deg)" : "rotate(0deg)"');
    transition: all 1s;
}

.rotateF {
    transform: v-bind('$props.animation ? "rotate(-360deg)" : "rotate(0deg)"');
    transition: all 1s;
}
</style>
