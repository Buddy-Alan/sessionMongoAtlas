// const express = require("express")
// const productRouter = express.Router();
// const ContenedorMySql = require("../../peticionBD/bdMySql")
// const dbmysql = require("../../config/dbConfig");
// const contenedorProducts = new ContenedorMySql(dbmysql.MySql, "productos")
import { Router } from "express"
import { faker } from "@faker-js/faker"
const { commerce, image } = faker

const productRouter = Router()


//Si el usuario no existe, no puede acceder al chat y los productos
const checkUser = (req, res, next) => {
    if (req.session.userName) {
        next()
    }
    else {
        res.redirect("/login")
    }
}


//Se utiliza para obtener todos los productos de la BD
productRouter.get("/", checkUser, async (req, res) => {
    try {
        let arrayProd = [];
        for (let i = 0; i < 5; i++) {
            arrayProd.push(
                {
                    title: commerce.product(),
                    price: commerce.price(100, 10000, 0),
                    thumbnail: image.imageUrl()
                }
            )
        }
        res.render('home', { customers: arrayProd, nombre: req.session.userName });
    } catch (error) {
        console.log(error)
    }
})

//Se utiliza para obtener un producto de la BD
//Si la solicitud del producto devuelve 1, significa que el producto NO EXISTE.
productRouter.get("/producto/:id", async (req, res) => {
    id = parseInt(req.params.id)
    try {
        const productoSolicutado = await contenedorProducts.getByID(id)
        console.log(productoSolicutado)
        if (productoSolicutado == 1) {
            res.json({
                message: "El producto solicitado no existe"
            })
        } else {
            res.json({
                message: productoSolicutado
            })
        }
    } catch (error) {
        console.log(error)
    }

})

//Se utiliza para borrar un producto de la BD
//Si el producto a eliminar devuelve 1, significa que el producto NO EXISTE.
productRouter.delete("/producto/:id", async (req, res) => {
    try {
        const idAEliminar = parseInt(req.params.id)
        const producto = await contenedorProducts.deletByID(idAEliminar)
        if (producto == 1) {
            res.json({
                message: "El producto a eliminar no existe"
            })
        } else {
            res.json({
                message: "Producto eliminado con exito"
            })
        }
    } catch (error) {
        console.log(error)
    }
})


//Se utiliza para actualizar UNICAMENTE el precio de un producto de la BD
//Si el producto a actualizar devuelve 1, significa que el producto NO EXISTE.
productRouter.post("/producto/:id", async (req, res) => {
    id = parseInt(req.params.id)
    price = req.body.price
    try {
        if (!isNaN(price)) {
            producto = await contenedorProducts.updateById(id, price)
            if (producto == 1) {
                res.json({
                    message: "El producto a actualizar no existe"
                })
            } else {
                await contenedorProducts.updateById(id, price)
                res.json({
                    message: "Producto actualizado con exito"
                })
            }
        } else {
            res.json({ message: "El precio a actualizar no es numerico" })
        }
    } catch (error) {
        console.log(error)
    }
})



export default productRouter