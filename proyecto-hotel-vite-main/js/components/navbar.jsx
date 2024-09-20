import { hotelApi } from '../api'
import { $ } from '../utils/functions'
const $navbar = $('#navbar')

$navbar.innerHTML = /*html*/ `
    <a  class="bx  toggle-sidebar d-none"></a>
    <h5>Dream 5 App</h5>
    <img  src="./public/img/logo_hotel-removebg-preview.png" width="60px" />
    <form action="#"></form>
    <span class="divider"></span>
    <div class="profile">
        <img
        src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cGVvcGxlfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        alt=""
        />
        <ul class="profile-link">
            <li>
                <a href="login.html" id="logOut"><i class="bx bxs-log-out-circle"></i>Logout</a>
            </li>
        </ul>
    </div>
`
const $logOut = $('#logOut')

$logOut.addEventListener('click', (e) => {
    e.preventDefault()
    assistanceLogOut();
    vaciar();
    const url = e.target.href
    window.location.href = url
    delete hotelApi.defaults.headers['Authorization']
})

const assistanceLogOut = async () => {
    const id = localStorage.getItem("assistanceId");
    const now = new Date();
    const logoutDate = now.toISOString();
    const dataAssistance = {logoutDate};
    try {
        const response = await hotelApi.put(`assistance/${id}`, dataAssistance);
        if (response.status === 200) {
            alert("parece ser que funionó");
        } else {
            console.log("Hubo un error al cerrar sesion");
        }
    } catch (error) {
        console.error("No es posible cerrar sesion en este momento: "+error);
    }
}

function vaciar(){
    localStorage.removeItem("assistanceId");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
}