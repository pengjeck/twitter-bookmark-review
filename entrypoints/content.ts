import { createApp } from "vue";
import PrintHW from "@/components/PrintHW.vue";
import observer from "./observer";

export default defineContentScript({
    matches: ['*://twitter.com/*'],
    runAt: "document_end",
    main(ctx) {
        observer(({ element }) => {
            const newElem = createApp(PrintHW)
            const newElement = document.createElement('div');
            newElement.innerHTML = '这是一个新元素';
            newElem.mount(newElement)
            // element.parentNode?.parentNode?.insertBefore(newElement, element.previousSibling);
            // 插入新元素作为兄弟节点
            var parent = element.parentNode?.parentNode?.parentNode;
            console.log(parent);
            var firstChild = parent?.childNodes[1];
            if (firstChild) {
                parent?.insertBefore(newElement, firstChild.nextSibling);
            }
        })
    },
})