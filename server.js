const express = require("express");
const bcrypt = require("bcryptjs");
const collect = require("./mongoose");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

app.get("/signin", (req, res) => {
    res.render("signup");
});

app.get("/login", (req, res) => {
    res.render("login");
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Appends the original extension to the uploaded file
    }
});
const upload = multer({ storage: storage });
app.post("/signin", async (req, res) => {
    const { role, username, email, tel, password1, password2 } = req.body;

    // Check if passwords match
    if (password1 !== password2) {
        return res.status(400).send("Passwords do not match");
    }

    try {
        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password1, 10);

        const userData = {
            role,
            username,
            email,
            tel,
            password1: hashedPassword
        };

        // Insert the user data into the database
        const user = await collect.insertMany([userData]);
        console.log(user);

        // Render the appropriate view based on the role
        if (userData.role === 'Student') {
            res.render("student");
        } 
         else if (userData.role === 'Admin') {
            res.render("admin");
        }  else if (userData.role === 'Counsellor') {
            res.render("counsel.ejs");
        } else {
            res.status(400).send("Invalid role");
        }
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).send('Error saving data');
    }
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the user by username
        const user = await collect.findOne({ username });

        if (user) {
            // Compare the entered password with the stored hashed password
            const isMatch = await bcrypt.compare(password, user.password1);

            if (isMatch) {
                if (user.role === 'Student') {
                    res.render("student", { user });
                } else if (user.role === 'Counsellor') {
                    res.render("counsel", { user });
                } else if (user.role === 'Admin') {
                    res.render("admin", { user });
                } else {
                    res.status(400).send("Invalid role");
                }
            } else {
                res.status(400).send("Invalid credentials");
            }
        } else {
            res.status(400).send("User not found");
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("Internal Server Error");
    }
});

// app.post("/updateProfile", upload.single('profilePic'), async (req, res) => {
//     const { username, tel, role, accessLevel, responsibility, bio } = req.body;

//     // Check if required fields are filled
//     if (!role || !accessLevel || !responsibility) {
//         return res.status(400).send("All fields are required");
//     }

//     const profilePic = req.file ? `/uploads/${req.file.filename}` : null; 


  
//     try {
//         const updatedUser = await collect.findOneAndUpdate(
//             { username },
//             {tel, role, profilePic, accessLevel, responsibility, bio },
//             { new: true }
//         );

//         if (updatedUser) {
//             res.render("admin", { user: updatedUser });
//         } else {
//             res.status(400).send("User not found");
//         }
//     } catch (error) {
//         console.error("Error updating profile:", error);
//         res.status(500).send("Internal Server Error");
//     }
// });

const port = 4000;
app.listen(port, () => {
    console.log(`The server is running on port ${port}`);
});
