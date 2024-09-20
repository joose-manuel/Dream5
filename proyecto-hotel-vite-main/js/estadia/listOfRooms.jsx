import {hotelApi} from '../api'
import {$, $$} from '../utils/functions'
import {
  cardInfoRoom,
  fillBodyOfTablesConsumed,
  getRowsBodyConsumed,
  headerOfItemAccordion,
  productsOfTableConsumables,
  tableOfAlreadyConsumed,
  tableOfConsumables,
} from '.'
import {format} from 'date-fns'

/* -------------------------------------------------------------------------- */
/*                                 Facturacion                                */
/* -------------------------------------------------------------------------- */

import jsPDF from 'jspdf'
const $roomsInfo = $('#acordion-rooms')
const $btnFactura = $('.btn-facturar-pdf')
$btnFactura.addEventListener('click', (e) => {
  console.log('object')
  const $factura = e.target
    .closest('#modalFactura')
    .querySelector('.modal-body')
  const doc = new jsPDF('p', 'pt', 'a4')
  doc.setFont('Segoe UI Emoji')
  doc.html($factura, {
    x: 10,
    y: 10,
    html2canvas: {
      scale: 0.5,
    },
    callback: (doc) => {
      const totalPages = doc.internal.getNumberOfPages()

      // Elimina todas las páginas excepto la primera
      for (let i = totalPages; i > 1; i--) {
        doc.deletePage(i)
      }
      doc.output('dataurlnewwindow', {filename: 'factura.pdf'})
    },
  })
})

// Productos monibar
const reFillProductsMinibar = ({
  $bodyTableMinibar,
  productsMinibar,
  registerId,
}) => {
  $bodyTableMinibar.innerHTML = ''
  $bodyTableMinibar.innerHTML = productsOfTableConsumables({
    products: productsMinibar,
    registerId,
  })
  addConsumablesToRegister()
}

// Consumibles a registro
const addConsumable = async (e = event) => {
  const $productRow = e.currentTarget.closest('.product-row')
  const $cardBody = e.currentTarget.closest('.card-body')

  const $footer = $cardBody.nextElementSibling
  const $inputAmount = $footer.querySelector('.form-control')

  const productId = Number($productRow.id)
  const registerId = Number(e.currentTarget.id)
  const amount = Number($inputAmount.value)
  const roomNumber = Number($cardBody.id)

  if (registerId) {
    await hotelApi.post('registers/add-consumable', {
      productId,
      registerId,
      amount,
    })

    const $table = $(`#table-consumed-${registerId}`)
    const resProductsConsumed = await hotelApi.get(
      `registers/${registerId}/products`,
    )

    const productsConsumed = resProductsConsumed.data.data.register.products
    getRowsBodyConsumed({products: productsConsumed, $table})

    const $bodyTableMinibar = $(`#body-consumables-${roomNumber}`)
    const resProductsminibar = await hotelApi.get(
      `rooms/${roomNumber}/consumables`,
    )
    const productsMinibar = resProductsminibar.data.data.room.products
    reFillProductsMinibar({productsMinibar, $bodyTableMinibar, registerId})
    addConsumablesToRegister()
  }
}

function addConsumablesToRegister() {
  const $btnAddConsumables = $$('.btn-add-consumable-checkIn')
  console.log(
    '🚀 ~ file: listOfRooms.jsx:73 ~ addConsumablesToRegister ~ $btnAddConsumables:',
    $btnAddConsumables,
  )
  $btnAddConsumables.forEach((el) => {
    el.addEventListener('click', addConsumable)
  })
}

const productsHandlerAbastecer = async (e = event) => {
  const $roomNumber = $('#modal-room')
  const $registerNumber = $('#modal-register')
  const registerId = Number(e.target.dataset.register)

  $roomNumber.innerHTML = `<span class='badge text-bg-danger'> ${Number(
    e.target.id,
  )} </span>`

  $registerNumber.innerHTML = registerId || ''
  loadProdudtcs(e)
}

// Products
const loadProdudtcs = async (e) => {
  const $tableBodyProducts = document.querySelector('#body-products')
  const resProducts = await hotelApi.get('products', {
    params: {
      limit: 10000000,
    },
  })
  const products = resProducts.data.data.products

  $tableBodyProducts.innerHTML = ''
  products.forEach((itemProduct) => {
    const $tr = document.createElement('tr')
    $tr.id = itemProduct.id
    $tr.innerHTML = /*html*/ `
      <td>${itemProduct.name}</td>
      <td>${itemProduct.price}</td>
      <td class="">
        <button
          id="btn-edit-product"
          type="button"
          class="btn btn-primary btn-add-consumable-checkIn btn-product-form"
          style="
            --bs-btn-padding-y: 0.25rem;
            --bs-btn-padding-x: 0.5rem;
            --bs-btn-font-size: 0.75rem;">
            editar
        </button>

        <button
          id="btn-delete-products"
          type="button"
          class="btn  btn-danger btn-add-consumable-checkIn btn-product-form"
          style="
            --bs-btn-padding-y: 0.25rem;
            --bs-btn-padding-x: 0.5rem;
            --bs-btn-font-size: 0.70rem;
          "
          >
            eliminar
        </button>

        <button
          id="btn-add-products-minibar"
          type="button"
          class="btn btn-success btn-add-consumable-checkIn btn-product-form"
          style="
            --bs-btn-padding-y: 0.25rem;
            --bs-btn-padding-x: 0.5rem;
            --bs-btn-font-size: 0.70rem;
          "
          >
          agregar
        </button>
      </td>
    `
    $tableBodyProducts.appendChild($tr)
  })

  const $btnsEditProduct = $$('#btn-edit-product')
  const $btnsDeleteProduct = $$('#btn-delete-products')
  const $btnsAddProductMinibar = $$('#btn-add-products-minibar')
  const $btnAgregarProduct = $('#btn-add-product')

  $btnsDeleteProduct.forEach((item) =>
    item.addEventListener('click', deleteProduct),
  )

  $btnsEditProduct.forEach((item) =>
    item.addEventListener('click', updateProduct),
  )

  $btnsAddProductMinibar.forEach((item) =>
    item.addEventListener('click', addProductMinibar),
  )
  // $btnAgregarProduct.dataset.roomNumber = e.target.id;
  $btnAgregarProduct.addEventListener('click', addProduct)
}

const addProduct = async (e = event) => {
  const $form = $('#form-products')
  const {amount, ...data} = Object.fromEntries(new FormData($form))
  await hotelApi.post('products', {...data, type: 'consumable'})
  loadProdudtcs()
}

// PRODUCTOS A MINIBAR
const addProductMinibar = async (e = event) => {
  // const amount = $("#amountProduct").value;
  const roomNumber = Number($('#modal-room').textContent)
  const productId = Number(e.target.closest('tr').id)
  const registerNumber = Number($('#modal-register').textContent)

  await hotelApi.post(`rooms/add-consumable`, {
    productId,
    roomNumber,
    // amount,
  })

  const $bodyTableMinibar = $(`#body-consumables-${roomNumber}`)
  const res = await hotelApi.get(`rooms/${roomNumber}/consumables`)
  const productsMinibar = res.data.data.room.products

  reFillProductsMinibar({
    productsMinibar,
    registerId: registerNumber,
    $bodyTableMinibar,
  })
  addConsumablesToRegister()
}

const deleteProduct = async (e = event) => {
  const $curretnRow = e.target.closest('tr')
  const idPorduct = Number($curretnRow.id)
  await hotelApi.delete(`products/${idPorduct}`)
  loadProdudtcs()
}

const updateProduct = (e = event) => {
  const $currenteRow = e.target.closest('tr')
  const $cols = $currenteRow.querySelectorAll('td')
  const colName = $cols[0].innerText
  const colPrice = $cols[1].innerText
  $cols[0].innerHTML = /*html*/ `
    <td>
      <input class="form-control" style="width: 120px; margin:0px; padding: 3px;" value="${colName}" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
    </td>
  `

  $cols[1].innerHTML = /*html*/ `
    <td>
      <input  type="number" class="form-control" style="width: 70px; margin:0px; padding: 3px;"  value="${colPrice}"  aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"/>
    </td>
  `

  $$('.btn-product-form').forEach((itemBtn) => (itemBtn.disabled = true))

  $cols[2].innerHTML = /*html*/ `
    <button
    id="btn-edit-save-product"
    type="button"
    class="btn btn-primary btn-add-consumable-checkIn"
    style="
      --bs-btn-padding-y: 0.25rem;
      --bs-btn-padding-x: 0.5rem;
      --bs-btn-font-size: 0.75rem;">
      guardar cambios
    </button>
  `

  const $btnSaveProduct = $('#btn-edit-save-product')
  $btnSaveProduct.addEventListener('click', async (e = event) => {
    const $currenteRowSave = e.target.closest('tr')
    const $colsSave = $currenteRowSave.querySelectorAll('td')
    const idPorduct = Number($currenteRowSave.id)
    const colNameSave = $colsSave[0].querySelector('input').value
    const colPriceSave = $colsSave[1].querySelector('input').value
    await hotelApi.put(`/products/${idPorduct}`, {
      name: colNameSave,
      price: colPriceSave,
    })
    loadProdudtcs()
    const roomNumber = Number($('#modal-room').textContent)
    const res = await hotelApi.get(`rooms/${roomNumber}/consumables`)
    const registerId = Number($('#modal-register').textContent)
    const productsMinibar = res.data.data.room.products
    const $bodyTableMinibar = $(`#body-consumables-${roomNumber}`)

    reFillProductsMinibar({productsMinibar, registerId, $bodyTableMinibar})
    addConsumablesToRegister()
  })
}

const btnPorducts = () => {
  const $btnsProducts = $$('.btn-abastecer')
  $btnsProducts.forEach((item) =>
    item.addEventListener('click', productsHandlerAbastecer),
  )
}

const buildTbodyPayments = () => {
  const tBodysPayments = $$('.tbody-payments')

  tBodysPayments.forEach((tbody) => (tbody.innerHTML = ''))
  // Recorre los bodyb de tables
  tBodysPayments.forEach(async (itemTBody) => {
    const idRegister = Number(itemTBody.dataset.register)
    const res = await hotelApi.get(`/registers/${idRegister}/payments`)
    const payments = res.data.data.register.payments

    // Recorre las cols de las tables
    payments.forEach((paymentItem) => {
      const $tr = document.createElement('tr')
      $tr.innerHTML = /*html*/ `
        <tr>
          <td>${paymentItem.amount}</td>
          <td>${paymentItem.method}</td>
          <td>${format(new Date(paymentItem.createdAt), 'MM/dd/yyyy')}</td>
        </tr>
      `
      itemTBody.appendChild($tr)
    })
  })
}

const tablePayments = ({registerId}) => {
  const table = /*html*/ `
    <div class="card shadow-lg ">
      <div class="card-header">
        Abonos del huesped
      </div>
      <div class="card-body table-min-h overflow-y-scroll">
        <table class="table">
          <thead>
            <tr>
              <th>cantidad</th>
              <th>metodo</th>
              <th>fecha</th>
            </tr>
          </thead>
          <tbody data-register="${registerId}"  class="tbody-payments">
          </tbody>
        </table>
      </div>

      <div class="card-footer text-muted">
        <div class="row">
          <div class="col-md-6">
            <label class="form-label">tipo pago</label>
            <select   class="form-select method-payment">
              <option value="efectivo">efectivo</option>
              <option value="debito">debito</option>
              <option value="credito">credito</option>
            </select>
          </div>

          <div class="col-md-6">
            <label class="form-label">cantidad</label>
            <input class="form-control amoun-payment" type="number" />
          </div>

          <div class="col-md-12 mt-3 ">
              <button
                  type="button"
                  class="btn btn-success w-100 btn-table-add-payment"
                  style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;"
                >
                agregar  abono
              </button>
          </div>
        </div>
      </div>
    </div>
  `

  return table
}

async function addPayment(e = event) {
  const $btnAddPayment = e.target
  const $cardTable = $btnAddPayment.closest('.card')
  const $acordionBody = $btnAddPayment.closest('.accordion-body')

  const registerId = Number(
    $acordionBody.querySelector('.btn-abastecer').dataset.register,
  )

  const amount = Number($cardTable.querySelector('.amoun-payment').value)
  const method = $cardTable.querySelector('.method-payment').value

  const resPayment = await hotelApi.post(`registers/add-payment`, {
    registerId,
    amount,
    method,
  })

  console.log(
    '🚀 ~ file: listOfRooms.jsx:389 ~ addPayment ~ resPayment:',
    resPayment,
  )

  buildTbodyPayments()
}

function addPaymentBtn() {
  const $btnAddPayments = $$('.btn-table-add-payment')
  $btnAddPayments.forEach((itemBtn) => {
    itemBtn.addEventListener('click', addPayment)
  })
}

const cardBill = ({registerId}) => {
  return /*html*/ `
    <div class="card shadow-lg p-3">
      <h3>comprobante de pago</h3>
      <p>
        verificar total a pagar
        <br />
        total por reserva, por consumos,  abonos y facturar
      </p>
      <button
        type="button"
        class="btn btn-success btn-factura"
        data-registerId ="${registerId}"
        data-bs-toggle="modal"
        data-bs-target="#modalFactura"
        style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;">
        comprobar
      </button>
    </div>
  `
}

const loadBill = async ({$element, registerId}) => {
  const resRegister = await hotelApi.get(`registers/${registerId}`)
  const register = resRegister.data.data.register

  const registerRate =
    register.priceSelected === 'ejecutivo'
      ? register.executivePrice
      : register.regularPrice

  const registerRateName = register.priceSelected || 'Regular'

  const numberGuestsByRoom = register.companions.length + 1
  const totalProducts = register.products.reduce(
    (acc, {RegisterProduct: el}) => acc + el.total,
    0,
  )

  const days = register.daysReserved
  const priceRoom = register.reservation.priceRoom

  let totalStay = days * registerRate * numberGuestsByRoom
  let totalBrute = totalStay + totalProducts
  let discount = register.discount

  if (discount > 0) {
    discount = (discount / 100) * totalStay
  }

  $element.innerHTML = /*html*/ `
    <div class="table-responsive p-2  col-md-12 mb-3">
      <table class="table" id="dataTable" >
        <thead>
          <tr>
            <th>Cant.</th>
            <th>Descripcion</th>
            <th>Valor unitario</th>
            <th>Val Total</th>
          </tr>
        </thead>
        <tbody id="table-body-reservations">
          <tr>
            <td>${register.daysReserved}</td>
            <td>Estadia</td>
            <td>$${registerRate}</td>
            <td>$${totalStay.toLocaleString('en')}</td>
          </tr>

          ${register.products
            .map((product) => {
              return /*html*/ `
                <tr>
                  <td>${product.RegisterProduct.amount}</td>
                  <td>${product.name}</td>
                  <td>$${product.RegisterProduct.price.toLocaleString(
                    'en',
                  )}</td>
                  <td>$${product.RegisterProduct.total.toLocaleString(
                    'en',
                  )}</td>
                </tr>
              `
            })
            .join('')}
      
        </tbody>
      </table>


      <table>
        <tbody>
          <tr>
            <hr />
              <th>Total consumibles : </th>
              <td>$${totalProducts.toLocaleString('en')}</td>
            </tr>  

            <tr>  
              <th>Total bruto : </th>
              <td>$${totalBrute.toLocaleString('en')}</td>
            </tr>  

            <tr>
              <th>Total neto : </th>
            <td>$${(totalBrute - discount).toLocaleString('en')}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `
}

const loadStayData = async ({$element, registerId}) => {
  const resRegister = await hotelApi.get(`registers/${registerId}`)
  const register = resRegister.data.data.register
  const guestsRoom = register.companions.length + 1

  const registerRate =
    register.priceSelected === 'ejecutivo'
      ? register.executivePrice
      : register.regularPrice

  const registerRateName = register.priceSelected || 'Regular'
  console.log(
    '🚀 ~ file: listOfRooms.jsx:529 ~ loadStayData ~ registerRateName:',
    registerRateName,
  )
  const discount = register.discount || 0

  $element.innerHTML = /*html*/ `
    Cantidad noches: ${register.daysReserved}
    <br />
    Ocupantes: ${guestsRoom}

    <br />  
    Tarifa: $${registerRate.toLocaleString('en')} | ${registerRateName}
    <br />
    Descuento: %${discount}
  `
}

const loadGuestData = async ({$element, registerId}) => {
  const resRegister = await hotelApi.get(`registers/${registerId}`)
  const register = resRegister.data.data.register

  const host = register.reservation.host

  $element.innerHTML = /*html*/ `
    nombre: ${host.name} 
    <br />
    telefono: ${host.numberPhone}
    <br />
    email: ${host.email}
    <br />
    documentio: ${host.document}
    <br />
    telefono: ${host.numberPhone}
    <br />
  `
}

const loadPayments = async ({$element: $paymentsData, registerId}) => {
  const resRegister = await hotelApi.get(`registers/${registerId}`)
  const register = resRegister.data.data.register
  const payments = register.payments

  const totalpayments = payments.reduce(
    (acc, payment) => acc + payment.amount,
    0,
  )

  $paymentsData.innerHTML = /*html*/ `
    <div class="table-responsive p-2  col-md-12">
      <table class="table" id="dataTable">
        <thead>
          <tr>
            <th>Dinero</th>
            <th>Metodo</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody id="table-body-reservations">
          ${payments
            .map((payment) => {
              return /*html*/ `
                <tr>
                  <td>$${payment.amount.toLocaleString('en')}</td>
                  <td>${payment.method}</td>
                  <td>${payment.createdAt.split('T').shift()}</td>
                </tr>
              `
            })
            .join('')}
          <tr>
            <th>
              total:
            </th>
            <td>
              $${totalpayments.toLocaleString('en')}
            </td>
          </tr>  
        </tbody>
      </table>
    </div>
  `
}

const getBill = () => {
  const $$btnsBill = $$('.btn-factura')
  const $modalBill = $('#modalFactura')
  const $registerIdModal = $('#modal-register-factura')
  const $guesData = $modalBill.querySelector('.datos-huesped')
  const $stayData = $modalBill.querySelector('.datos-estadia')
  const $billData = $modalBill.querySelector('.datos-factura')
  const $paymentsData = $modalBill.querySelector('.datos-abonos')
  $$btnsBill.forEach((itemBtn) => {
    itemBtn.addEventListener('click', async (e = event) => {
      const registerId = parseInt(e.target.dataset.registerid)
      $registerIdModal.textContent = registerId
      await loadBill({$element: $billData, registerId})
      await loadStayData({$element: $stayData, registerId})
      await loadGuestData({$element: $guesData, registerId})
      await loadPayments({$element: $paymentsData, registerId})
    })
  })
}

const editTarifaAndDiscount = () => {
  const selectTarifas = $$('.tarifas-select')
  const inputDiscount = $$('.discount')

  selectTarifas.forEach(async (el) => {
    const $body = el.closest('.accordion-body')
    const $btnRegisterId = $body.querySelector('.btn-abastecer')
    const registerId = parseInt($btnRegisterId.dataset.register)

    el.addEventListener('change', async () => {
      console.log('editar tarifa evento activadoooooooooooooooooooooooo')
      const tarifa = el.value
      const resRateEdited = await hotelApi.put(`registers/${registerId}`, {
        priceSelected: tarifa,
      })
      console.log({resRateEdited})
      console.log({registerId})
    })
  })

  inputDiscount.forEach(async (el) => {
    const $body = el.closest('.accordion-body')
    const $btnRegisterId = $body.querySelector('.btn-abastecer')
    const registerId = parseInt($btnRegisterId.dataset.register)

    if (registerId) {
      const resRegister = await hotelApi.get(`registers/${registerId}`)
      const register = resRegister.data.data.register
      el.value = register.discount
    }

    el.addEventListener('input', async () => {
      const registerId = parseInt($btnRegisterId.dataset.register)
      const discount = parseInt(el.value)
      console.log(
        '🚀 ~ file: listOfRooms.jsx:617 ~ el.addEventListener ~ discount:',
        discount,
      )

      await hotelApi.put(`registers/${registerId}`, {
        discount,
      })
    })
  })
}

const listOfRooms = async () => {
  const resRooms = await hotelApi.get('rooms')
  const {rooms} = resRooms.data.data

  const roomsPromise = rooms.map(async (room) => {
    let $itemRoomInfo = document.createElement('div')
    $itemRoomInfo.classList.add('accordion-item')
    const resConsumables = await hotelApi.get(
      `rooms/${room.number}/consumables`,
    )
    const {products} = resConsumables.data.data.room
    const {reservations} = room
    const [reservation] = reservations
    const missingRegister = /*html*/ `<span class="badge text-bg-danger rounded-pill">sin checkin</span>`
    $itemRoomInfo.innerHTML = /*html*/ `
      <div id="acordion-id-${room.number}" class="accordion-item">
        <!-- header --> 
        ${headerOfItemAccordion({...room})}
        <div
          id="panelsStayOpen-${room.number}"
          class="accordion-collapse collapse show"
          aria-labelledby="panelsStayOpen-${room.number}"
        >
          <div class="accordion-body">
            ${cardInfoRoom({...room})}
            <div class="row">

              <!-- tabla de consumibles --> 
              <div class="col-lg-5 mb-4" id="table-consumables-${room.number}">
                ${tableOfConsumables({
                  products,
                  roomNumber: room.number,
                  reservation,
                })}
              </div>

              <!-- tabla de consumidos por cliente -->
              <div class="col-lg-7" id="table-consumed-${room.number}">
                ${
                  !reservation?.register
                    ? missingRegister
                    : tableOfAlreadyConsumed({
                        reservation,
                        registerId: reservation.register.id,
                      })
                }
              </div>

              <!-- tabla de abonos -->
              <div class="col-lg-7">
                ${
                  !reservation?.register
                    ? ''
                    : tablePayments({registerId: reservation?.register?.id})
                }
              </div>

              <div class="col-lg-5">
                ${
                  !reservation?.register
                    ? ''
                    : cardBill({registerId: reservation?.register?.id})
                }
              </div>

            </div>
          </div>
        </div>
      </div>
    `
    $roomsInfo.appendChild($itemRoomInfo)
  })

  await Promise.all(roomsPromise)
  btnPorducts()
  buildTbodyPayments()
  fillBodyOfTablesConsumed()
  addConsumablesToRegister()
  addPaymentBtn()
  getBill()
  editTarifaAndDiscount()
}

document.addEventListener('DOMContentLoaded', listOfRooms)
