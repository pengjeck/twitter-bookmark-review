export default function (callback: (arg0: { element: HTMLElement}) => void) {
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (element) {
        if (element instanceof HTMLElement === false) {
          return false;
        }
        // var tabIndex = element.attributes.getNamedItem("tabindex");
        // if (tabIndex) {
        //   console.log(element.querySelector('div[role="complementary"'));
        //   callback({
        //     element: element
        //   });
        // }
        var roleAttri = element.attributes.getNamedItem("role");
        if (roleAttri && roleAttri.value === "complementary") {
          console.log(element)
          callback({
            element: element,
          });
        }
      });
    });
  });
  observer.observe(document, { childList: true, subtree: true });
}