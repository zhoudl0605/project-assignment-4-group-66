import Router from "koa-router";

const router = new Router({
    prefix: "/auth",
});

router.post("/login", async (ctx) => {
    ctx.body = "Login";
});

router.post("/admin-login", async (ctx) => {
    ctx.body = "Admin Login";
});

router.post("/signup", async (ctx) => {
    ctx.body = "Register";
});

router.post("/logout", async (ctx) => {
    ctx.body = "Logout";
});
