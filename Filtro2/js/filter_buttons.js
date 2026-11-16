// Botones de filtros (carrusel inferior como en el mockup).
// Llaman a player.setFilter(id), que define el script "Filtros: botones"
// dentro de la escena del editor de three.js (objeto mesh_0).
//
// Para agregar un boton: añade una linea a BOTONES con el mismo id que pusiste
// en la lista FILTROS del script del editor y su imagen en la carpeta img/.

const BOTONES = [
    { id: null,      etiqueta: "Sin nada", imagen: "img/btn_sin_nada.png" },
    { id: "crema",   etiqueta: "Crema",    imagen: "img/btn_crema.png" },
    { id: "balsamo", etiqueta: "Labial",   imagen: "img/btn_labial.png" },
    { id: "perfume", etiqueta: "Perfume",  imagen: "img/btn_perfume.png" },
];

export function initFilterButtons(player, { initial = null } = {}) {

    const contenedor = document.getElementById("filter-buttons");
    const etiqueta = document.getElementById("filter-label");

    if (!contenedor) {
        console.warn("filter_buttons: falta el elemento #filter-buttons en el HTML.");
        return;
    }

    if (typeof player.setFilter !== "function") {
        console.warn("filter_buttons: la escena no tiene player.setFilter. " +
            "Usa filtro_botones.json o pega scripts/filtros_editor.js en mesh_0.");
    }

    contenedor.innerHTML = "";
    const elementos = new Map();

    for (const boton of BOTONES) {
        const el = document.createElement("button");
        el.type = "button";
        el.className = "filter-btn";
        el.title = boton.etiqueta;
        el.setAttribute("aria-label", boton.etiqueta);
        const img = document.createElement("img");
        img.src = boton.imagen;
        img.alt = boton.etiqueta;
        img.draggable = false;
        el.appendChild(img);
        el.addEventListener("click", () => player.setFilter?.(boton.id));
        contenedor.appendChild(el);
        elementos.set(boton.id, el);
    }

    // Resalta el boton activo; el script avisa con este evento cada vez que cambia.
    function marcar(id) {
        for (const [key, el] of elementos) {
            el.classList.toggle("active", key === id);
        }
        const activo = BOTONES.find((b) => b.id === id);
        if (etiqueta) etiqueta.textContent = activo ? activo.etiqueta : "";
    }

    window.addEventListener("filtro-cambiado", (e) => marcar(e.detail.id));

    player.setFilter?.(initial);
    marcar(initial);

}
