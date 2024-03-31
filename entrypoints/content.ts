import { createApp } from "vue";
import BookmarkSidebar from "@/components/BookmarkSiderBar.vue";
import observer from "./observer";

export default defineContentScript({
    matches: ['*://twitter.com/*'],
    runAt: "document_end",
    main(ctx) {
        observer(({ element }) => {
            const newElem = createApp(BookmarkSidebar)
            const newElement = document.createElement('div');
            newElement.innerHTML = '这是一个新元素';
            newElem.mount(newElement)
            var parent = element.parentNode?.parentNode?.parentNode;
            console.log(parent);
            var firstChild = parent?.childNodes[1];
            if (firstChild) {
                parent?.insertBefore(newElement, firstChild.nextSibling);
            }
        })
    },
})