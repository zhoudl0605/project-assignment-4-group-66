import Router from "koa-router";

const router = new Router({
    prefix: "/auth",
});

/**
 * Register the routes for the auth module
 * @response the user's JWT token
 */
router.post("/login", async (ctx) => {
    ctx.body = "Login";

    // get the username and password from the request body
    // const { username, password } = ctx.request.body;
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
