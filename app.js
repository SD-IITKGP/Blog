//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const lodash = require("lodash");
const ejs = require("ejs");
const app = express();
mongoose.set("strictQuery", true);
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect(
  "mongodb+srv://sourabhchoudhary:"+process.env.PASS+"@cluster0.hch1sgl.mongodb.net/postDB",
  { useNewUrlParser: true }
);
const homeStartingContent =
  "This is my personal Blog. I will be posting my thoughts regularly using this page. Hope u like it!! I have tried to keep this site as simple and sleek as possible as I wanted to keep it exclusively for sharing my thoughts without publishing any unwanted things:).";
const aboutContent =
  "My name is Sourabh Choudhary. I am a third year undergraduate student at IIT Kharagpur. To know more about please have a look at my website sourabhchoudhary.live by clicking on the link at the fotter of this website. Also any of the posts on this websites are just my point of views, it does not targets or points to any individual or organisation.";
const contactContent =
  "For contacting me you can reach me out at my email - contact@sourabhchoudhary.live. Also if you have any suggestion, feel free to reach out to me at this email, I will try to reach out to u as soon as possible. :)";
const postSchema = mongoose.Schema({
  title: String,
  body: String,
});
const Post = mongoose.model("Post", postSchema);
app.get("/", function (req, res) {
  Post.find({}, function (err, posts) {
    if (err) {
      console.log(err);
    } else {
      res.render("home", {
        homeStartingContent: homeStartingContent,
        posts: posts,
      });
    }
  });
});
app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});
app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});
app.get("/compose", function (req, res) {
  res.render("compose");
});
app.get("/posts/:type", function (req, res) {
  Post.find({}, function (err, posts) {
    if (err) {
      console.log(err);
    } else {
      if (posts.length > 0) {
        posts.forEach(function (post) {
          if (
            lodash.lowerCase(post.title) === lodash.lowerCase(req.params.type)
          ) {
            // console.log(post.title);
            res.render("post", { postIn: post });
          }
          //  else {
          //   res.render("post", {
          //     post: { title: "Error: 404", body: "Not Found :(" },
          //   });
          // }
        });
      } else {
        res.render("post", {
          post: { title: "Error: 404", body: "Not Found :(" },
        });
      }
    }
  });
});
app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.composeTitle,
    body: req.body.composeText,
  });
  post.save();
  res.redirect("/");
});
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
