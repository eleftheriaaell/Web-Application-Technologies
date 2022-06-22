const express = require('express');
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

const db = require('./models');

/* Routers */
const postRouter = require("./routes/Posts");
app.use("/posts", postRouter);

const bidsRouter = require("./routes/Bids");
app.use("/bids",  bidsRouter);

const UsersRouter = require("./routes/Users");
app.use("/auth", UsersRouter);

const AdminRouter = require("./routes/Admin");
app.use("/admin", AdminRouter);

const SentRouter = require("./routes/Sent");
app.use("/sent", SentRouter);

const InboxRouter = require("./routes/Inbox");
app.use("/inbox", InboxRouter);

const CategoriesRouter = require("./routes/Categories");
app.use("/category", CategoriesRouter);

const ActionsRouter = require("./routes/Actions");
app.use("/action", ActionsRouter);

db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log("Server running on port 3001.")
    });
});
