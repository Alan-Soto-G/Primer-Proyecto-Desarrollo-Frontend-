export default class Helper {
    static async loadView(viewName, data = {}) {
        const html = await fetch(`/pages/${viewName}/${viewName}.html`).then(
            (res) => res.text()
        );

        console.log(html);
        const container = document.getElementById("contenedor");
        if (!container) {
            throw new Error("El contenedor no existe en el DOM.");
        }
        container.innerHTML = html;

        const js = await import(`/pages/${viewName}/${viewName}.js`);
        if (typeof js.init === "function") {
            js.init({ data });
        }
    }
}