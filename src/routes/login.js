import { Router } from "express";
const login = Router()

const checkUser = (req, res, next) => {
    if (req.session.userName) {
        next()
    }
    else {
        res.redirect("/login")
    }
}
const checkSesion = (req, res, next) => {
    if (!req.session.userName) {
        next()
    } else {
        res.redirect("/")
    }
}

login.get("/login", checkSesion, (req, res) => {
    res.render('formLogin')
})

login.post("/perfil", async (req, res) => {
    const { name, email, apellido } = req.body
    req.session.userName = name
    req.session.email = email
    req.session.apellido = apellido
    res.redirect("/")
})


login.get("/logout", checkUser, async (req, res) => {
    res.render("logout", { nombreUsuario: req.session.userName })
})

login.post("/logout", checkUser, async (req, res) => {
    req.session.destroy()
})
export default login
