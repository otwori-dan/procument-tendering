// update profile pic
//fetch profile data
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
    
        const { email, profile_pic } = await req.json(); // Assuming only email is sent in the request body
        if (!email) {
        // return new NextResponse("Invalid request", { status: 400 });
        return NextResponse.json({ message: "Invalid request",
            status: 400
            });
        }
    
        // Find user by email
        const user = await prisma.applicant.update({
        where: { email },
        data: {
            profile_pic,
        },
        select:{
            id:true,
            username:true,
            email:true,
            createdAt:true,
            updatedAt:true,
            password: false,
            profile_pic: true,
            isVerified: true,
        }
        });

        if (!user) {
        // return new NextResponse("User not found", { status: 404 });
        return NextResponse.json({ message: "User not found",
            status: 404
            });
        }

       // update profile pic
       const updatedUser = await prisma.applicant.update({
        where: { email },
        data: {
            profile_pic: profile_pic,
        },
        select:{
            id:true,
            username:true,
            email:true,
            createdAt:true,
            updatedAt:true,
            password: false,
            profile_pic: true,
            isVerified: true,
        }
        });

        return  NextResponse.json({ message: "ok",
        status: 200,
        user: updatedUser
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