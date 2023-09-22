import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid"

const prisma = new PrismaClient();

const register = async (req, res) => {
    const { name, username, password, confirmPassword } = req.body;

    const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/;
    if (!password.match(passwordRegex)) {
        return res.status(400).json({ msg: "Password harus minimal 8 karakter dan mengandung huruf dan angka" });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ msg: "Konfirmasi password tidak cocok" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await prisma.user.findUnique({
        where: {
            username: username
        }
    });
    if (existingUser) {
        return res.status(400).json({ msg: "username sudah digunakan" });
    }

    try {
        const newUser = await prisma.user.create({
            data: {
                name: name,
                username: username,
                password: hashedPassword
            }
        });

        res.status(200).json(newUser);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        });
        if (!user) {
            return res.status(401).json({ msg: "Username atau password salah" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(401).json({ msg: "Password not match" })
        }

        const token = uuid().toString();
        await prisma.user.update({
            data: {
                token: token
            },
            where: {
                username: user.username
            }
        });

        res.status(200).json({ token: token });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

const getUser = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                name: true,
                username: true
            }
        });

        if (users.length === 0) {
            return res.status(404).json({ msg: "User tidak ditemukan" });
        }

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}


const updateUser = async (req, res) => {
    try {
        const { name, password } = req.body;

        const existingUser = await prisma.user.findFirst({
            where: {
                username: req.params.username
            }
        })

        if (!existingUser) {
            return res.status(404).json({ msg: "username not found" })
        }

        const updateData = {};

        if (name) {
            updateData.name = name;
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        const user = await prisma.user.update({
            where: {
                username: req.params.username
            },
            data: updateData,
            select: {
                name: true,
                username: true
            }
        });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

const logout = async (req, res) => {
    try {
        const { token } = req.body;

        const existingUser = await prisma.user.findFirst({
            where: {
                token: token
            }
        });

        if (!existingUser) {
            return res.status(404).json({ msg: "Token tidak valid atau pengguna tidak ditemukan" });
        }

        // Hapus token dari pengguna untuk melakukan logout
        await prisma.user.update({
            where: {
                username: existingUser.username
            },
            data: {
                token: null
            }
        });

        res.status(200).json({ msg: "Logout berhasil" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}



export { register, login, getUser, updateUser, logout };