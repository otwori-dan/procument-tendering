import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request, res: Response) {
 
  try {
    const data = await req.json();
     console.log("data", data);
     
    // Validate request body
    if (!data) {
      return new NextResponse("Invalid request", { status: 400 });
    }

    // Extract token from request body
    const { token, email } = data;

    // Validate token (e.g., check for valid format and expiration)
    if (!token) {
      // return new NextResponse("Invalid or expired verification token", { status: 400 });
      return NextResponse.json({ message: "Invalid or expired verification token", 
        status: 400
       });
    }

    // Find user with matching token
    const user = await prisma.applicant.findUnique({
       where:{
              verificationToken: token,
                email: email,
       },
       select:{
                id: true,
                username: true,
                email: true,
                password: true,
                isVerified: true,
                verificationToken: true,
       }
       
    });
    console.log("user", user);
    

    if (!user) {
      // return new NextResponse("Invalid verification token", { status: 400 });
      return NextResponse.json({ message: "Invalid verification token", 
        status: 400
       });
    }

    // Update user's verification status
    await prisma.applicant.update({
      where: { id: user.id },
      data: { isVerified: true, verificationToken: null }, // Clear token after verification
    });

    // return new NextResponse("Email verified successfully!", { status: 200 });
    return NextResponse.json({ message: "Email verified successfully!", 
        status: 200
       });
  } catch (error: any) {
    console.error(error);
    // return new NextResponse('Something went wrong!', { status: 500 });
    return NextResponse.json({ message: error.message,
        status: 500
       });
  }
}
