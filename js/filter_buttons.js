// Botones de filtros (carrusel inferior como en el mockup).
// Llaman a player.setFilter(id), que define el script "Filtros: botones"
// dentro de la escena del editor de three.js (objeto mesh_0).
//
// Para agregar un boton: añade una linea a BOTONES con el mismo id que pusiste
// en la lista FILTROS del script del editor y su imagen en la carpeta img/.
// "indicacion" es el texto que ve la persona sobre los botones (null = ninguno).

const BOTONES = [
    { id: null,      etiqueta: "Sin nada", imagen: "img/btn_sin_nada.png", indicacion: null },
    { id: "crema",   etiqueta: "Crema",    imagen: "img/btn_crema.png",    indicacion: "Parpadea" },
    { id: "balsamo", etiqueta: "Labial",   imagen: "img/btn_labial.png",   indicacion: "Sonríe" },
    { id: "perfume", etiqueta: "Perfume",  imagen: "img/btn_perfume.png",  indicacion: "Sube las cejas" },
];

export function initFilterButtons(player, { initial = null } = {}) {

    const contenedor = document.getElementById("filter-buttons");
    const indicacion = document.getElementById("filter-hint");

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
        mostrarIndicacion(BOTONES.find((b) => b.id === id));
    }

    // Texto con la instruccion del filtro activo (se anima cada vez que cambia).
    function mostrarIndicacion(boton) {
        if (!indicacion) return;
        indicacion.classList.remove("visible");
        if (!boton || !boton.indicacion) {
            indicacion.textContent = "";
            return;
        }
        indicacion.textContent = boton.indicacion;
        void indicacion.offsetWidth;          // reinicia la animacion de entrada
        indicacion.classList.add("visible");
    }

    window.addEventListener("filtro-cambiado", (e) => marcar(e.detail.id));

    player.setFilter?.(initial);
    marcar(initial);

}
