//delete user data
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function POST(req: Request, res: Response) {
    try {
        if (req.method !== "POST") {
        // return new NextResponse("Method Not Allowed", { status: 405 });
        return NextResponse.json({ message: "Method Not Allowed", 
        status: 405
         });
        }
    
        const { email } = await req.json(); // Assuming only email is sent in the request body
        if (!email) {
        // return new NextResponse("Invalid request", { status: 400 });
        return NextResponse.json({ message: "Invalid request",
            status: 400
            });
        }
    
        // Find user by email
        const user = await prisma.applicant.findUnique({
        where: { email },
        select:{
            id:true,
            username:true,
            email:true,
        }
        });
    /* return user data */
       
        if (!user) {
        // return new NextResponse("User not found", { status: 404 });
        return NextResponse.json({ message: "User not found",
            status: 404
            });
        }

        //delete user data
        const deleteuser = await prisma.applicant.delete({
            where: { id: user.id },
          })
          console.log(deleteuser)
            return  NextResponse.json({ 
            status: 200,
            message: `User with id ${user.id} deleted successfully`
            });

    }
    catch (error) {
        console.error(error);
        // return new NextResponse("Internal Server Error", { status: 500 });
        return NextResponse.json({ message: "Internal Server Error",
        status: 500
        });
    }
}