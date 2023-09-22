import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const AuthMiddleware = async (req, res, next) => {
    const token = req.get('Authorization');
    if(!token){
        res.status(401).json({
            errors: "Unauthorized"
        }).end();
    } else{
        const user = await prisma.user.findFirst({
            where: {
                token : token
            }
        });
        if (!user){
            res.status(401).json({
                errors: "Unauthorized"
            }).end();
        } else {
            req.user = user;
            next();
        }
    }
}

export { AuthMiddleware };