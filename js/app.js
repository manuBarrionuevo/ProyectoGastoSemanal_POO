//Variables y selectores
const formulario = document.querySelector('#agregar-gasto')
const gastoListado = document.querySelector('#gastos ul')


//Eventos

eventListeners()
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto)
    formulario.addEventListener('submit', agregarGastos)
}


//Clases
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto)
        this.restante = Number(presupuesto)
        this.gastos = []
    }

    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto]

        this.calcularRestante()
    }

    calcularRestante() {
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0)

        this.restante = this.presupuesto - gastado
        
    }
    eliminarGastos(id) {
        this.gastos = this.gastos.filter(gasto => gasto.id !== id)

        this.calcularRestante()
    }
}

class UI {
    insertarPresupuesto(cantidad) {
        //Extrayendo el valor
        const { presupuesto, restante } = cantidad

        //Agregando al HTML
        document.querySelector('#total').textContent = presupuesto
        document.querySelector('#restante').textContent = restante

    }

    imprimirAlerta(mensaje, tipo) {
        //crear el div
        const divMensaje = document.createElement('div')
        divMensaje.classList.add('text-center', 'alert')

        if (tipo === 'error') {
            divMensaje.classList.add('alert-danger')
        } else {
            divMensaje.classList.add('alert-success')
        }

        divMensaje.textContent = mensaje

        //insertar en HTML

        document.querySelector('.primario').insertBefore(divMensaje, formulario)

        //quitar del HTMl

        setTimeout(() => {
            divMensaje.remove()
        }, 3000)

    }

    mostrarGastos(gastos) {

        this.limpiarHTML()//Elimina el HTML previo

        //Iterar sobre los gastos

        gastos.forEach((gasto) => {
            const { cantidad, nombre, id } = gasto

            //crear un Li
            const nuevoGasto = document.createElement('li')
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center'

            nuevoGasto.dataset.id = id


            //Agregar el HTLm del gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill">$ ${cantidad} </span>
            
            `

            //Boton para Borrar el gasto
            const btnBorrar = document.createElement('button')
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto')
            btnBorrar.innerHTML = 'Borrar &times'//&times es una entidad html(x) se usa con innerHtML
            btnBorrar.onclick = () => {
                eliminarGastos(id)
            }
            nuevoGasto.appendChild(btnBorrar)


            //Agregar el HTML
            gastoListado.appendChild(nuevoGasto)

        })
    }

    limpiarHTML() {
        while (gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild)
        }
    }
    actualizarRestante(restante) {
        document.querySelector('#restante').textContent = restante
    }

    comprobarPresupuesto(presupuestObj) {
        const { presupuesto, restante } = presupuestObj

        const restanteDiv = document.querySelector('.restante')

        //comprobar %25

        if ((presupuesto / 4) > restante) {
            restanteDiv.classList.remove('alert-success', 'alert-warning')
            restanteDiv.classList.add('alert-danger')

        } else if ((presupuesto / 2) > restante) {
            restanteDiv.classList.remove('alert-success')
            restanteDiv.classList.add('alert-warning')
        }else{
            restanteDiv.classList.remove('alert-danger','alert-warning')
            restanteDiv.classList.add('alert-success')
        }

        //si el total es 0 o menor
        if (restante <= 0) {
            ui.imprimirAlerta('El presupuesto se ha agotado', 'error')
            formulario.querySelector('button[type="submit"]').disabled = true
        }
    }
}



//Instanciar
const ui = new UI()
let presupuesto



//Funciones
function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('Cual es tu presupuesto')


    if (presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
        window.location.reload()
    }

    presupuesto = new Presupuesto(presupuestoUsuario)

    ui.insertarPresupuesto(presupuesto)
}



//Añade gastos
function agregarGastos(e) {
    e.preventDefault()

    //leer los datos del formulario    
    const nombre = document.querySelector('#gasto').value
    const cantidad = Number(document.querySelector('#cantidad').value)

    //Validar
    if (nombre === '' || cantidad === '') {
        ui.imprimirAlerta('Ambos Campos son Obligatorios', 'error')
        return
    } else if (cantidad <= 0 || isNaN(cantidad)) {
        ui.imprimirAlerta('Cantidad no Validad', 'error')
        return
    }
    //Generar un objeto con el gasto
    const gasto = { nombre, cantidad, id: Date.now() }

    //Añade un nuevo gasto
    presupuesto.nuevoGasto(gasto)

    //Mensaje de carga correcta
    ui.imprimirAlerta('Gasto agregado Correctamente')

    //imprimir los gastos
    const { gastos, restante } = presupuesto
    ui.mostrarGastos(gastos)

    ui.actualizarRestante(restante)

    ui.comprobarPresupuesto(presupuesto)

    //Reiniciar Formulario
    formulario.reset()

}

function eliminarGastos(id) {

    //Elimina del objeto
    presupuesto.eliminarGastos(id)

    //eliminar los gastos del html
    const { gastos,restante } = presupuesto
    ui.mostrarGastos(gastos)
    ui.actualizarRestante(restante)
    ui.comprobarPresupuesto(presupuesto)
    
}