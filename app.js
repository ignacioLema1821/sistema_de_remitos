const formCliente = document.getElementById("formCliente");
const formRemito = document.getElementById("formRemito");

const nombreCliente = document.getElementById("nombreCliente");
const repartoCliente = document.getElementById("repartoCliente");

const fechaRemito = document.getElementById("fechaRemito");
const numeroRemito = document.getElementById("numeroRemito");
const clienteRemito = document.getElementById("clienteRemito");

const cant20 = document.getElementById("cant20");
const cant12 = document.getElementById("cant12");
const cantSoda = document.getElementById("cantSoda");
const cantDispenser = document.getElementById("cantDispenser");

const cantMedio = document.getElementById("cantMedio");
const cantUno = document.getElementById("cantUno");
const cantUnoCuarto = document.getElementById("cantUnoCuarto");
const cantUnoMedio = document.getElementById("cantUnoMedio");
const cant8 = document.getElementById("cant8");
const cant10 = document.getElementById("cant10");

const btnMasCategorias = document.getElementById("btnMasCategorias");
const masCategorias = document.getElementById("masCategorias");

const observaciones = document.getElementById("observaciones");

const listaClientes = document.getElementById("listaClientes");
const historialRemitos = document.getElementById("historialRemitos");

const buscarCliente = document.getElementById("buscarCliente");
const filtroRepartoClientes = document.getElementById("filtroRepartoClientes");
const buscarRemito = document.getElementById("buscarRemito");

const resumenCliente = document.getElementById("resumenCliente");
const fechaDesde = document.getElementById("fechaDesde");
const fechaHasta = document.getElementById("fechaHasta");
const btnResumen = document.getElementById("btnResumen");
const btnExportarResumen = document.getElementById("btnExportarResumen");
const resultadoResumen = document.getElementById("resultadoResumen");

const btnExportar = document.getElementById("btnExportar");
const inputImportar = document.getElementById("inputImportar");
const btnGuardarRemito = document.getElementById("btnGuardarRemito");

let clientes = JSON.parse(localStorage.getItem("clientesRemitos")) || [];
let remitos = JSON.parse(localStorage.getItem("remitosEmpresa")) || [];

let editandoRemitoId = null;
let editandoClienteId = null;

let mostrarTodosLosRemitos = false;
let mostrarTodosLosClientes = false;

let ultimoResumen = null;

function guardarDatos() {
  localStorage.setItem("clientesRemitos", JSON.stringify(clientes));
  localStorage.setItem("remitosEmpresa", JSON.stringify(remitos));
}

function numero(valor) {
  return Number(valor) || 0;
}

function valorRemito(remito, campo) {
  return Number(remito[campo]) || 0;
}

function actualizarSelectsClientes() {
  clienteRemito.innerHTML = '<option value="">Seleccionar cliente</option>';
  resumenCliente.innerHTML = '<option value="">Seleccionar cliente</option>';

  clientes
    .slice()
    .sort((a, b) => a.nombre.localeCompare(b.nombre))
    .forEach(cliente => {
      const option1 = document.createElement("option");
      option1.value = cliente.id;
      option1.textContent = `${cliente.nombre} - Reparto ${cliente.reparto}`;
      clienteRemito.appendChild(option1);

      const option2 = document.createElement("option");
      option2.value = cliente.id;
      option2.textContent = `${cliente.nombre} - Reparto ${cliente.reparto}`;
      resumenCliente.appendChild(option2);
    });
}

function mostrarClientes() {
  listaClientes.innerHTML = "";

  const textoBusqueda = buscarCliente.value.toLowerCase();
  const repartoFiltro = filtroRepartoClientes.value;

  let clientesFiltrados = clientes.filter(cliente => {
    const coincideNombre = cliente.nombre.toLowerCase().includes(textoBusqueda);
    const coincideReparto = repartoFiltro === "" || cliente.reparto === repartoFiltro;
    return coincideNombre && coincideReparto;
  });

  clientesFiltrados = clientesFiltrados.slice().reverse();

  if (clientesFiltrados.length === 0) {
    listaClientes.innerHTML = "<p>No hay clientes para mostrar.</p>";
    return;
  }

  const hayBusquedaOFiltro = textoBusqueda !== "" || repartoFiltro !== "";

  const clientesAMostrar =
    mostrarTodosLosClientes || hayBusquedaOFiltro
      ? clientesFiltrados
      : clientesFiltrados.slice(0, 3);

  clientesAMostrar.forEach(cliente => {
    const div = document.createElement("div");
    div.className = "cliente";

    div.innerHTML = `
      <h3>${cliente.nombre}</h3>
      <p><strong>Reparto:</strong> ${cliente.reparto}</p>

      <div class="acciones">
        <button class="btn-editar" onclick="editarCliente('${cliente.id}')">Editar cliente</button>
        <button class="btn-eliminar" onclick="eliminarCliente('${cliente.id}')">Eliminar cliente</button>
      </div>
    `;

    listaClientes.appendChild(div);
  });

  if (clientesFiltrados.length > 3 && !hayBusquedaOFiltro) {
    const boton = document.createElement("button");
    boton.textContent = mostrarTodosLosClientes
      ? "Mostrar menos"
      : "Mostrar más clientes";

    boton.addEventListener("click", function() {
      mostrarTodosLosClientes = !mostrarTodosLosClientes;
      mostrarClientes();
    });

    listaClientes.appendChild(boton);
  }
}

function mostrarRemitos() {
  historialRemitos.innerHTML = "";

  const busqueda = buscarRemito.value.toLowerCase();

  let remitosFiltrados = remitos.filter(remito => {
    return (
      remito.numero.toLowerCase().includes(busqueda) ||
      remito.clienteNombre.toLowerCase().includes(busqueda)
    );
  });

  remitosFiltrados.sort((a, b) => Number(b.numero) - Number(a.numero));

  if (remitosFiltrados.length === 0) {
    historialRemitos.innerHTML = "<p>No hay remitos para mostrar.</p>";
    return;
  }

  const hayBusqueda = busqueda !== "";

  const remitosAMostrar =
    mostrarTodosLosRemitos || hayBusqueda
      ? remitosFiltrados
      : remitosFiltrados.slice(0, 3);

  remitosAMostrar.forEach(remito => {
    const div = document.createElement("div");
    div.className = "remito";

    div.innerHTML = `
      <h3>Remito N° ${remito.numero}</h3>
      <p><strong>Fecha:</strong> ${formatearFecha(remito.fecha)}</p>
      <p><strong>Cliente:</strong> ${remito.clienteNombre}</p>
      <p><strong>Reparto:</strong> ${remito.reparto}</p>

      <div class="info">
        <div class="box"><strong>20L</strong>${valorRemito(remito, "c20")}</div>
        <div class="box"><strong>12L</strong>${valorRemito(remito, "c12")}</div>
        <div class="box"><strong>Soda</strong>${valorRemito(remito, "soda")}</div>
        <div class="box"><strong>Dispenser</strong>${valorRemito(remito, "dispenser")}</div>
        <div class="box"><strong>1/2</strong>${valorRemito(remito, "cMedio")}</div>
        <div class="box"><strong>1/1</strong>${valorRemito(remito, "cUno")}</div>
        <div class="box"><strong>1 1/4</strong>${valorRemito(remito, "cUnoCuarto")}</div>
        <div class="box"><strong>1 1/2</strong>${valorRemito(remito, "cUnoMedio")}</div>
        <div class="box"><strong>8</strong>${valorRemito(remito, "c8")}</div>
        <div class="box"><strong>10</strong>${valorRemito(remito, "c10")}</div>
      </div>

      <p><strong>Observaciones:</strong> ${remito.observaciones || "-"}</p>

      <div class="acciones">
        <button class="btn-editar" onclick="editarRemito('${remito.id}')">Editar</button>
        <button class="btn-eliminar" onclick="eliminarRemito('${remito.id}')">Eliminar</button>
      </div>
    `;

    historialRemitos.appendChild(div);
  });

  if (remitosFiltrados.length > 3 && !hayBusqueda) {
    const boton = document.createElement("button");
    boton.textContent = mostrarTodosLosRemitos
      ? "Mostrar menos"
      : "Mostrar más remitos";

    boton.addEventListener("click", function() {
      mostrarTodosLosRemitos = !mostrarTodosLosRemitos;
      mostrarRemitos();
    });

    historialRemitos.appendChild(boton);
  }
}

function formatearFecha(fecha) {
  if (!fecha) return "-";

  const partes = fecha.split("-");
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

formCliente.addEventListener("submit", function(e) {
  e.preventDefault();

  const nombre = nombreCliente.value.trim();
  const reparto = repartoCliente.value;

  if (nombre === "" || reparto === "") {
    alert("Completá el nombre y el reparto.");
    return;
  }

  const existe = clientes.some(cliente => {
    return (
      cliente.nombre.toLowerCase() === nombre.toLowerCase() &&
      cliente.id !== editandoClienteId
    );
  });

  if (existe) {
    alert("Ese cliente ya está cargado.");
    return;
  }

  if (editandoClienteId) {
    const cliente = clientes.find(c => c.id === editandoClienteId);

    cliente.nombre = nombre;
    cliente.reparto = reparto;

    remitos.forEach(remito => {
      if (remito.clienteId === editandoClienteId) {
        remito.clienteNombre = nombre;
        remito.reparto = reparto;
      }
    });

    editandoClienteId = null;
    formCliente.querySelector("button").textContent = "Guardar cliente";
  } else {
    const nuevoCliente = {
      id: Date.now().toString(),
      nombre,
      reparto
    };

    clientes.push(nuevoCliente);
  }

  guardarDatos();
  actualizarPantalla();
  formCliente.reset();
});

function editarCliente(id) {
  const cliente = clientes.find(c => c.id === id);

  if (!cliente) return;

  editandoClienteId = id;

  nombreCliente.value = cliente.nombre;
  repartoCliente.value = cliente.reparto;

  formCliente.querySelector("button").textContent = "Actualizar cliente";

  window.scrollTo({
    top: formCliente.offsetTop - 20,
    behavior: "smooth"
  });
}

formRemito.addEventListener("submit", function(e) {
  e.preventDefault();

  const clienteId = clienteRemito.value;
  const cliente = clientes.find(c => c.id === clienteId);

  if (!cliente) {
    alert("Seleccioná un cliente.");
    return;
  }

  const numeroIngresado = numeroRemito.value.trim();

  const remitoRepetido = remitos.some(remito => {
    return remito.numero === numeroIngresado && remito.id !== editandoRemitoId;
  });

  if (remitoRepetido) {
    alert("Ya existe un remito con ese número. Revisalo antes de guardarlo.");
    return;
  }

  const datosRemito = {
    id: editandoRemitoId || Date.now().toString(),
    fecha: fechaRemito.value,
    numero: numeroIngresado,
    clienteId: cliente.id,
    clienteNombre: cliente.nombre,
    reparto: cliente.reparto,

    c20: numero(cant20.value),
    c12: numero(cant12.value),
    soda: numero(cantSoda.value),
    dispenser: numero(cantDispenser.value),

    cMedio: numero(cantMedio.value),
    cUno: numero(cantUno.value),
    cUnoCuarto: numero(cantUnoCuarto.value),
    cUnoMedio: numero(cantUnoMedio.value),
    c8: numero(cant8.value),
    c10: numero(cant10.value),

    observaciones: observaciones.value.trim()
  };

  if (editandoRemitoId) {
    const index = remitos.findIndex(r => r.id === editandoRemitoId);
    remitos[index] = datosRemito;
    editandoRemitoId = null;
    btnGuardarRemito.textContent = "Guardar remito";
  } else {
    remitos.push(datosRemito);
  }

  guardarDatos();
  actualizarPantalla();
  formRemito.reset();

  masCategorias.classList.add("oculto");
  btnMasCategorias.textContent = "Mostrar más categorías";
});

function editarRemito(id) {
  const remito = remitos.find(r => r.id === id);

  if (!remito) return;

  editandoRemitoId = id;

  fechaRemito.value = remito.fecha;
  numeroRemito.value = remito.numero;
  clienteRemito.value = remito.clienteId;

  cant20.value = valorRemito(remito, "c20");
  cant12.value = valorRemito(remito, "c12");
  cantSoda.value = valorRemito(remito, "soda");
  cantDispenser.value = valorRemito(remito, "dispenser");

  cantMedio.value = valorRemito(remito, "cMedio");
  cantUno.value = valorRemito(remito, "cUno");
  cantUnoCuarto.value = valorRemito(remito, "cUnoCuarto");
  cantUnoMedio.value = valorRemito(remito, "cUnoMedio");
  cant8.value = valorRemito(remito, "c8");
  cant10.value = valorRemito(remito, "c10");

  observaciones.value = remito.observaciones;

  masCategorias.classList.remove("oculto");
  btnMasCategorias.textContent = "Ocultar más categorías";

  btnGuardarRemito.textContent = "Actualizar remito";

  window.scrollTo({
    top: formRemito.offsetTop - 20,
    behavior: "smooth"
  });
}

function eliminarRemito(id) {
  const confirmar = confirm("¿Seguro que querés eliminar este remito?");

  if (!confirmar) return;

  remitos = remitos.filter(remito => remito.id !== id);

  guardarDatos();
  actualizarPantalla();
}

function eliminarCliente(id) {
  const tieneRemitos = remitos.some(remito => remito.clienteId === id);

  if (tieneRemitos) {
    alert("No podés eliminar este cliente porque tiene remitos cargados.");
    return;
  }

  const confirmar = confirm("¿Seguro que querés eliminar este cliente?");

  if (!confirmar) return;

  clientes = clientes.filter(cliente => cliente.id !== id);

  guardarDatos();
  actualizarPantalla();
}

btnResumen.addEventListener("click", function() {
  const clienteId = resumenCliente.value;
  const desde = fechaDesde.value;
  const hasta = fechaHasta.value;

  if (!clienteId || !desde || !hasta) {
    alert("Seleccioná cliente, fecha desde y fecha hasta.");
    return;
  }

  const cliente = clientes.find(c => c.id === clienteId);

  const remitosResumen = remitos.filter(remito => {
    return (
      remito.clienteId === clienteId &&
      remito.fecha >= desde &&
      remito.fecha <= hasta
    );
  });

  let total20 = 0;
  let total12 = 0;
  let totalSoda = 0;
  let totalDispenser = 0;
  let totalMedio = 0;
  let totalUno = 0;
  let totalUnoCuarto = 0;
  let totalUnoMedio = 0;
  let total8 = 0;
  let total10 = 0;

  remitosResumen.forEach(remito => {
    total20 += valorRemito(remito, "c20");
    total12 += valorRemito(remito, "c12");
    totalSoda += valorRemito(remito, "soda");
    totalDispenser += valorRemito(remito, "dispenser");
    totalMedio += valorRemito(remito, "cMedio");
    totalUno += valorRemito(remito, "cUno");
    totalUnoCuarto += valorRemito(remito, "cUnoCuarto");
    totalUnoMedio += valorRemito(remito, "cUnoMedio");
    total8 += valorRemito(remito, "c8");
    total10 += valorRemito(remito, "c10");
  });

  ultimoResumen = {
    cliente: cliente.nombre,
    reparto: cliente.reparto,
    desde,
    hasta,
    remitos: remitosResumen.length,
    total20,
    total12,
    totalSoda,
    totalDispenser,
    totalMedio,
    totalUno,
    totalUnoCuarto,
    totalUnoMedio,
    total8,
    total10
  };

  resultadoResumen.innerHTML = `
    <div class="resumen">
      <h3>${cliente.nombre}</h3>
      <p><strong>Reparto:</strong> ${cliente.reparto}</p>
      <p><strong>Desde:</strong> ${formatearFecha(desde)} - <strong>Hasta:</strong> ${formatearFecha(hasta)}</p>
      <p><strong>Remitos encontrados:</strong> ${remitosResumen.length}</p>

      <div class="info">
        <div class="box"><strong>20L</strong>${total20}</div>
        <div class="box"><strong>12L</strong>${total12}</div>
        <div class="box"><strong>Soda</strong>${totalSoda}</div>
        <div class="box"><strong>Dispenser</strong>${totalDispenser}</div>
        <div class="box"><strong>1/2</strong>${totalMedio}</div>
        <div class="box"><strong>1/1</strong>${totalUno}</div>
        <div class="box"><strong>1 1/4</strong>${totalUnoCuarto}</div>
        <div class="box"><strong>1 1/2</strong>${totalUnoMedio}</div>
        <div class="box"><strong>8</strong>${total8}</div>
        <div class="box"><strong>10</strong>${total10}</div>
      </div>
    </div>
  `;
});

btnExportarResumen.addEventListener("click", function() {
  if (!ultimoResumen) {
    alert("Primero calculá un resumen.");
    return;
  }

  const filas = [
    [
      "Cliente",
      "Reparto",
      "Desde",
      "Hasta",
      "Remitos",
      "20L",
      "12L",
      "Soda",
      "Dispenser",
      "1/2",
      "1/1",
      "1 1/4",
      "1 1/2",
      "8",
      "10"
    ],
    [
      ultimoResumen.cliente,
      ultimoResumen.reparto,
      formatearFecha(ultimoResumen.desde),
      formatearFecha(ultimoResumen.hasta),
      ultimoResumen.remitos,
      ultimoResumen.total20,
      ultimoResumen.total12,
      ultimoResumen.totalSoda,
      ultimoResumen.totalDispenser,
      ultimoResumen.totalMedio,
      ultimoResumen.totalUno,
      ultimoResumen.totalUnoCuarto,
      ultimoResumen.totalUnoMedio,
      ultimoResumen.total8,
      ultimoResumen.total10
    ]
  ];

  const contenidoCSV = filas.map(fila => fila.join(";")).join("\n");

  const archivo = new Blob([contenidoCSV], {
    type: "text/csv;charset=utf-8;"
  });

  const url = URL.createObjectURL(archivo);

  const nombreArchivo = `resumen-${ultimoResumen.cliente}-${ultimoResumen.desde}-${ultimoResumen.hasta}.csv`
    .replaceAll(" ", "-")
    .toLowerCase();

  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = nombreArchivo;
  enlace.click();

  URL.revokeObjectURL(url);
});

btnExportar.addEventListener("click", function() {
  const datos = {
    clientes,
    remitos
  };

  const archivo = new Blob([JSON.stringify(datos, null, 2)], {
    type: "application/json"
  });

  const url = URL.createObjectURL(archivo);

  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = "backup-remitos.json";
  enlace.click();

  URL.revokeObjectURL(url);
});

inputImportar.addEventListener("change", function(e) {
  const archivo = e.target.files[0];

  if (!archivo) return;

  const lector = new FileReader();

  lector.onload = function(evento) {
    try {
      const datos = JSON.parse(evento.target.result);

      if (!datos.clientes || !datos.remitos) {
        alert("El archivo no es válido.");
        return;
      }

      const confirmar = confirm("Esto reemplazará los datos actuales. ¿Querés continuar?");

      if (!confirmar) return;

      clientes = datos.clientes;
      remitos = datos.remitos;

      guardarDatos();
      actualizarPantalla();

      alert("Backup importado correctamente.");
    } catch (error) {
      alert("No se pudo importar el archivo.");
    }
  };

  lector.readAsText(archivo);
});

btnMasCategorias.addEventListener("click", function() {
  masCategorias.classList.toggle("oculto");

  const estaOculto = masCategorias.classList.contains("oculto");

  btnMasCategorias.textContent = estaOculto
    ? "Mostrar más categorías"
    : "Ocultar más categorías";
});

buscarCliente.addEventListener("input", function() {
  mostrarClientes();
});

filtroRepartoClientes.addEventListener("change", function() {
  mostrarClientes();
});

buscarRemito.addEventListener("input", function() {
  mostrarRemitos();
});

function actualizarPantalla() {
  actualizarSelectsClientes();
  mostrarClientes();
  mostrarRemitos();
}

actualizarPantalla();