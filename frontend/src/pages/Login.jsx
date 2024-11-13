import Form from "../components/Form.jsx";

function Login() {
    // change route to /api/token/initiate_login/
    return <Form route="/api/token/initiate_login/" method="login"/>
}

export default Login