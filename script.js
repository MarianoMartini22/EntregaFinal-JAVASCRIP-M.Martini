for (let i = 0; i < document.querySelectorAll('.carrito').length; i++) {
    const element = document.querySelectorAll('.carrito')[i];
    element.addEventListener("click", onClickComprar);
    function onClickComprar(e) {
        e.preventDefault();
        const titulo = e.target.parentElement.children[0].innerText;
        const descripcion = e.target.parentElement.children[2].innerText;
        const precio = e.target.parentElement.children[3].innerText;
        localStorage.setItem('precioProducto', e.target.parentElement.children[3].innerText.replace('$', ''));
        document.getElementById('shop_container').style.display = 'none';
        document.getElementById('carrito_container').innerHTML = `
            <section>
                <div class="card text-center" style="width: 50rem;">
                    <div class="card-body">
                        <h4>Resumen de compra: </h4>
                        <div style="border: 1px solid black">
                            <h5 class="card-title">${titulo}</h5>
                            <hr>
                            <p class="card-text">${descripcion}</p>
                            <span>${precio}</span>
                        </div>
                        <br>
                        <form id="formCarrito${i}" method="post">
                            <div style="display: flex; flex-direction: column; margin-bottom: 3vh">
                                <label class="form-label">Nombre: </label>
                                <input type="text" class="form-control" name="nombre" placeholder="Ej: Pedro" required/>
                                <label class="form-label">Apellido: </label>
                                <input type="text" class="form-control" name="apellido" placeholder="Ej: Picapiedra" required/>
                                <label class="form-label">Nro.Tarjeta: </label>
                                <input type="number" class="form-control" name="tarjeta" placeholder="Ej: 123456789" required/>
                                <label class="form-label">Mes vencimiento: </label>
                                <input type="text" class="form-control" name="mesVencimiento" placeholder="Ej: 01" required/>
                                <label class="form-label">Año vencimiento: </label>
                                <input type="text" class="form-control" name="anioVencimiento" placeholder="Ej: 23" required/>
                                <label class="form-label">Cod.Tarjeta: </label>
                                <input type="number" class="form-control" name="codTarjeta" placeholder="Ej: 123" required/>
                                <div id="financiamiento">
                                    <label class="form-label">Cantidad de cuotas</label>
                                    <select class="form-select intereses" multiple aria-label="multiple select example" name="cuotas">
                                        <option value="1">1 (0% interes)</option>
                                        <option value="3">3 (15% interes)</option>
                                        <option value="6">6 (25% interes)</option>
                                        <option value="9">9 (35% interes)</option>
                                        <option value="12">12 (45% interes)</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <h6>¿Necesitas financiación?</h6>
                                <span id="spanFinanciamiento" class="badge text-bg-warning mb-3">Monto a financiar: ${precio}</span>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="financiacion" value="si" onclick="financiamiento()" id="opt1">
                                    <label class="form-check-label">Si</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="financiacion" value="no" onclick="ocultarFinanciamiento()" id="opt2" checked>
                                    <label class="form-check-label">No</label>
                                </div>
                            </div>
                            <br>
                            <button type="submit" class="btn btn-success">Finalizar compra</button>
                            <button class="btn btn-danger" onclick="mostrarShop()">Cancelar</button>
                        </form>
                    </div>
                </div>
            </section>
            <style>
                .modal {
                    position: absolute;
                    background-color: lightgray;
                    display: block;
                }
            </style>
        `;
        document.getElementById('financiamiento').style.display = 'none';
        document.getElementById('spanFinanciamiento').style.display = 'none';
        const form  = document.getElementById('formCarrito' + i);
        const compra = {};
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            for (let i = 0; i < form.elements.length; i++) {
                const itemForm = form.elements[i];
                if (itemForm.value) compra[itemForm.name] = itemForm.value;
            }
            //Capturar cantiddad / cuotas
            if (document.getElementById('opt1').checked && compra.cuotas) {
                const precio = +localStorage.getItem('precioProducto');
                Swal.fire({
                    title: '¡Compra realizada con éxito!',
                    html: `
                        <p>Fue un gusto atenderte ${compra.nombre}</p>
                        <br>
                        <p>Monto a pagar mensual: ${dividir(+precio, +compra.cuotas).toFixed(2)}</p>
                    `,
                    icon: 'success',
                    confirmButtonText: 'Salir',
                }).then((confirm) => {
                    if (confirm) {
                        window.location.replace('./eShop.html');
                    }
                })
            } else {
                Swal.fire({
                    title: '¡Compra realizada con éxito!',
                    html: `
                        <p>Fue un gusto atenderte ${compra.nombre}</p>
                    `,
                    icon: 'success',
                    confirmButtonText: 'Salir',
                }).then((confirm) => {
                    if (confirm) {
                        window.location.replace('./eShop.html');
                    }
                })
            }
        });
        const selectIntereses = document.querySelector('.intereses');
        selectIntereses.addEventListener('change', (event) => {
            const financiamientoSpan = document.getElementById('spanFinanciamiento');
            financiamientoSpan.textContent = `Monto a financiar: $${obtenerValorFinanciado(+precio.replace('$', ''), +event.target.value)}`;
        });
    }
}
const intereses = [
    { cuota: 1, interes: 0 },
    { cuota: 3, interes: 15 },
    { cuota: 6, interes: 25 },
    { cuota: 9, interes: 35 },
    { cuota: 12, interes: 45 },
];

localStorage.setItem('intereses', JSON.stringify(intereses));

window.addEventListener('storage', store());

function store() {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
        document.getElementById('usuarioSpan').innerText = '¡Bienvenido ' + usuario + '!';
    }
}

// Formulario login
class Usuario {      
    constructor(user) {
        this.usuario = user.usuario;        
        this.password = user.password;
    }      
    saludar() {        
        return "Hola " + this.usuario + " gracias por ingresar sus datos";
    }
    obtenerUsuario() {
        return this.usuario;
    }
}

const formLogin  = document.getElementById('formLogin');
if (formLogin) {
    const tempUser = {}
    formLogin.addEventListener('submit', (event) => {
        localStorage.removeItem('usuario');
        document.getElementById('usuarioSpan').innerText = '';
        event.preventDefault();
        for (let i = 0; i < formLogin.elements.length; i++) {
            const itemForm = formLogin.elements[i];
            if (itemForm.value) tempUser[itemForm.name] = itemForm.value;
        }
        const user = new Usuario(tempUser);
        localStorage.setItem('usuario', user.obtenerUsuario());
        Swal.fire({
            title: '¡Login realizado con éxito!',
            text: user.saludar(),
            icon: 'success',
            confirmButtonText: 'Ok',
        }).then((confirm) => {
            if (confirm) {
                window.location.replace('../index.html');
            }
        })
    });
}


function mostrarShop() {
    document.getElementById('shop_container').style.display = 'block';
    document.getElementById('carrito_container').innerHTML = '';
}

function financiamiento() {
    document.getElementById('financiamiento').style.display = 'block';
    document.getElementById('spanFinanciamiento').style.display = 'block';
}
function ocultarFinanciamiento() {
    document.getElementById('financiamiento').style.display = 'none';
    document.getElementById('spanFinanciamiento').style.display = 'none';
}

function obtenerValorFinanciado(importe, cuotas) {
    const intereses = JSON.parse(localStorage.getItem('intereses'));
    let precioFinal = 0;

    switch (cuotas) {
        case intereses[0].cuota:
            precioFinal = importe;
            break;
        case intereses[1].cuota:
            precioFinal = ((importe * intereses.find((interes) => interes.cuota === 3).interes) / 100) + importe;
            break;
        case intereses[2].cuota:
            precioFinal = ((importe * intereses.find((interes) => interes.cuota === 6).interes) / 100) + importe;
            break;
        case intereses[3].cuota:
            precioFinal = ((importe * intereses.find((interes) => interes.cuota === 9).interes) / 100) + importe;
            break;
        case intereses[4].cuota:
            precioFinal = ((importe * intereses.find((interes) => interes.cuota === 12).interes) / 100) + importe;
            break;
        default:
            break;
    }
    return precioFinal;
}

//Funcion para dividir cantidad en cuotas
function dividir(dato1, dato2) {
    // Sumo el interes al precio
    let resultado = obtenerValorFinanciado(dato1, dato2) / dato2;
    return resultado
}
